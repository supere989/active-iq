# VectorGuard: Model-Bound Encryption System - Technology Specification

*Derived from the `vectorchat-daemon-rs` reference implementation (Rust)*

## Executive Summary

VectorGuard is a model-bound encryption system for AI-to-AI communication. It derives permutation streams from AI model weights and runtime activation entropy, then applies those streams through digit tumbling — a base-10 mechanical stepping cipher — to protect tokenizer outputs before they reach the transport layer.

**What makes it encryption, not just obfuscation:**
- Reversible transformation with a well-defined key (model state + bilateral Helix exchange)
- Confidentiality: plaintext unrecoverable without the correct keystream
- Integrity: VectorHash signatures on packet headers and payloads
- Authentication: 5-component VectorID + bilateral Helix exchange + TokenRing challenge
- Replay protection: monotonic u64 sequence counters per session

**What distinguishes it from traditional cryptography:**
- Key material derives from a novel source — the geometric structure of neural network weight spaces — rather than from mathematical hardness assumptions (factoring, discrete log, lattice problems)
- The core cipher operates in base-10 (digit tumbling) rather than binary XOR
- Security surface scales directly with AI model size: larger models yield exponentially more measurement pairs

## Core Architecture

### Encryption Pipeline (Two Layers)

```
                    LAYER 1: VectorStream (Digit Tumbling)
                    ┌─────────────────────────────────────┐
  Plaintext ──────► │ bytes → digits → tumbler_add(d, ks) │ ──► Tumbled payload
                    │   ks = VectorFlow + VectorHeliXX    │
                    └─────────────────────────────────────┘
                                      │
                    LAYER 2: Frame Transport (XOR Cipher)
                    ┌─────────────────────────────────────┐
  Tumbled payload ► │ Fixed 2048-byte frame               │ ──► Wire bytes
                    │ XOR with VectorHash keystream       │
                    │ Counter-mode expansion               │
                    └─────────────────────────────────────┘
```

### Component Summary

| Component | Role | Algorithm | I/O |
|-----------|------|-----------|-----|
| **EMDM** | Geometric key derivation | Euclidean distance between 3D point cloud pairs | FP32 weights → digit stream (0-9) |
| **VectorFlow** | Keystream generation | `(reservoir[i] + header[i % 256] + position) % 10` | Model state → digits (0-9) |
| **VectorHeliXX** | Bilateral consensus | Tumbler addition of interleaved primary/secondary reservoirs | Two model states → shared digits |
| **VectorStream** | Core encryption | Per-digit tumbler addition: `CT[i] = tumbler_add(PT[i], KS[i])` | Plaintext digits → ciphertext digits |
| **VectorLock** | Data-at-rest encryption | 3x3x3 lattice block permutation (Rubik's Cube mixer) | Plaintext bytes → permuted 27-byte blocks |
| **VectorHash** | Cryptographic hash | Algorithm D: 5-step (nonce mix → tumble → distance diffusion → MDS → squeeze) | Arbitrary bytes → 256-bit hash |
| **Frame Layer** | Transport encryption | XOR with VectorHash-derived counter-mode keystream | Payload → fixed 2048-byte encrypted frame |

---

## 1. Tumbler Arithmetic — The Core Cipher

The fundamental operation is **mechanical digit stepping in base-10**, not modular arithmetic or XOR.

```rust
// Encode: step forward
pub fn tumbler_add_digit(a: u8, steps: u8) -> u8 {
    let mut res = a;
    for _ in 0..steps {
        res += 1;
        if res == 10 { res = 0; }  // wrap 9 → 0
    }
    res
}

// Decode: step backward (exact inverse)
pub fn tumbler_sub_digit(a: u8, steps: u8) -> u8 {
    let mut res = a;
    for _ in 0..steps {
        if res == 0 { res = 9; } else { res -= 1; }  // wrap 0 → 9
    }
    res
}
```

**Properties:**
- Deterministic: `tumbler_sub(tumbler_add(x, k), k) == x` for all x, k
- Operates per-digit, not per-byte — finer granularity than byte-level XOR
- Each digit position uses a different keystream value
- The comment in the source: *"The operation is action mechanical in nature"*

---

## 2. EMDM — Euclidean Mean Derivation Measurement

Converts raw FP32 model weight values into digit streams through 3D geometric measurements.

### Point Cloud Construction

```rust
pub struct Point3D { pub x: f64, pub y: f64, pub z: f64 }

// Flat FP32 array → groups of 3 → 3D points
pub fn build_layer_cloud(values: &[f64]) -> Vec<Point3D> {
    values.chunks_exact(3)
        .map(|c| Point3D { x: c[0], y: c[1], z: c[2] })
        .collect()
}
```

### Measurement

```rust
pub fn euclidean_distance_3d(a: Point3D, b: Point3D) -> f64 {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dz = b.z - a.z;
    (dx*dx + dy*dy + dz*dz).sqrt()
}

// For each aligned pair in Cloud A and Cloud B:
pub fn compute_emdm_for_pair(cloud_a: &[Point3D], cloud_b: &[Point3D]) -> Vec<f64> {
    cloud_a.iter().zip(cloud_b.iter())
        .map(|(a, b)| euclidean_distance_3d(*a, *b))
        .collect()
}
```

### Digit Extraction — IEEE 754 Noise Exploitation

```rust
pub fn extract_digits_from_float(value: f64, max_digits: Option<usize>) -> Vec<u8> {
    // Format with 17 decimal places to capture IEEE 754 precision noise
    // "noise from precision is exactly what we are after"
    let s = format!("{:.17}", value);
    // Trim trailing zeros (numpy parity: trim='k')
    // Extract 0-9 digits from the resulting string
}
```

The 17-decimal-place precision captures floating-point representation noise that acts as a "digit constructor system" — deterministic per model but unique per weight configuration.

---

## 3. VectorFlow — Keystream Generation

Consumes a model-derived digit reservoir to produce the keystream for tumbling.

```rust
pub struct VectorFlow {
    reservoir: Vec<i32>,     // Model state digits (from EMDM or FFI bridge)
    headers: Vec<i32>,       // Max 256 elements (synchronization metadata)
    position: usize,         // Current consumption position
    total_consumed: usize,
}

pub fn generate_cypher_stream(&mut self, length: usize) -> Vec<i32> {
    let chunk = &self.reservoir[self.position..self.position + length];

    // Tile headers cyclically
    let header_cycle: Vec<i32> = self.headers.iter()
        .cycle().take(length).cloned().collect();

    // Mix: (Reservoir + Header + Position) % 10
    let mixed: Vec<i32> = chunk.iter()
        .zip(header_cycle.iter())
        .map(|(&r, &h)| (r + h + self.position as i32) % 10)
        .collect();

    self.position += length;
    self.total_consumed += length;
    mixed
}
```

**Formula:** `keystream[i] = (reservoir[i] + header[i % 256] + position) % 10`

---

## 4. VectorHeliXX — Bilateral Consensus Layer

Merges keystreams from two communicating models into a shared stream.

```rust
pub struct VectorHeliXX {
    pub primary_reservoir: Vec<i32>,     // Local model contribution
    pub secondary_reservoir: Vec<i32>,   // Partner model contribution
    pub shared_digits: Vec<i32>,         // Interleaved bilateral stream
    pub mode: HeliXXMode,                // Primary or Secondary
    pub position: AtomicUsize,
}

pub enum HeliXXMode {
    Primary,    // Interleave: [P, S, P, S, ...]
    Secondary,  // Interleave: [S, P, S, P, ...]
}
```

**Bilateral operations use tumbler arithmetic:**
```rust
// Derive shared secret: S = tumbler_add(L_peer, L_local)
pub fn derive_shared_secret(l_local: &[i32], l_peer: &[i32]) -> Vec<i32>

// Mask local strand for transmission: M = tumbler_add(L_local, bridge)
pub fn mask_strand(l_local: &[i32], bridge: &[i32]) -> Vec<i32>

// Unmask received strand: L_peer = tumbler_sub(masked, bridge)
pub fn unmask_strand(masked: &[i32], bridge: &[i32]) -> Vec<i32>
```

---

## 5. VectorStream — Full Encryption Pipeline

Applies the combined VectorFlow + VectorHeliXX keystream to plaintext via digit tumbling.

### Data Encoding Templates

```rust
pub enum DataTemplate {
    BinaryToken,     // 8 binary digits per byte (for token IDs)
    DecimalPayload,  // 3 decimal digits per byte (for arbitrary data: 000-255)
}
```

### Block Tumbling

```rust
pub fn tumble_block(&self, digits: &mut [u8]) {
    // 1. Generate keystream from VectorFlow (or GPU FFI bridge)
    let mut cypher = self.flow.generate_cypher_stream(digits.len());

    // 2. Mix with VectorHeliXX bilateral consensus (if active)
    if let Some(ref h) = self.helixx {
        let h_digits = h.get_digits(digits.len());
        for (i, &hd) in h_digits.iter().enumerate() {
            cypher[i] = tumbler_add_digit(cypher[i], hd);
        }
    }

    // 3. Apply tumbler addition: ciphertext = tumbler_add(plaintext, keystream)
    for (i, d) in digits.iter_mut().enumerate() {
        let cypher_digit = cypher.get(i).cloned().unwrap_or(0);
        *d = tumbler_add_digit(*d as u8, cypher_digit) as u8;
    }
}
```

**Decryption** uses `tumbler_sub_digit` — the exact inverse operation.

---

## 6. VectorHash — Algorithm D (Cryptographic Hash)

A model-bound hash function used for integrity, signatures, and key derivation.

### 5-Step Process

1. **Sample Serialization**: Convert input to bytes with 4-byte length header
2. **Nonce Mixing**: Partition into 32-byte blocks, XOR each with expanded nonce
3. **Tumbling Pass**: Apply VectorStream-style digit permutation to block triples
4. **Distance Diffusion**: Helix Cartesian distance kernel + 4x4 MDS matrix mixing
5. **Final Squeeze**: Counter-mode expansion to desired output length

### MDS Matrix (diffusion layer)

```rust
const MDS_MATRIX: [[u8; 4]; 4] = [
    [2, 3, 1, 1],
    [1, 2, 3, 1],
    [1, 1, 2, 3],
    [3, 1, 1, 2],
];
```

### Geometric Distance Diffusion

```rust
fn helix_distances(&self, blocks: &[Vec<u8>]) -> Vec<u8> {
    // Extract two 3D points (12 bytes each) from each 24-byte block
    // Compute Euclidean distance between the pair
    // Map: ((distance * 10.0) as u32 & 0xFF) as u8
}
```

### Usage

```rust
VectorHash::hash_with_nonce(data, nonce, 32)  // → 256-bit hash
```

**Used for:** header signing, packet signatures, session key derivation, keystream expansion.

---

## 7. VectorLock — Data-at-Rest Block Cipher

A 3x3x3 lattice permutation cipher for protecting stored data.

```rust
pub struct VectorLock {
    lattice_map: [usize; 27],    // Permutation table
    inverse_map: [usize; 27],    // For decryption
}
```

**Process:**
1. Derive permutation from key material (model-bound)
2. Prepend 4-byte length header to plaintext
3. Pad to multiple of 27 bytes
4. Apply lattice permutation to each 27-byte block
5. Decryption uses the precomputed inverse permutation

---

## 8. Frame Transport Layer

Fixed-size 2048-byte encrypted frames for wire transmission.

### Frame Structure

| Field | Size | Description |
|-------|------|-------------|
| Magic | 2 bytes | `"VN"` |
| Version | 1 byte | `0x01` |
| Flags | 1 byte | Control flags |
| Sequence | 4 bytes | u32 big-endian (anti-replay) |
| Payload Length | 2 bytes | u16 big-endian |
| Reserved | 6 bytes | Zeros |
| Payload | up to 2032 bytes | Tumbled ciphertext |
| Padding | variable | Zeros to 2048 |

### Encryption

```rust
// Keystream: counter-mode VectorHash expansion
fn expand_keystream(session_key: &[u8], seq: u32, length: usize) -> Vec<u8> {
    // For each counter value:
    //   material = session_key | "|" | seq (4 bytes) | counter (4 bytes)
    //   hash = VectorHash::hash_with_nonce(&material, &[], 32)
    //   append hash to keystream
}

// Frame encryption: XOR plaintext with keystream
let ciphertext = xor_bytes(&plaintext, &keystream);
```

### Session Key Derivation

```rust
pub fn derive_session_key(
    session_id: &str,
    local_ab: &str,   // Local model identity stream
    peer_ab: &str,     // Peer model identity stream
    local_cd: &str,    // Local user identity stream
    peer_cd: &str,     // Peer user identity stream
) -> Vec<u8> {
    let material = format!(
        "vn_session_key|{}|{}|{}|{}|{}",
        session_id, local_ab, peer_ab, local_cd, peer_cd
    );
    VectorHash::hash_with_nonce(material.as_bytes(), &[], 32)
}
```

---

## 9. VectorStreamPacket — Wire Protocol

### Packet Structure

```rust
pub struct VectorStreamPacket {
    pub routing: RoutingHeader,              // L1 signed header
    pub policy: PolicyHeader,                // Contract/policy metadata
    pub ciphertext: Vec<u8>,                 // Tumbled payload
    pub sequence: u64,                       // Anti-replay counter
    pub end_of_stream: bool,
    pub sent_at_unix_ms: u64,
    pub vectorhash_signature: Vec<u8>,       // Packet integrity
    pub watermark_label: String,
    pub msg_type: PacketType,                // Prompt | Response | Control | Flow
}
```

### Anti-MITM Features

- **Negative token trojans**: Random tokens negated before tumbling (density ~23%). Absence after decoding indicates MITM tampering.
- **Hidden data injection**: Deterministic canary bytes inserted at content-hash-derived positions.
- **Dual signatures**: Routing header signed independently of packet body.

---

## 10. Bridge KDF — Deterministic Stream Generation

Used for masking strands during Helix exchange and layer selection.

```rust
pub fn bridge_kdf(psk: &str, ctx_bytes: &[u8], total_digits: usize) -> Vec<u8> {
    // Seed: b"BRIDGE|" + psk + b"|" + context
    // Iterate: acc = tumbler_add_digit(acc, seed[i % seed.len()])
    // Output: deterministic digit stream
}
```

---

## Security Properties

| Property | Mechanism |
|----------|-----------|
| **Confidentiality** | Digit tumbling (Layer 1) + XOR frame cipher (Layer 2) |
| **Integrity** | VectorHash signatures on routing headers and packet bodies |
| **Authentication** | 5-component VectorID + bilateral Helix exchange + TokenRing |
| **Replay protection** | Monotonic u64 sequence counters, frame sequence validation |
| **Model binding** | Keystream derived from specific model weights and activations |
| **Session isolation** | Unique session keys from AB/CD stream combinations |
| **MITM detection** | Negative token trojans + hidden data canaries |
| **Anti-pattern analysis** | Fixed 2048-byte frames with padding eliminate size-based inference |

---

## VectorGuard-Nano vs Full VectorGuard

| Aspect | Nano (v2) | Full (Enterprise) |
|--------|-----------|-------------------|
| **Core cipher** | Multi-round Unicode character shifting | Per-digit base-10 tumbler stepping |
| **Keystream source** | EMDM from HF weight samples + HMAC-SHA256 chain | EMDM from local model + bilateral VectorHeliXX consensus |
| **Transport security** | None (application-level only) | Fixed 2048-byte XOR frames with VectorHash keystream |
| **Integrity** | None | VectorHash signatures (header + packet) |
| **Authentication** | Shared secret + address commitment | 5-component VectorID + TokenRing challenge (42 samples) |
| **MITM detection** | None | Negative token trojans + hidden data canaries |
| **Ratchet** | Table-ratchet-forward (Cloud B advances) | Helix mode rotation + session key regeneration |
| **Classification** | Geometric obfuscation | Model-bound encryption |
