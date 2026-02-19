# VectorGuard Helix Protocol — Session Establishment & Identity Verification

*Derived from the `vectorchat-daemon-rs` reference implementation (Rust)*

## Overview

The Helix protocol orchestrates the full lifecycle of a secure VectorGuard session: identity exchange, bilateral cloud measurement, shared keystream derivation, and peer verification. It combines three subsystems:

1. **Handshake State Machine** — A 16-state protocol that governs message sequencing between Initiator and Acceptor
2. **VectorHeliXX** — Bilateral digit-stream entanglement using tumbler arithmetic to mask, transmit, and derive shared keystreams
3. **TokenRing** — A 42-sample challenge/response system that validates peer identity through AB/CD stream segments published to IPFS

**Key design constraint:** No classical key exchange occurs. Both sides derive keystream material from their own model weights and the bilateral EMDM measurements. The "lock" is the derivation algorithm; the "key" is the model itself.

---

## 1. Handshake State Machine

### 1.1 States

```rust
pub enum HandshakeState {
    // --- Identity Exchange ---
    Idle,                       // Initial state
    InitiatorHelloSent,         // Initiator sent identity_hello
    InitiatorHelloReceived,     // Acceptor received initiator's hello
    AcceptorHelloSent,          // Acceptor sent identity_hello
    AcceptorHelloReceived,      // Initiator received acceptor's hello
    InitiatorVerifiedSent,      // Initiator sent identity_verified
    AcceptorVerifiedSent,       // Acceptor sent identity_verified
    AcceptorVerifiedReceived,   // Initiator received acceptor's verified

    // --- Helix Exchange ---
    HelixContextSent,           // Initiator proposed HelixContext
    HelixContextAckSent,        // Acceptor acknowledged, ready for Cloud A
    HelixCloudASent,            // Initiator sent Cloud A headers
    HelixCloudBSent,            // Acceptor sent Cloud B headers
    HelixDerivationComplete,    // Initiator derived shared secret from Cloud B

    // --- TokenRing Verification ---
    TokenRingChallengeSent,     // Initiator sent AB stream challenge
    TokenRingResponseSent,      // Acceptor sent CD stream response

    // --- Terminal ---
    Complete,                   // Handshake successful
    Failed,                     // Handshake failed (with reason)
}
```

### 1.2 Roles

| Role | Responsibilities |
|------|-----------------|
| **Initiator** | Proposes HelixContext, sends Cloud A, issues TokenRing challenge, validates CD stream |
| **Acceptor** | Responds with Cloud B, answers TokenRing challenge with CD stream |

### 1.3 Message Types

```rust
pub enum HandshakeMessage {
    // Identity Phase
    IdentityHello(PeerIdentity),
    IdentityVerified { status: VerifyStatus, reason, nonce_echo },

    // Helix Exchange Phase
    HelixContext(HelixContext),
    HelixContextAck { session_id },
    HelixCloudA(CloudHeaders),
    HelixCloudB(CloudHeaders),

    // TokenRing Phase
    TokenRingChallenge { stream_type, stream_segment, sample_index, nonce, timestamp },
    TokenRingResponse { stream_type, stream_segment, sample_index, nonce_echo, timestamp },
}
```

### 1.4 Full Protocol Flow

```
  Initiator (A₁)                              Acceptor (A₂)
  ═══════════════                              ═══════════════

  ┌─ Phase 1: Identity Exchange ─────────────────────────────┐

  Idle
    │── IdentityHello(A₁ identity) ──────────►│
  InitiatorHelloSent                          InitiatorHelloReceived
                                                │── Validate via PolicyEngine
    │◄── IdentityHello(A₂ identity) ──────────│
  AcceptorHelloReceived                       AcceptorHelloSent
    │── Validate via PolicyEngine
    │── IdentityVerified(ok) ─────────────────►│
  InitiatorVerifiedSent                       AcceptorVerifiedSent
    │◄── IdentityVerified(ok) ────────────────│
  AcceptorVerifiedReceived

  └──────────────────────────────────────────────────────────┘

  ┌─ Phase 2: Helix Cloud Exchange ──────────────────────────┐

    │── HelixContext(session_id, nonce, ts) ──►│
  HelixContextSent                            HelixContextAckSent
    │◄── HelixContextAck ────────────────────│
    │
    │── generate_cloud_a(context, identity)
    │── HelixCloudA(headers_A) ──────────────►│
  HelixCloudASent                               │── generate_cloud_b(context, headers_A)
    │◄── HelixCloudB(headers_B) ─────────────│
                                              HelixCloudBSent
    │── derive_shared_secret(headers_A, headers_B)
    │── Build VectorHeliXX(primary, secondary)
  HelixDerivationComplete

  └──────────────────────────────────────────────────────────┘

  ┌─ Phase 3: TokenRing Verification ────────────────────────┐

    │── TokenRingChallenge(AB stream[0:32]) ──►│
  TokenRingChallengeSent                        │── Validate AB against identity doc
    │◄── TokenRingResponse(CD stream[0:32]) ──│
    │── Validate CD against peer identity doc   Complete (Acceptor)
    │── CD matches → Complete
  Complete (Initiator)

  └──────────────────────────────────────────────────────────┘
```

---

## 2. VectorID — 5-Component Identity

Every peer in a VectorGuard session carries a **VectorID** composed of five independently verifiable components:

```rust
pub struct VectorId {
    pub model_id_cid: String,       // Component 1: Model_ID
    pub device_id_cid: String,      // Component 2: Device_ID
    pub user_id_cid: String,        // Component 3: User_ID
    pub ipfs_node_id_cid: String,   // Component 4: IPFS_Node_ID
    pub twofa_id_cid: Option<String>, // Component 5: 2FA_ID (optional)
    pub daemon_cid: String,         // Aggregate CID
}
```

### Component Details

| # | Component | Source | Key Fields |
|---|-----------|--------|------------|
| 1 | **Model_ID** | AI model weights | `ab_stream`, `cd_stream`, `stream_generation_method` (GPU fractal recursion / CPU fallback / hybrid) |
| 2 | **Device_ID** | Hardware attestation | `device_fingerprint`, `attestation_method` (TPM / SEV / None) |
| 3 | **User_ID** | Activation proof | `activation_proof_cid` (CID of TEMP=0 capture for TSK derivation), `identity_policy` |
| 4 | **IPFS_Node_ID** | IPFS identity | `node_id` (PeerID), `public_key`, `private_key_cid` (encrypted, stored on IPFS) |
| 5 | **2FA_ID** | Second factor | `method` (GoogleOAuth / YubiKey / FIDO2 / Passkey), `verified` |

**Critical constraint:** VectorStream TSK digits are **never persisted**. Only the activation proof CID is stored; the TSK is regenerated on demand from the model.

### PeerIdentity (Wire Format)

The identity exchanged during handshake carries the CIDs plus live AB/CD stream segments:

```rust
pub struct PeerIdentity {
    pub identity_cid: String,
    pub vectorid_fingerprint_cid: String,
    pub model_cid: String,
    pub capabilities: Vec<String>,
    pub user_id: String,
    pub nonce: String,
    pub timestamp: String,
    pub ab_stream: Option<String>,  // First 32 digits
    pub cd_stream: Option<String>,  // First 32 digits
}
```

---

## 3. Helix Service — Cloud Generation

The `HelixService` trait defines the interface for generating EMDM-derived cloud data:

```rust
#[async_trait]
pub trait HelixService: Send + Sync {
    /// Generate a fresh Helix Context for a new session
    async fn generate_context(&self, session_id: &str) -> HelixContext;

    /// Generate Cloud A (Initiator's contribution)
    /// Returns: (secret stream digits, public headers)
    async fn generate_cloud_a(
        &self, context: &HelixContext, identity: &PeerIdentity,
    ) -> (Vec<i32>, CloudHeaders);

    /// Generate Cloud B (Responder's contribution)
    /// Receives Cloud A headers to condition its sampling
    async fn generate_cloud_b(
        &self, context: &HelixContext, peer_cloud_a: &CloudHeaders, identity: &PeerIdentity,
    ) -> (Vec<i32>, CloudHeaders);

    /// Derive shared secret (Initiator processes Cloud B)
    async fn derive_shared_secret(
        &self, context: &HelixContext, my_cloud_a: &CloudHeaders, peer_cloud_b: &CloudHeaders,
    ) -> Vec<i32>;
}
```

### HelixContext

```rust
pub struct HelixContext {
    pub session_id: String,
    pub timestamp: String,          // RFC 3339
    pub nonce: String,              // UUID v4
    pub protocol_version: String,   // "helix_v2.0"
}
```

### CloudHeaders

```rust
pub struct CloudHeaders {
    pub cloud_id: String,       // "A" or "B"
    pub headers: Vec<i32>,      // First 32 sampled point indices
    pub signature: String,      // Integrity: "{session_id}:{residue_digits}"
}
```

### EMDM Sampling Process

In the full enterprise implementation, Cloud A and Cloud B are derived from actual model weight/activation EMDM:

1. **Table Construction**: Session prompts capture FP32 activation tensors for selected layers. Each layer populates a 32×64 table. Baseline weights populate mirror table B₁.
2. **Triplet Mapping**: Table values transposed into `(x, y, z)` point clouds.
3. **Vector Sampling**: For each aligned pair `(Lⱼ, Pⱼ)`, compute the Euclidean vector and sample FP32 coordinates at 25%, 50%, 75%.
4. **Digit Extraction**: IEEE 754 noise at 17-decimal precision → digit stream (0-9).

```rust
pub fn extract_digits_from_float(value: f64, max_digits: Option<usize>) -> Vec<u8> {
    // "noise from precision is exactly what we are after"
    let s = format!("{:.17}", value);
    // Trim trailing zeros (numpy parity: trim='k')
    // Extract 0-9 digits from the resulting string
}
```

The baseline implementation uses VectorHash (Algorithm D) for entropy generation when GPU/model access is unavailable:

```rust
fn simulate_derivation(&self, seed: &str) -> Vec<i32> {
    let hasher = VectorHash::new(seed.as_bytes().to_vec());
    let output_bytes = hasher.hash(b"helix_baseline_stream", 10240);
    // Convert bytes → 3 decimal digits each → ~30k digit stream
}
```

---

## 4. VectorHeliXX — Bilateral Entanglement

VectorHeliXX merges two model-derived digit reservoirs into a single shared stream using interleaved construction and tumbler arithmetic for strand protection during exchange.

### 4.1 Structure

```rust
pub struct VectorHeliXX {
    pub primary_reservoir: Vec<i32>,    // Local model contribution
    pub secondary_reservoir: Vec<i32>,  // Partner model contribution
    pub shared_digits: Vec<i32>,        // Interleaved bilateral stream
    pub mode: HeliXXMode,
    pub position: AtomicUsize,          // Current consumption position
}

pub enum HeliXXMode {
    Primary,    // Interleave: [P, S, P, S, ...]
    Secondary,  // Interleave: [S, P, S, P, ...]
}
```

### 4.2 Interleaving

The shared digit stream is constructed by interleaving primary and secondary reservoirs:

```rust
// Primary mode:   [P₀, S₀, P₁, S₁, P₂, S₂, ...]
// Secondary mode: [S₀, P₀, S₁, P₁, S₂, P₂, ...]
```

Mode rotation (`rotate_mode()`) spirals the helix by swapping the interleave pattern and recomputing `shared_digits`. This enables session key regeneration without re-running the full EMDM exchange.

### 4.3 Strand Masking (Tumbler Arithmetic)

During the Helix exchange, each side must transmit its strand to the peer without exposing it to intermediaries. Strands are masked using a Bridge KDF-derived stream:

```rust
/// Mask local strand for transmission: M = L_local ⊕ₜ bridge
pub fn mask_strand(l_local: &[i32], bridge: &[i32]) -> Vec<i32> {
    tumbler_add_lists(l_local, bridge)
}

/// Unmask received strand: L_peer = M ⊖ₜ bridge
pub fn unmask_strand(masked: &[i32], bridge: &[i32]) -> Vec<i32> {
    tumbler_sub_lists(masked, bridge)
}

/// Derive shared secret: S = L_peer ⊕ₜ L_local
pub fn derive_shared_secret(l_local: &[i32], l_peer: &[i32]) -> Vec<i32> {
    tumbler_add_lists(l_peer, l_local)
}
```

Where `⊕ₜ` and `⊖ₜ` denote element-wise tumbler addition and subtraction (base-10 mechanical stepping, not modular arithmetic):

```rust
pub fn tumbler_add_digit(a: i32, steps: i32) -> i32 {
    let mut res = a;
    for _ in 0..steps.abs() {
        res += 1;
        if res == 10 { res = 0; }  // wrap 9 → 0
    }
    res
}

pub fn tumbler_sub_digit(a: i32, steps: i32) -> i32 {
    let mut res = a;
    for _ in 0..steps.abs() {
        res -= 1;
        if res == -1 { res = 9; }  // wrap 0 → 9
    }
    res
}
```

### 4.4 Stream Consumption

```rust
/// Advance position and return next `length` digits
pub fn get_digits(&self, length: usize) -> Vec<i32>

/// Read without advancing (for preview/diagnostics)
pub fn peek_digits(&self, length: usize) -> Vec<i32>

/// Reset consumption to start
pub fn reset(&self)
```

The VectorHeliXX is transferred from the handshake session to the transport layer upon completion. The handshake manager uses `session.helix_state.take()` — destructive move — ensuring the helix state exists in exactly one owner at any time.

### 4.5 Bridge KDF

The bridge stream used for masking is derived deterministically from a pre-shared key and context:

```rust
pub fn bridge_kdf(psk: &str, ctx_bytes: &[u8], total_digits: usize) -> Vec<u8> {
    // Seed: b"BRIDGE|" + psk + b"|" + context
    // Iterate: acc = tumbler_add_digit(acc, seed[i % seed.len()])
    // Output: deterministic digit stream (0-9)
}
```

---

## 5. TokenRing — Peer Verification

After the Helix exchange completes, the Initiator issues a TokenRing challenge to verify that the peer's AB/CD streams match their published identity document.

### 5.1 Challenge Flow

1. **Initiator** sends `TokenRingChallenge` containing the first 32 digits of its own AB stream plus a nonce.
2. **Acceptor** validates the AB stream against the Initiator's identity document, then responds with its own CD stream segment.
3. **Initiator** validates the received CD stream against the peer's identity document.
4. **Mismatch** triggers `HandshakeState::Failed` with reason `"tokenring_validation_failed"` and a MITM warning:

```rust
if stream_segment != expected_segment {
    error!("[TokenRing] CD stream mismatch! MITM detected?");
    session.state = HandshakeState::Failed;
    session.failure_reason = Some("tokenring_validation_failed".to_string());
}
```

### 5.2 Entropy Pool (42 Samples)

The TokenRing challenge material is drawn from a rotatable pool of 42 pre-generated AB/CD stream samples:

```rust
pub const DEFAULT_SAMPLE_COUNT: usize = 42;

pub struct EntropyPoolSample {
    pub cid: String,                    // IPFS CID of fingerprint data
    pub timestamp: DateTime<Utc>,
    pub index: usize,                   // 0-41
    pub ab_stream: Option<String>,      // Derived AB stream segment
    pub cd_stream: Option<String>,      // Derived CD stream segment
}
```

**Pool generation** uses VectorHash to derive unique AB/CD segments per sample index:

```rust
// For each sample i in 0..42:
let sample_seed = format!("{}_sample_{}", identity_cid, i);
let ab_hash = VectorHash::hash_with_nonce(
    format!("ab_{}_{}", ab_stream, sample_seed).as_bytes(),
    &[i as u8], 32,
);
let cd_hash = VectorHash::hash_with_nonce(
    format!("cd_{}_{}", cd_stream, sample_seed).as_bytes(),
    &[i as u8], 32,
);
```

**Selection modes:**
- `select_random()` — Random index for unpredictable challenge selection
- `select_next()` — Sequential rotation with wrap-around (for scheduled rotation)
- `select_by_index(i)` — Direct lookup

**IPFS integration:** Each sample can be published to IPFS for decentralized verification. When IPFS is unavailable, mock CIDs are generated from VectorHash for local operation.

### 5.3 VectorID Stream Utilities

Nonce mixing spreads a per-message nonce into the stream segment to prevent replay:

```rust
pub fn mix_nonce(segment: &[i32], nonce: &[u8]) -> Vec<i32> {
    let mut mixed = segment.to_vec();
    for (i, &byte) in nonce.iter().enumerate() {
        let offset = (byte as usize) % mixed.len();
        mixed[offset] = (mixed[offset] + (byte as i32)) % 10;
        // Spread effect
        if i + 1 < mixed.len() {
            mixed[i+1] = (mixed[i+1] + (byte as i32 / 10)) % 10;
        }
    }
    mixed
}
```

---

## 6. Session Key Derivation

After the handshake completes, the transport layer derives a session key from the bilateral identity material:

```rust
pub fn derive_session_key(
    session_id: &str,
    local_ab: &str,    // Local model's AB stream
    peer_ab: &str,     // Peer model's AB stream
    local_cd: &str,    // Local user's CD stream
    peer_cd: &str,     // Peer user's CD stream
) -> Vec<u8> {
    let material = format!(
        "vn_session_key|{}|{}|{}|{}|{}",
        session_id, local_ab, peer_ab, local_cd, peer_cd
    );
    VectorHash::hash_with_nonce(material.as_bytes(), &[], 32)
}
```

This session key feeds the frame transport layer's counter-mode keystream expansion (see VectorGuard-v2.md §8).

---

## 7. Policy Engine

Identity verification is mediated by a pluggable policy engine:

```rust
#[async_trait]
pub trait PolicyEngine: Send + Sync {
    async fn validate_peer(
        &self,
        peer: &PeerIdentity,
        identity_doc: Option<&serde_json::Value>,
    ) -> (bool, Option<String>);  // (is_valid, rejection_reason)
}
```

The default implementation (`DefaultPolicyEngine`) accepts all peers. Enterprise deployments implement custom policies for:
- Model CID allowlisting
- Capability matching
- Geographic or organizational restrictions
- Identity document schema validation

---

## 8. Security Properties

| Property | Mechanism |
|----------|-----------|
| **No classical key exchange** | Keystreams derive from bilateral EMDM of model weights, not from DH/ECDH |
| **Strand protection** | Bridge KDF + tumbler masking prevents intermediaries from reading raw strands |
| **MITM detection** | TokenRing CD-stream validation against published identity documents |
| **Replay prevention** | Per-session nonces in HelixContext, per-message nonces in TokenRing |
| **Identity binding** | 5-component VectorID ties session to specific model + device + user + node + 2FA |
| **Session isolation** | Unique HelixContext nonce → unique cloud generation → unique shared digits |
| **Mode rotation** | HeliXX mode spiraling changes interleave pattern without re-exchanging clouds |
| **Rotatable challenges** | 42-sample entropy pool prevents challenge prediction |
| **Decentralized verification** | IPFS-backed entropy pool samples enable trustless identity validation |
| **Forward secrecy** | Helix state is destructively moved from handshake to transport; old material is dropped |

---

## VectorGuard-Nano vs Enterprise Helix

| Aspect | Nano v2 | Enterprise (Rust) |
|--------|---------|-------------------|
| **Cloud generation** | HF weight samples via HTTP API | Local model EMDM with GPU acceleration |
| **Stream construction** | EMDM + HMAC-SHA256 chain, XOR merge | VectorHash (Algorithm D) + bilateral VectorHeliXX interleaving |
| **Strand protection** | Shared secret (address commitment) | Bridge KDF + tumbler masking |
| **Identity verification** | None | 5-component VectorID + PolicyEngine + TokenRing (42 samples) |
| **Session management** | Table-ratchet-forward (Cloud B advances) | Helix mode rotation + session key regeneration |
| **Handshake** | Single address exchange | 16-state protocol with identity, Helix, and TokenRing phases |
| **Transport** | None (application-level only) | 2048-byte XOR frames with VectorHash counter-mode keystream |
