import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import VectorLock3D from './components/VectorLock3D';
import HelixDoubleHelix3D from './components/HelixDoubleHelix3D';

class VisualizationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    console.error('Visualization render error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Visualization error details:', error, info);
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;
    if (hasError) {
      if (typeof fallback === 'function') {
        return fallback(error);
      }
      if (fallback) {
        return fallback;
      }
      return (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-400/80 bg-slate-950 text-center text-sm text-slate-300">
          Visualization failed to render: {error?.message ?? 'Unknown error'}
        </div>
      );
    }
    return children;
  }
}

VisualizationErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};

VisualizationErrorBoundary.defaultProps = {
  fallback: null
};

const processSteps = [
  {
    label: 'Message Instantiation',
    sublabel: 'VectorGuard prompt envelope',
    icon: '✳️',
    color: 'bg-cyan-600',
    description:
      'Session kickoff declares Helix participation, advertises table count n, and records the first VectorStream header commitments before any tokens leave the originating model.'
  },
  {
    label: 'Baseline Anchor Harvest (B₁)',
    sublabel: 'Deterministic model weights',
    icon: '🧩',
    color: 'bg-indigo-600',
    description:
      'Cloud A exports the baseline anchor table B₁. Each deterministic anchor tuple Lⱼ is indexed for direct pairing with runtime activations.'
  },
  {
    label: 'Runtime Activation Capture (Tₙ)',
    sublabel: 'Session entropy tables',
    icon: '⚡',
    color: 'bg-emerald-600',
    description:
      'Cloud B records n activation tables Tₙ from live prompts, forming entropy tuples Pⱼ that align with their matching anchors.'
  },
  {
    label: 'Helix Pairing & Sampling',
    sublabel: 'EMDMⱼ,ₖ derivation',
    icon: '🛰️',
    color: 'bg-amber-600',
    description:
      'Helix links each Lⱼ with Pⱼ, samples Euclidean distances at k ∈ {0.25, 0.50, 0.75}, and constructs ordered headers Cₖ for stream alignment.'
  },
  {
    label: 'VectorStream Reservoir',
    sublabel: 'Header-guided digit pool',
    icon: '🌀',
    color: 'bg-purple-600',
    description:
      'The first 256 Cₖ entries form VectorStream headers, sequencing FP32 digits (decimal removed, sign preserved) into a shared reservoir.'
  },
  {
    label: 'First Message Decoding',
    sublabel: 'Tokenizer output protection',
    icon: '🔐',
    color: 'bg-rose-600',
    description:
      'VectorFlow consumes the reservoir to tumble outgoing tokens. The receiver mirrors the headers, reconstructs the digits, and recovers the first decoded message.'
  }
];

const helixNotationKey = [
  {
    symbol: 'B₁',
    description: 'Baseline anchor table populated from deterministic model weights (Cloud A).'
  },
  {
    symbol: 'Tₙ',
    description: 'Runtime activation tables (Cloud B) captured from session prompts; n is the configured table count.'
  },
  {
    symbol: 'Lⱼ',
    description: 'Anchor tuple at index j drawn from B₁.'
  },
  {
    symbol: 'Pⱼ',
    description: 'Entropy tuple aligned with Lⱼ, obtained from Tₙ activations.'
  },
  {
    symbol: 'EMDMⱼ,ₖ',
    description: 'Euclidean vector sample between Lⱼ and Pⱼ measured at fractional position k ∈ {0.25, 0.50, 0.75}.'
  },
  {
    symbol: 'Cₖ',
    description: 'Ordered calculation header {table_id, anchor_id, sample_index} that governs VectorStream alignment.'
  },
  {
    symbol: 'VectorStream Headers',
    description: 'First 256 Cₖ entries used to synchronize digit consumption across models.'
  },
  {
    symbol: 'VectorStream Reservoir',
    description: 'Concatenated FP32 samples (decimal removed, sign preserved) shared by both models for token and byte permutation.'
  }
];

const tupleSamples = [
  {
    layer: 'Layer 1',
    vector: 'Vector 012',
    tuple: ['0.21735290000223', '-0.03456789012345', '0.45678901234567']
  },
  {
    layer: 'Layer 4',
    vector: 'Vector 233',
    tuple: ['0.09876543210987', '-0.07654321098765', '0.02345678901234']
  },
  {
    layer: 'Layer 7',
    vector: 'Vector 781',
    tuple: ['0.08765432109876', '0.06543210987654', '-0.04567890123456']
  },
  {
    layer: 'Layer 14',
    vector: 'Vector 1402',
    tuple: ['0.03456789012345', '0.05678901234567', '0.07890123456789']
  }
];

const anchorModes = [
  {
    title: 'Sequential Anchor Shift',
    highlight: '(x₀, y₀, z₀) → (x₀+t₁, y₀+t₂, z₀+t₃)',
    points: [
      'Baseline anchor begins at (0,0,0) for Point Cloud A.',
      'Each tuple shifts the anchor by its values to the current anchor, cascading coordinate movement.',
      'Every shift produces a new obfuscation surface while maintaining deterministic reconstruction.'
    ]
  },
  {
    title: 'Anchor Dictionary Selection',
    highlight: 'anchorₖ ∈ {pre-computed tuples}',
    points: [
      'Anchor dictionary is derived from previous sessions or pre-selected entropy buckets.',
      'Random selection forces non-linear jumps in spatial projection.',
      'Combining sequential and dictionary anchors yields unbounded anchor permutations.'
    ]
  }
];

const recursionLayers = [
  {
    stage: 'Layer 1',
    description: 'Session activations → tuples → Point Cloud A → EMDM₁',
    color: 'bg-blue-600'
  },
  {
    stage: 'Layer 2',
    description: 'EMDM₁ → VectorGuard transform → Point Cloud B → EMDM₂',
    color: 'bg-purple-600'
  },
  {
    stage: 'Layer 3',
    description: 'EMDM₂ → Anchor shift → Point Cloud C → EMDM₃',
    color: 'bg-amber-500'
  },
  {
    stage: 'Layer ∞',
    description: 'Recursive binding continues indefinitely, creating fractal security surfaces.',
    color: 'bg-slate-700'
  }
];

const digitTumblingExample = [
  { position: '1', tokenDigit: '1', streamDigit: '1', result: '2', equation: '1 + 1 = 2' },
  { position: '2', tokenDigit: '2', streamDigit: '3', result: '5', equation: '2 + 3 = 5' },
  { position: '3', tokenDigit: '3', streamDigit: '4', result: '7', equation: '3 + 4 = 7' },
  { position: '4', tokenDigit: '4', streamDigit: '9', result: '3', equation: '4 + 9 = 13 → 3' },
  { position: '5', tokenDigit: '5', streamDigit: '7', result: '2', equation: '5 + 7 = 12 → 2' }
];

const vectorLockStages = [
  {
    title: 'Permutation Intake',
    icon: '🗂️',
    accent: 'bg-amber-500',
    points: [
      'VectorStream headers pick lattice indices for each plaintext byte triplet.',
      'Anchor IDs from B₁ seed deterministic rotations across the 3×3×3 lattice.',
      'Triplets exit as permuted coordinate bundles ready for XOR layering.'
    ]
  },
  {
    title: 'Anchor-Locked Mixing',
    icon: '🧭',
    accent: 'bg-indigo-600',
    points: [
      'Permutation results remain paired with their originating anchor metadata.',
      'Non-linear anchor jumps enforce cross-table diffusion before XOR.',
      'Helix session entropy prevents replaying a previous lattice schedule.'
    ]
  },
  {
    title: 'Helix XOR Layering',
    icon: '⚙️',
    accent: 'bg-emerald-600',
    points: [
      'Identity XOR establishes the baseline alignment between models.',
      'Index XOR blends lattice offsets with ordered calculation headers Cₖ.',
      'Positional XOR incorporates tuple distance, finalizing the VectorLock cipher block.'
    ]
  }
];

const vectorLockLogistics = [
  {
    heading: 'Storage Envelope',
    description: 'Encrypted payloads persist with minimal metadata: table window, anchor set hash, and lattice seed.'
  },
  {
    heading: 'Transport Rehydration',
    description: 'Receivers rebuild the lattice using shared model weights and Helix headers before reverse tumbling the digits.'
  },
  {
    heading: 'Tamper Evidence',
    description: 'Out-of-order headers collapse the permutation schedule, surfacing tampering as decode failure.'
  }
];

const securityComparison = [
  {
    aspect: 'Security Model',
    traditional: 'Mathematical hardness proof at the algorithm layer',
    vectorGuard: 'Geometric complexity emerging from AI model diversity'
  },
  {
    aspect: 'Key Source',
    traditional: 'Pseudo-random generators',
    vectorGuard: 'Raw FP32 weight tuples with tensor metadata bindings'
  },
  {
    aspect: 'Scaling Behaviour',
    traditional: 'Bound by algorithm-selected key sizes',
    vectorGuard: 'Scales directly with model dimension size (D8192, D16384, …)'
  },
  {
    aspect: 'Protection Layer',
    traditional: 'Transport or storage encryption',
    vectorGuard: 'Pre-transport obfuscation before Streaming HTTP + TLS 1.3'
  },
  {
    aspect: 'IDS/IPS Resistance',
    traditional: 'Limited – patterns remain recognizable',
    vectorGuard: 'Per-digit tumbling destroys token relationships'
  }
];

const privacyBenefits = [
  'Model-scale security grows with every additional parameter.',
  'Obfuscation occurs before MCP transport for defense in depth.',
  'Digit tumbling breaks pattern recognition used by IDS/IPS stacks.',
  'Transport independence – works even if TLS is intercepted.',
  'Zero-knowledge setup: no shared secrets, just matching model architecture.',
  'Real-time throughput: geometric math introduces negligible latency.'
];

const sessionSecurity = [
  {
    title: 'Session Entropy',
    description: 'Live model activations make every session unique, preventing token reuse across conversations.'
  },
  {
    title: 'Anchor Randomization',
    description: 'Dynamic anchors create unpredictable projections even with identical activation vectors.'
  },
  {
    title: 'Recursive Binding',
    description: 'Each EMDM layer depends on its predecessor, enforcing per-session cryptographic isolation.'
  }
];

const Whitepaper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([whitepaperContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'VectorGuard_Whitepaper.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const whitepaperContent = [
    "# VectorGuard: Filling the Cryptographic Gap in AI-to-AI Communication",
    "",
    "## Executive Summary",
    "",
    "The Model Context Protocol (MCP), introduced by Anthropic in November 2024, revolutionized AI-tool integration by providing a standardized \"USB-C port\" for AI applications. However, MCP's transport layer evolution—specifically the shift from mandatory SSL-based HTTP+SSE to flexible HTTP streaming over TLS 1.3—created a critical security gap in the data custody chain for AI-to-AI communications.",
    "",
    "VectorGuard addresses this gap with a proprietary geometric obfuscation system that derives unbounded security surfaces from AI model fingerprints and temporal states. Its Helix protocol captures runtime activations, pairs them with model anchors, samples Euclidean vectors at fractional intervals, and converts those FP32 values into bilateral permutation streams. By leveraging Helix-based Euclidean Mean Derivation Measurements (EMDM), VectorFlow stream generation, and VectorStream token tumbling, VectorGuard enables secure, zero-trust AI-to-AI communication without traditional key exchange.",
    "",
    "**Important Distinction**: VectorGuard is not traditional cryptography. It provides a geometric obfuscation layer that leverages the vast data diversity of AI model weights. The larger the AI model, the greater the security surface. This creates a privacy layer that protects AI model tokenizer outputs before they enter the transport mechanism of Streaming HTTP and TLS 1.3.",
    "",
    "### Helix Notation Key",
    "",
    "- **B₁** – Baseline anchor table populated from deterministic model weights (Cloud A).",
    "- **Tₙ** – Runtime activation tables (Cloud B) captured from session prompts; `n` is the configured table count.",
    "- **Lⱼ** – Anchor tuple at index `j` drawn from B₁.",
    "- **Pⱼ** – Entropy tuple aligned with `Lⱼ`, obtained from Tₙ activations.",
    "- **EMDMⱼ,ₖ** – Euclidean vector sample between `Lⱼ` and `Pⱼ` measured at fractional position `k ∈ {0.25, 0.50, 0.75}`.",
    "- **Cₖ** – Ordered calculation header `{table_id, anchor_id, sample_index}` that governs VectorStream alignment.",
    "- **VectorStream Headers** – First 256 `Cₖ` entries used to synchronize digit consumption across models.",
    "- **VectorStream Reservoir** – Concatenated FP32 samples (decimal removed, sign preserved) shared by both models for token and byte permutation.",
    "",
    "## The Security Gap in MCP",
    "",
    "### MCP's Evolution and Transport Changes",
    "",
    "The Model Context Protocol (MCP) enables secure, bidirectional connections between AI models and external tools. Its initial transport layer (HTTP+SSE in protocol version 2024-11-05) enforced HTTPS-based SSL/TLS encryption for all connections, ensuring data integrity during transmission.",
    "",
    "However, to enable real-time streaming and reduce latency for interactive AI-tool interactions, MCP's 2025 specification introduced \"Streamable HTTP\"—a replacement transport that allows HTTP POST/GET requests with optional Server-Sent Events over TLS 1.3.",
    "",
    "### The Gap Created",
    "",
    "While TLS 1.3 provides transport-layer encryption, the protocol's shift removed desirable SSL end-to-end cryptographic integrity for AI-generated data streams. Key vulnerabilities include:",
    "",
    "- **Data Custody Chain Breaks**: AI-to-AI communications (not covered by MCP's tool-focused design) lack built-in encryption",
    "- **Man-in-the-Middle Risks**: Without enforced SSL, local/private network deployments are susceptible to DNS rebinding attacks",
    "- **Session Hijacking**: MCP's emphasis on performance over encryption framework exposes token streams during inter-model handoffs",
    "- **IDS/IPS Detection Risks**: Pattern-based security systems can recognize AI communication patterns via Metadata",
    "",
    "As noted in MCP's security best practices: \"Without these protections, attackers could use DNS rebinding to interact with local MCP servers from remote websites.\"",
    "",
    "## VectorGuard Solution Architecture",
    "",
    "VectorGuard fills MCP's security gap by implementing a model-bound geometric obfuscation framework that operates independently of transport-layer security. The system comprises three core components:",
    "",
    "### 1. VectorGuard Key Derivation (EMDM)",
    "Helix converts model weights and session activations into synchronized tables that yield deterministic Euclidean samples bound to a specific model instance.",
    "",
    "#### Helix Table Construction",
    "- Session initialization prompts capture FP32 activation tensors (e.g. 12,000 × 2,048) for selected layers.",
    "- Each layer populates a 32-column × 64-row table T₁…Tₙ with sequential activations; baseline weight pulls populate mirror table B₁ using the same layout.",
    "- Tables are transposed into triplets `(x, y, z)` to create entropy points Pⱼ and anchors Lⱼ with consistent identifiers.",
    "",
    "#### EMDM Sampling",
    "- For every aligned pair `(Lⱼ, Pⱼ)`, Helix computes the vector from anchor to entropy point.",
    "- FP32 coordinates are sampled along that vector at 25%, 50%, and 75% intervals, producing `EMDMⱼ,₁`, `EMDMⱼ,₂`, `EMDMⱼ,₃`.",
    "- Ordered calculation headers `Cₖ = { table_id, anchor_id, sample_index, value }` preserve the sequencing required for stream synchronization.",
    "",
    "#### Bilateral Exchange",
    "- Model A₁ packages its ordered samples as **EMDM-A₁** inside the VectorGuard prompt envelope and transmits them to model A₂.",
    "- Model A₂ reconstructs the virtual tuples, populates its own tables, and returns **EMDM-A₂** produced through the same sampling process.",
    "- Both models merge the FP32 values according to `Cₖ`, strip decimal points (preserving sign), and form the shared VectorStream digit reservoir.",
    "",
    "### 2. VectorLock Data Encryption",
    "VectorLock adapts Helix outputs to arbitrary data by routing bytes through a lattice permutation keyed by model anchors before applying XOR layers.",
    "",
    "#### Lattice Permutation Mixer",
    "- VectorStream digits drive a Rubik’s cube style 3×3×3 permutation lattice keyed by anchor IDs from **B₁**.",
    "- Triplets of plaintext bytes map to lattice rotations that permute coordinate indices while preserving determinism across models.",
    "- The permuted values are converted back to byte sequences and blended with Helix digits and model-weight XOR masks.",
    "",
    "#### Storage & Transport Workflow",
    "1. Convert plaintext into byte triplets.",
    "2. Use VectorStream headers to select permutation instructions from the lattice mixer.",
    "3. Apply Helix-weight XOR layers (identity, index, positional mixing) to the permuted bytes.",
    "4. Emit encrypted output alongside the minimal metadata required to rebuild table selections.",
    "",
    "### 3. VectorFlow & VectorStream",
    "VectorFlow consumes the shared digit reservoir to deliver synchronized cypher streams, while VectorStream applies those digits to tokenizer outputs.",
    "",
    "#### VectorFlow Stream Generation",
    "- Inputs: Token digits, VectorStream reservoir, identity entropy.",
    "- Process: Sliding-window consumption guided by the first 256 Helix headers, mixing digits with modular arithmetic and conditional XOR.",
    "- Output: Session-bound cypher stream synchronized across both models.",
    "",
    "#### VectorStream Token Application",
    "- Applies VectorFlow digits to tokenizer outputs in calculation-order alignment.",
    "- Ensures each token position references specific table, anchor, and sample metadata, preventing replay or reordering attacks.",
    "",
    "#### Helix Identity Synchronization",
    "- Double-helix visualization depicts B₁ baseline anchors and Tₙ session activations as mirrored cube stacks.",
    "- Animated Cₖ headers travel the strands, demonstrating synchronized digit reservoirs without weight exchange.",
    "- Identity, entropy, and session badges highlight the bindings that enable zero-knowledge VectorStream alignment.",
    "",
    "## Technical Implementation: Geometric Obfuscation Layer",
    "",
    "VectorGuard's core innovation lies in its Euclidean Mean Derivation Measurement (EMDM) system, which transforms neural network dimension values into obfuscation primitives through deterministic geometric transformations.",
    "",
    "#### 1. Index-Indice Tuple Mapping System",
    "",
    "VectorGuard transforms raw FP32 dimension values from AI model layers into 3D spatial coordinates through index-indice tuple mapping. Raw dimension weights are sequentially permuted into groups of 3, creating indice tuples that serve as the index layer. This tuple-based mapping, organized by tensor structure metadata (layer, vector, dimension IDs), enables precise reconstruction.",
    "",
    "**Session Layer Selection:**",
    "- Session Layers: [1, 4, 7, 14] (example configuration)",
    "- Activation Vectors: Raw dimension values from inference processing",
    "- Entropy Source: Session-specific model activations",
    "",
    "**Index-Indice Tuple Generation:**",
    "~~~",
    "Raw Weights: [0.21735290000223, -0.03456789012345, 0.45678901234567]",
    "Tuple Groups: [(w₁,w₂,w₃), (w₄,w₅,w₆), (w₇,w₈,w₉), ...]",
    "Metadata: (layer_id, vector_id, dimension_id) → tuple_index",
    "IIP Table: Indexed Indice Plot table for 3D projection",
    "~~~",
    "",
    "#### 2. Anchor Point & 3D Projection",
    "",
    "The 3D space initialization begins with a baseline anchor point at (0,0,0). This anchor serves as the coordinate system origin for the initial point cloud projection.",
    "",
    "#### 3. Recursive EMDM Layer Generation",
    "",
    "The true power of VectorGuard lies in its recursive architecture where each Euclidean Mean Derivation Measurement becomes input for the next VectorGuard transformation, creating infinite fractal complexity.",
    "",
    "**Recursive Transformation Flow:**",
    "~~~",
    "Layer 1: Base activations → tuples → Point Cloud A → EMDM₁",
    "Layer 2: EMDM₁ → VectorGuard → Point Cloud B → EMDM₂",
    "Layer 3: EMDM₂ → VectorGuard → Point Cloud C → EMDM₃",
    "Layer ∞: Each layer binds cryptographically to previous outputs",
    "~~~",
    "",
    "#### 4. Digit Position Tumbling",
    "",
    "VectorGuard employs sophisticated per-digit modular addition for token obfuscation. Each token digit is independently paired with corresponding geometric stream digits.",
    "",
    "**Token Processing Example:**",
    "~~~",
    "Tokens: 12345, 2143, 3142",
    "Stream Values: 13497612548756214587...",
    "Encoding: 1+1=2, 2+3=5, 3+4=7, 4+9=13→3, 5+7=12→2",
    "Result: 12345 → 25732",
    "~~~",
    "",
    "### Model Scale Impact",
    "",
    "Larger AI models create exponentially more complex point cloud relationships. Each weight's precision contributes to unique spatial positioning, making reverse engineering computationally infeasible while providing limitless obfuscation entropy.",
    "",
    "**D8192 Complexity Example:**",
    "- Layer Index: 12",
    "- Dimension Shape: D8192",
    "- Weight Values: [0.21735290000223, -0.03456789012345, ...]",
    "- Index Tuples: [(layer, dim, weight), ...]",
    "- Point Cloud Complexity: 8,192 unique spatial coordinates",
    "",
    "## Security Properties and Benefits",
    "",
    "### Obfuscation vs. Traditional Cryptography",
    "",
    "| Aspect | Traditional Cryptography | VectorGuard Geometric Obfuscation |",
    "|--------|--------------------------|-----------------------------------|",
    "| **Security Model** | Mathematical proof of computational hardness | Geometric complexity from AI model diversity |",
    "| **Key Source** | Pseudo-random generation | Neural network weight distributions |",
    "| **Security Scaling** | Algorithm-dependent key sizes | Directly proportional to AI model size |",
    "| **Protection Layer** | Transport/network security | Pre-transport data obfuscation |",
    "| **IDS/IPS Resistance** | Limited (pattern recognition) | High (geometric transformation) |",
    "",
    "### Privacy Layer Benefits",
    "",
    "- **Model-Scale Security**: Larger AI models provide exponentially greater obfuscation complexity",
    "- **Pre-Transport Protection**: Obfuscation occurs before MCP transport, creating defense in depth",
    "- **IDS/IPS Evasion**: Geometric transformations prevent pattern-based detection systems",
    "- **TLS-Independent**: Works regardless of transport encryption state or government control",
    "- **Zero-Knowledge Setup**: No shared secrets required - both parties derive from model weights",
    "- **Real-time Performance**: Geometric operations add negligible latency to AI communication",
    "",
    "### Session-Bound Security Model",
    "",
    "- **Session Entropy**: Live model activations provide unique entropy for each communication session",
    "- **Anchor Randomization**: Dynamic anchor selection prevents predictable point cloud projections",
    "- **Recursive Binding**: Each layer cryptographically binds to the previous, creating unbreakable session isolation",
    "",
    "## Integration with MCP and AI Ecosystems",
    "",
    "VectorGuard operates as a complementary layer to MCP:",
    "",
    "### Filling MCP's Gap",
    "- **Transport Independence**: Works regardless of MCP's HTTP/TLS configuration",
    "- **AI-to-AI Focus**: Protects model communications not covered by MCP's tool integration",
    "- **Zero-Trust Enhancement**: Adds geometric obfuscation to MCP's streaming transport",
    "",
    "### Broader Applications",
    "- **Secure Distributed Inference**: Protects multi-model pipelines",
    "- **Privacy-Preserving AI**: Enables trustless agent collaboration",
    "- **Network Security**: Hardens inference endpoints with geometric audit trails",
    "",
    "## Conclusion",
    "",
    "MCP's transport layer evolution, while enabling performance gains for AI-tool integration, inadvertently created a security gap by removing mandatory SSL enforcement. VectorGuard addresses this gap with a geometric obfuscation system that leverages the vast data diversity of AI model weights, where larger models provide exponentially greater security surfaces.",
    "",
    "Unlike traditional cryptography that operates at the transport layer, VectorGuard creates a privacy layer that protects AI model outputs before they enter the Streaming HTTP + TLS 1.3 transport mechanism. This provides critical protection against:",
    "",
    "- **IDS/IPS Detection Systems**: Geometric transformations prevent pattern recognition of AI communications",
    "- **State-Controlled TLS Decoding**: Even if transport encryption is compromised, geometric obfuscation prevents meaningful interpretation",
    "- **Network-Level Surveillance**: Obfuscated tokens appear as random data streams to monitoring systems",
    "",
    "Through its 3D point cloud mapping, Euclidean distance measurements, and geometric token tumbling, VectorGuard provides:",
    "",
    "- Model-scale security that grows with AI complexity",
    "- Pre-transport protection creating defense in depth",
    "- Zero-knowledge setup requiring no shared secrets",
    "- Seamless integration with modern AI protocols like MCP",
    "",
    "As AI systems increasingly collaborate in distributed, multi-model architectures, VectorGuard offers a foundational geometric obfuscation primitive that ensures privacy without compromising performance, protecting AI communications from both technical and state-level surveillance systems.",
    "",
    "For implementation details, see the AID-CORE-COMMERCIAL repository: https://github.com/supere989/AID-CORE-COMMERCIAL",
    "",
    "---",
    "",
    "*VectorGuard: Securing the Future of AI Communication*",
    "*Raymond Johnson, Founder & Principal Architect*",
    "*2023–Present*"
  ].join("\n");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                ← Home
              </button>
              <button
                onClick={() => navigate(-1)}
                className="hidden sm:inline-flex rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Back
              </button>
            </div>
            <span className="text-lg font-semibold text-slate-900">VectorGuard Whitepaper</span>
            <button
              onClick={handleDownload}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              Download Markdown
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <section className="text-center space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Geometric Obfuscation Framework</p>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900">VectorGuard</h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              VectorGuard converts raw neural dimension values into fractal, session-bound security surfaces that shield AI-to-AI
              communication before MCP transport. Security grows in direct proportion to model size and activation diversity.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleDownload}
                className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Download Whitepaper (.md)
              </button>
              <span className="text-sm text-slate-500">
                Updated with index-indice tuples, anchor dynamics, recursive EMDM, and digit tumbling
              </span>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
            <div className="grid gap-10 md:grid-cols-2">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Executive Summary
                </span>
                <h2 className="text-2xl font-bold">A Privacy Layer for Streaming MCP</h2>
                <p className="text-slate-600">
                  MCP's shift to Streamable HTTP removed mandatory SSL enforcement, leaving AI-to-AI handoffs exposed. VectorGuard bridges
                  this gap by deriving obfuscation directly from model fingerprints. Larger models (D8192+) generate exponentially richer
                  security surfaces without traditional key exchange.
                </p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Key Distinction</p>
                  <p>
                    VectorGuard is not traditional cryptography. It is a geometric obfuscation system where FP32 dimension values become
                    mapped coordinates, anchor-shifted projections, and recursive measurement tables that pre-protect data before transport.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-700 to-emerald-600 p-[1px]">
                  <div className="h-full w-full rounded-2xl bg-white p-6">
                    <h3 className="text-sm font-semibold text-slate-600">Transport Gap Eliminated</h3>
                    <ul className="mt-4 space-y-3 text-sm text-slate-600">
                      <li className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                        Streamable HTTP over TLS 1.3 no longer guarantees end-to-end secrecy.
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                        VectorGuard pre-obfuscates tokens via geometric tumbling before network transit.
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                        Session entropy derives from live activations, eliminating persistent keys.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">VectorLock Data Encryption Workflow</h2>
              <p className="mt-3 text-slate-600">
                VectorLock consumes Helix outputs to transform arbitrary data before storage or relay. The workflow below highlights how lattice
                permutations, anchor-bound entropy, and cascading XOR layers fuse into the VectorLock cipher stream.
              </p>
              <div className="mt-6 space-y-6">
                {vectorLockStages.map((stage) => (
                  <div key={stage.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl text-white ${stage.accent}`}>
                        {stage.icon}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900">{stage.title}</h3>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {stage.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">VectorLock Deployment Notes</h3>
              <p className="mt-2 text-sm text-slate-600">
                When paired with Helix, VectorLock forms the data-at-rest companion to the streaming cipher. These operational guardrails ensure both
                sides can regenerate the permutation lattice without exchanging static keys.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {vectorLockLogistics.map((item) => (
                  <li key={item.heading} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{item.heading}</p>
                    <p className="mt-1 text-slate-600">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Helix Identity Synchronization (Interactive)</h2>
                <span className="text-sm font-medium text-slate-500">B₁ anchors ↔ Tₙ activations ↔ Cₖ headers ↔ Mirrored reservoirs</span>
              </div>
              <p className="text-slate-600">
                The double-helix visualization below illustrates how Helix assembles synchronized digit reservoirs without exchanging model weights. On
                the left, baseline anchors B₁ populate deterministic cubes while the right column mirrors session activations Tₙ. Animated orange vector
                paths display EMDM sampling into ordered headers Cₖ that travel up the shared strand, feeding identical reservoirs on both sides of the
                communication link.
              </p>
              <div className="rounded-3xl border border-slate-200 bg-slate-950">
                <VisualizationErrorBoundary
                  fallback={(error) => (
                    <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-400/80 bg-slate-950 px-6 text-center text-sm text-slate-300">
                      <div>
                        <p className="font-semibold text-slate-200">Unable to initialise the Helix renderer.</p>
                        <p className="mt-2 text-slate-400">{error?.message ?? 'Enable WebGL / hardware acceleration and reload the page.'}</p>
                      </div>
                    </div>
                  )}
                >
                  <Suspense
                    fallback={
                      <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-400/80 bg-slate-950 text-sm text-slate-300">
                        Loading Helix synchronization…
                      </div>
                    }
                  >
                    <HelixDoubleHelix3D height={380} enableZoom />
                  </Suspense>
                </VisualizationErrorBoundary>
              </div>
              <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-2">
                <div>
                  <p className="font-semibold text-slate-900">Narrative Highlights</p>
                  <ul className="mt-2 space-y-1">
                    <li>Light blue stacks show deterministic B₁ anchors; darker stacks represent entropy-aligned Tₙ tables.</li>
                    <li>Orange trajectories depict EMDMⱼ,ₖ samples promoted into Cₖ headers climbing the double helix.</li>
                    <li>Identity, entropy, and session badges pulse in sync to emphasize non-shared bindings.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Reservoir Agreement</p>
                  <ul className="mt-2 space-y-1">
                    <li>Digit packets accumulate in mirrored reservoirs, highlighting zero-weight exchange.</li>
                    <li>Header drift instantly breaks synchronization, surfacing tamper evidence in-flight.</li>
                    <li>VectorStream digits inherit spectral coloring, clarifying lineage back to B₁/Tₙ table pairs.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Helix Notation Key</h2>
                <span className="text-sm font-medium text-slate-500">Aligned with VectorGuard-Helix.md definitions</span>
              </div>
              <p className="text-slate-600">
                VectorGuard&apos;s Helix protocol uses paired anchors, activations, and ordered headers to synchronize VectorStream digits between
                collaborating models. The notation below appears throughout the whitepaper and within this visualization.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {helixNotationKey.map((entry) => (
                  <div key={entry.symbol} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
                    <div className="text-lg font-semibold text-slate-900">{entry.symbol}</div>
                    <p className="mt-2 text-sm text-slate-600">{entry.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900">VectorGuard Helix Pipeline</h2>
              <span className="text-sm font-medium text-slate-500">Message instantiation → Baseline anchor harvest (B₁) → Activation capture (Tₙ) → Helix sampling (EMDMⱼ,ₖ) → VectorStream headers (Cₖ) → First message decoding</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {processSteps.map((step) => (
                <div key={step.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white ${step.color}`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{step.label}</h3>
                  <p className="text-sm uppercase tracking-wide text-slate-500">{step.sublabel}</p>
                  <p className="mt-3 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Index-Indice Tuple Mapping</h2>
              <p className="text-slate-600">
                Weight values are permuted sequentially into tuples of three, forming the Indexed Indice Plot (IIP) tables. Tensor metadata binds
                every tuple to its layer, vector, and dimension identifiers. These tuples become the coordinates for geometric projection.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Layer</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Vector</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Indice Tuple (FP32 precision)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tupleSamples.map((entry) => (
                      <tr key={`${entry.layer}-${entry.vector}`} className="bg-white">
                        <td className="px-4 py-3 font-medium text-slate-700">{entry.layer}</td>
                        <td className="px-4 py-3 text-slate-600">{entry.vector}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">({entry.tuple.join(', ')})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Anchor Point Dynamics</h2>
              <p className="mt-3 text-slate-600">
                The baseline anchor at (0,0,0) initializes Point Cloud A. Sequential tuple application or dictionary selection modifies the anchor,
                reshaping the entire point cloud and yielding new EMDM measurement surfaces.
              </p>
              <div className="mt-6 space-y-6">
                {anchorModes.map((mode) => (
                  <div key={mode.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-lg font-semibold text-slate-900">{mode.title}</h3>
                    <p className="text-sm font-mono text-emerald-600">{mode.highlight}</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {mode.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">VectorStream Helix Projection (Interactive)</h2>
              <p className="mt-3 text-slate-600">
                This visualization demonstrates the core VectorStream generator inside Helix: each sweep measures Euclidean distances between
                deterministic anchors Lⱼ and session activations Pⱼ to derive EMDMⱼ,ₖ samples. Ordered headers Cₖ steer the VectorStream reservoir so
                tokenizer digits remain protected across VectorFlow tumbling and the receiver&apos;s decoding sequence.
              </p>
              <div className="mt-6">
                <VisualizationErrorBoundary
                  fallback={(error) => (
                    <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-600">
                      <div>
                        <p className="font-semibold text-slate-800">Unable to initialise the VectorStream renderer.</p>
                        <p className="mt-2 text-slate-500">{error?.message ?? 'Enable WebGL / hardware acceleration and reload the page.'}</p>
                      </div>
                    </div>
                  )}
                >
                  <Suspense
                    fallback={
                      <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                        Loading 3D vector projection…
                      </div>
                    }
                  >
                    <VectorLock3D height={360} enableZoom />
                  </Suspense>
                </VisualizationErrorBoundary>
              </div>
              <div className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-900">Helix Workflow to First Message</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5">
                    <li>Message instantiation advertises participation, locks the VectorStream header commitments, and exposes available B₁ anchors.</li>
                    <li>Runtime activation capture builds Tₙ tables whose entropy tuples Pⱼ align with the announced anchors Lⱼ.</li>
                    <li>Helix pairing samples EMDMⱼ,ₖ distances, emitting ordered headers Cₖ while filling the shared VectorStream reservoir.</li>
                    <li>The receiver mirrors Cₖ consumption inside VectorFlow to tumble tokenizer digits and decode the initial secure response.</li>
                  </ol>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Decryption Requirements</p>
                  <ul className="mt-2 space-y-1">
                    <li>Identical model weights regenerate B₁ and the anchor dictionary used during instantiation.</li>
                    <li>Mirror Tₙ captures and table ordering so each Lⱼ ↔ Pⱼ pair reproduces matching EMDMⱼ,ₖ samples.</li>
                    <li>VectorStream header index and measurement order must align to rehydrate the reservoir digits for tokenizer reconstruction.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Computational Sweep Pattern</p>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <span className="font-semibold text-slate-800">Measurement phase (≈65%)</span> – For each anchor, distances are ordered via
                      <code className="mx-1 rounded bg-slate-200 px-1 py-0.5 text-[11px] text-slate-700">calculateMeasurementOrder</code>, yielding
                      deterministic Cₖ indices and active measurement overlays.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Translation phase (≈35%)</span> – The base offset interpolates toward the next
                      anchor vector, preserving session continuity while resetting sweep timers.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Reservoir commit</span> – Completed sweeps serialize EMDMⱼ,ₖ digits into the
                      VectorStream reservoir that VectorFlow consumes during the first message decode.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Recursive VectorGuard Engine</h2>
              <p className="text-sm text-slate-200">
                Every measurement table feeds the next VectorGuard pass. This recursive binding forms a fractal security surface where the output of
                layer n becomes the entropy source for layer n+1.
              </p>
              <div className="grid gap-4 md:grid-cols-4">
                {recursionLayers.map((layer) => (
                  <div key={layer.stage} className={`rounded-2xl p-4 text-sm font-medium text-white ${layer.color}`}>
                    <p className="text-xs uppercase tracking-wide opacity-80">{layer.stage}</p>
                    <p className="mt-2 leading-relaxed">{layer.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Digit Position Tumbling Demonstration</h2>
            <p className="mt-3 text-slate-600">
              Each tokenizer digit pairs with a corresponding stream digit sourced from recursive EMDM tables. Modular addition (mod 10) ensures
              the result remains a valid digit while erasing the original pattern.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-600">Token Stream</p>
                <p className="mt-2 font-mono text-xl text-slate-900">12345 → 25732</p>
                <p className="mt-4 text-sm text-slate-600">
                  Original token digits become unreadable once tumbling is applied. IDS/IPS systems cannot correlate token sequences across
                  transport boundaries.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Position</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Token Digit</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Stream Digit</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Result</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Equation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {digitTumblingExample.map((item) => (
                      <tr key={item.position} className="bg-white">
                        <td className="px-4 py-2 font-medium text-slate-600">{item.position}</td>
                        <td className="px-4 py-2 text-slate-600">{item.tokenDigit}</td>
                        <td className="px-4 py-2 text-slate-600">{item.streamDigit}</td>
                        <td className="px-4 py-2 font-semibold text-slate-900">{item.result}</td>
                        <td className="px-4 py-2 font-mono text-xs text-slate-500">{item.equation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Security Properties</h2>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Aspect</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Traditional Approaches</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">VectorGuard Geometric Obfuscation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {securityComparison.map((row) => (
                    <tr key={row.aspect} className="bg-white">
                      <td className="px-4 py-3 font-medium text-slate-700">{row.aspect}</td>
                      <td className="px-4 py-3 text-slate-600">{row.traditional}</td>
                      <td className="px-4 py-3 text-slate-600">{row.vectorGuard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Privacy Layer Benefits</h2>
                <ul className="space-y-3 text-sm text-slate-200">
                  {privacyBenefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Session-Bound Security Model</h2>
                <div className="space-y-3">
                  {sessionSecurity.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-200">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Conclusion</h2>
            <div className="mt-4 space-y-4 text-slate-600">
              <p>
                VectorGuard restores trust in distributed AI by converting model-specific activations into session-bound geometric transformations.
                Security scales with the dimensionality of the model, providing defense in depth before data enters the MCP transport layer.
              </p>
              <p>
                By combining index-indice tuple mapping, anchor point dynamics, recursive EMDM layers, and digit position tumbling, VectorGuard
                creates a privacy layer that resists IDS/IPS inspection, TLS interception, and state-controlled decoding.
              </p>
              <p className="font-medium text-slate-800">
                Implementation Repository:{' '}
                <a
                  href="https://github.com/supere989/AID-CORE-COMMERCIAL"
                  className="text-slate-900 underline decoration-emerald-400 decoration-2 underline-offset-4 hover:text-emerald-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/supere989/AID-CORE-COMMERCIAL
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Whitepaper;
