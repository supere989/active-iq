import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Blog from './Blog';

/* ── Navigation ── */

const navigation = [
  { href: '#problem', label: '// THE PROBLEM' },
  { href: '#technology', label: '// TECHNOLOGY' },
  { href: '#nano', label: '// NANO' },
  { href: '#comparison', label: '// COMPARE' },
  { href: '/blog', label: '// BLOG', isRoute: true },
  { href: '#contact', label: '// CONTACT' },
];

/* ── Blog data (shared with splash) ── */

const latestBlogPosts = [
  {
    slug: 'vectorguard-nano',
    title: 'Introducing VectorGuard-Nano: Free Secure Messaging for AI Agents',
    date: 'February 5, 2026',
    excerpt:
      'The AI agent revolution is here, but there\'s a critical gap: no standard for secure agent-to-agent communication. Today we\'re releasing VectorGuard-Nano as Apache 2.0-licensed open-source software, free for personal and educational use.',
    tags: ['AI Security', 'Open Source', 'Product Launch'],
  },
];

/* ── VectorGuard Data (from whitepaper docs) ── */

const coreComponents = [
  {
    symbol: '[HELIX]',
    title: 'Helix Protocol',
    description: 'Bilateral cipher stream derivation between two AI models. Both sides independently build geometric representations from their own weights and activations, exchange measurements, and derive a shared cipher stream — no keys exist or are transmitted.',
    bullets: [
      'Session-bound: every connection generates unique, non-replayable cryptographic context',
      'Bilateral: both models contribute independent entropy — neither side can predict the other',
      'Authenticated: multi-component identity verification prevents impersonation',
    ],
  },
  {
    symbol: '[GCD]',
    title: 'Geometric Cipher Derivation',
    description: 'Transforms neural network weight spaces into 3D point clouds, then samples the geometric relationships between aligned anchor and entropy points. The resulting coordinate data becomes the raw material for cipher stream generation.',
    bullets: [
      'Deterministic: identical model state always produces identical cipher streams',
      'One-way: model data transforms to cipher material but cannot be reversed',
      'Scales with model complexity: larger models yield exponentially greater security surfaces',
    ],
  },
  {
    symbol: '[LOCK]',
    title: 'Data-at-Rest Protection',
    description: 'Multi-layer block cipher for stored data. Combines geometric permutation with identity-bound encryption layers tied to specific users and model instances.',
    bullets: [
      'Identity-bound: decryption requires the exact user and model combination',
      'Geometric permutation prevents pattern analysis across stored data',
      'Perfectly reversible with correct parameters, computationally infeasible without',
    ],
  },
  {
    symbol: '[FLOW]',
    title: 'Cipher Stream Engine',
    description: 'Generates synchronized cipher streams from shared geometric measurements. Session-unique streams are deterministically derived and destroyed on completion.',
    bullets: [
      'Session-bound cipher streams stay synchronized across both models without coordination',
      'Automatic stream destruction after session ensures forward secrecy',
      'Network intermediaries see only encrypted data — model state never leaves the endpoint',
    ],
  },
  {
    symbol: '[STREAM]',
    title: 'Transport Encryption',
    description: 'Two-layer encryption pipeline. The inner layer applies the cipher stream to tokenizer output at per-digit granularity. The outer layer wraps ciphertext in fixed-size encrypted frames that resist traffic analysis.',
    bullets: [
      'Per-digit cipher operations — finer granularity than traditional byte-level encryption',
      'Fixed-size transport frames eliminate message-length inference attacks (Whisper Leak class)',
      'Built-in integrity verification and tamper detection on every frame',
    ],
  },
];

const securityProperties = [
  'Confidentiality: two-layer encryption applied before data reaches the transport mechanism',
  'Integrity: cryptographic signatures on both routing metadata and message payloads',
  'Authentication: multi-component identity derived from the model itself — no external PKI',
  'Replay protection: monotonic sequence validation prevents message reordering and replay',
  'Model-bound: cipher material is derived from specific model weights and runtime activations',
  'Forward secrecy: session cipher state is destroyed on completion — old sessions cannot be recovered',
  'MITM detection: multiple independent tamper-detection mechanisms trigger on interception',
  'Traffic analysis resistance: fixed-size encrypted frames eliminate message-length inference',
];

const nanoFeatures = [
  { label: 'Model-weight derived streams', detail: 'Cipher material sourced from real AI model weights via geometric measurement' },
  { label: 'Multi-round obfuscation', detail: 'Multiple transformation passes with per-message nonce for session uniqueness' },
  { label: 'Forward ratchet', detail: 'Cipher state advances after each exchange — previous sessions cannot be recovered' },
  { label: 'Round-trip guaranteed', detail: 'Perfect message recovery with deterministic stream derivation' },
  { label: 'Agent-friendly', detail: 'Works with MCP, Claude Desktop, OpenClaw' },
  { label: 'Apache 2.0 licensed', detail: 'Free for personal/educational use, commercial licensing available' },
];

const comparisonRows = [
  { feature: 'Classification', nano: 'Geometric obfuscation', full: 'Model-bound encryption' },
  { feature: 'Core Cipher', nano: 'Multi-round character shifting', full: 'Proprietary per-digit cipher' },
  { feature: 'Cipher Source', nano: 'Geometric measurements from public model weights', full: 'Bilateral geometric consensus from local model state' },
  { feature: 'Transport Security', nano: 'None (application-level only)', full: 'Fixed-size encrypted transport frames' },
  { feature: 'Integrity', nano: 'None', full: 'Cryptographic signatures on headers + payloads' },
  { feature: 'Authentication', nano: 'Shared secret', full: 'Multi-component model-bound identity' },
  { feature: 'MITM Detection', nano: 'None', full: 'Multiple independent detection mechanisms' },
  { feature: 'Forward Secrecy', nano: 'Table-ratchet-forward', full: 'Session state destruction + cipher stream regeneration' },
  { feature: 'Use Case', nano: 'Development, testing, agent prototyping', full: 'Enterprise production, compliance' },
  { feature: 'License', nano: 'Apache 2.0 (free for non-commercial)', full: 'Enterprise licensing' },
];

/* ── Terminal UI Components ── */

const TerminalBox = ({ title, children, className = '' }) => (
  <div className={`terminal-box ${className}`}>
    <div className="terminal-header">
      <span className="terminal-dot terminal-dot-red" />
      <span className="terminal-dot terminal-dot-yellow" />
      <span className="terminal-dot terminal-dot-green" />
      <span className="ml-2">{title}</span>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const SectionDivider = ({ label }) => (
  <div className="section-divider">
    <span>{`// ${label}`}</span>
  </div>
);

const GitHubIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

/* ── Blog Splash Overlay ── */

const BlogSplash = ({ onDismiss }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-void flex items-center justify-center cursor-pointer"
      onClick={onDismiss}
    >
      <div className="max-w-3xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-10"
        >
          <p className="text-phosphor text-xs uppercase tracking-widest mb-3">
            {'>'} Active-IQ Systems // Latest News<span className="cursor-blink">_</span>
          </p>
          <h1 className="text-2xl md:text-4xl font-bold text-phosphor glow-text">
            BULLETIN FEED
          </h1>
        </motion.div>

        {latestBlogPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
            className="terminal-box mb-4"
          >
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2">LATEST.broadcast</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-phosphor text-xs font-bold">[NEW]</span>
                <span className="text-amber text-xs">{post.date}</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-phosphor mb-2">{post.title}</h2>
              <p className="text-sm text-offwhite/70 leading-relaxed">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="border border-phosphor/30 px-2 py-0.5 text-[10px] text-phosphor uppercase tracking-wider">
                    [{tag}]
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-offwhite/30 text-xs">
            Entering main terminal in <span className="text-phosphor font-bold">{countdown}</span>s
            <span className="text-offwhite/20"> -- click anywhere to skip</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ── Home Page ── */

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div id="home-top" className="relative min-h-screen bg-void text-offwhite font-mono">
      {/* Blog Splash Overlay */}
      <AnimatePresence>
        {showSplash && <BlogSplash onDismiss={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-void/95 backdrop-blur-sm z-50 border-b border-phosphor/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <button
              type="button"
              onClick={() => document.getElementById('home-top')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-phosphor font-bold text-sm tracking-wider focus:outline-none"
            >
              {'> ACTIVE-IQ'}<span className="cursor-blink">_</span>
            </button>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navigation.map(({ href, label, isRoute }) => (
                <button
                  key={href}
                  onClick={() => {
                    if (isRoute) {
                      navigate(href);
                    } else {
                      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-phosphor/70 text-xs tracking-wide hover:text-phosphor hover:glow-text transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="md:hidden text-phosphor focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-phosphor/10 pb-4">
              {navigation.map(({ href, label, isRoute }) => (
                <button
                  key={href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isRoute) {
                      navigate(href);
                    } else {
                      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block w-full text-left py-2 px-4 text-phosphor/70 text-sm hover:text-phosphor hover:bg-phosphor/5 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-amber text-sm uppercase tracking-widest mb-6">
              {'>'} Model-Bound Encryption for AI-to-AI Communication<span className="cursor-blink">_</span>
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-phosphor glow-text tracking-tight">
              ACTIVE-IQ
            </h1>
            <p className="mt-2 text-lg md:text-2xl font-bold text-phosphor/60 tracking-wide">
              SYSTEMS
            </p>
            <p className="mt-8 text-base md:text-lg text-offwhite/70 leading-relaxed max-w-3xl mx-auto">
              VectorGuard is a model-bound encryption system that protects AI-to-AI communication <span className="text-phosphor">before</span> data reaches the transport layer. It derives cipher material from the geometric structure of neural network weight spaces, then applies that material through a proprietary per-digit cipher to encrypt tokenizer outputs. No classical keys are exchanged; both models derive shared cipher streams from their own internals via a bilateral handshake protocol.
            </p>
            <p className="mt-4 text-sm text-offwhite/50 leading-relaxed max-w-3xl mx-auto">
              What distinguishes VectorGuard from traditional cryptography is its cipher source — neural network geometry — not a weaker security model. It provides confidentiality, integrity, authentication, and replay protection. The security surface scales directly with model size: even if TLS is compromised, ciphertext remains unreadable without the originating model state.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-terminal-filled"
              >
                Explore the Technology
              </button>
              <a
                href="https://github.com/Active-IQ/VectorGuard-Nano"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-terminal inline-block"
              >
                Get VectorGuard-Nano (Free)
              </a>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-xs text-offwhite/40">
              <span>[MODEL-BOUND ENCRYPTION]</span>
              <span>[PRE-TRANSPORT CIPHER]</span>
              <span>[NO KEY DEPENDENCY]</span>
              <span>[WHISPER LEAK IMMUNE]</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="THE PROBLEM" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <TerminalBox title="THREAT_ASSESSMENT.log">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-bold text-phosphor mb-4">The MCP Security Gap</h3>
                  <p className="text-sm text-offwhite/70 leading-relaxed mb-4">
                    Anthropic&apos;s Model Context Protocol (MCP) revolutionized AI-tool integration, but its transport specification is TLS-agnostic &mdash; no version of the MCP transport layer mandates HTTPS or any specific encryption. Data custody for AI-to-AI communications is left entirely to deployment practices.
                  </p>
                  <div className="space-y-2 text-xs text-offwhite/60">
                    <p className="flex items-start gap-2"><span className="text-amber flex-shrink-0">[!]</span> MCP transport spec does not require encryption &mdash; HTTPS is optional</p>
                    <p className="flex items-start gap-2"><span className="text-amber flex-shrink-0">[!]</span> Man-in-the-middle risks on local/private deployments</p>
                    <p className="flex items-start gap-2"><span className="text-amber flex-shrink-0">[!]</span> Session hijacking during inter-model token handoffs</p>
                    <p className="flex items-start gap-2"><span className="text-amber flex-shrink-0">[!]</span> Traffic analysis exposes AI communication patterns via metadata</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber mb-4">[WARNING] Whisper Leak Vulnerability</h3>
                  <p className="text-sm text-offwhite/70 leading-relaxed mb-4">
                    Published November 2025 by Microsoft researchers, Whisper Leak demonstrates that adversaries can infer LLM conversation topics with <span className="text-phosphor font-bold">&gt;98% AUPRC</span> by analyzing encrypted TLS packet timing and sizes across 28 commercially available LLMs.
                  </p>
                  <div className="space-y-2 text-xs text-offwhite/60">
                    <p className="flex items-start gap-2"><span className="text-phosphor flex-shrink-0">{'>'}</span> TLS encryption protects content but NOT metadata</p>
                    <p className="flex items-start gap-2"><span className="text-phosphor flex-shrink-0">{'>'}</span> Mitigations (padding, batching, packet injection) add up to 2-3x bandwidth overhead</p>
                    <p className="flex items-start gap-2"><span className="text-phosphor flex-shrink-0">{'>'}</span> Microsoft&apos;s own research: &quot;none provides complete protection&quot;</p>
                    <p className="flex items-start gap-2"><span className="text-phosphor flex-shrink-0">{'>'}</span> Tested across all major providers: OpenAI, Anthropic, Google, AWS, and more</p>
                  </div>
                  <p className="mt-4 text-xs text-phosphor font-bold">
                    VectorGuard doesn&apos;t patch Whisper Leak. It makes the attack methodology impossible.
                  </p>
                </div>
              </div>
            </TerminalBox>
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="VECTORGUARD TECHNOLOGY" />
          <p className="text-offwhite/60 mb-4 text-sm">
            VectorGuard operates as a pre-transport encryption layer where the AI model itself is the cipher source.
          </p>
          <p className="text-offwhite/40 mb-10 text-xs">
            {'>'} Model weights + activations -&gt; Geometric cipher derivation -&gt; Bilateral exchange -&gt; Per-digit encryption -&gt; Fixed-frame transport
          </p>

          {/* Communication Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <TerminalBox title="PROTOCOL.flow">
              <h3 className="text-sm font-bold text-phosphor mb-4">AI-to-AI Communication Protocol</h3>
              <div className="space-y-1 text-xs text-offwhite/60 font-mono">
                <p><span className="text-amber">[01]</span> Bilateral handshake: both models exchange identity and geometric measurements</p>
                <p><span className="text-amber">[02]</span> Shared cipher stream derived from combined geometric consensus — no keys transmitted</p>
                <p><span className="text-amber">[03]</span> Sender tokenizes message and embeds tamper-detection markers</p>
                <p><span className="text-amber">[04]</span> Per-digit cipher encrypts token stream against model-derived cipher material</p>
                <p><span className="text-amber">[05]</span> Ciphertext packed into fixed-size encrypted transport frames (defeats traffic analysis)</p>
                <p><span className="text-amber">[06]</span> Cryptographic signatures applied independently to routing and payload data</p>
                <p><span className="text-amber">[07]</span> Receiver validates signatures, decrypts frames, and reverses the cipher to recover tokens</p>
                <p><span className="text-amber">[08]</span> Tamper-detection markers verified — any interception attempt is flagged immediately</p>
              </div>
            </TerminalBox>
          </motion.div>

          {/* Core Components */}
          <div className="space-y-4">
            {coreComponents.map((comp, index) => (
              <motion.div
                key={comp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <TerminalBox title={comp.title.split(' ')[0].toUpperCase() + '.module'}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-phosphor font-bold text-sm">{comp.symbol}</span>
                    <h3 className="text-sm font-bold text-phosphor">{comp.title}</h3>
                  </div>
                  <p className="text-xs text-offwhite/60 leading-relaxed mb-3">{comp.description}</p>
                  <div className="space-y-2">
                    {comp.bullets.map((bullet) => (
                      <p key={bullet} className="text-xs text-offwhite/50 flex items-start gap-2">
                        <span className="text-phosphor/60 flex-shrink-0">{'>'}</span>
                        <span>{bullet}</span>
                      </p>
                    ))}
                  </div>
                </TerminalBox>
              </motion.div>
            ))}
          </div>

          {/* Security Properties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <TerminalBox title="SECURITY.guarantees">
              <h3 className="text-sm font-bold text-phosphor mb-4">Security Properties</h3>
              <div className="space-y-2">
                {securityProperties.map((item) => (
                  <p key={item} className="text-xs text-offwhite/60 flex items-start gap-2">
                    <span className="text-phosphor flex-shrink-0">[+]</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </TerminalBox>
          </motion.div>
        </div>
      </section>

      {/* VectorGuard-Nano Section */}
      <section id="nano" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="VECTORGUARD-NANO // FREE & OPEN SOURCE" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <TerminalBox title="NANO.release">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-phosphor glow-text mb-2">VectorGuard-Nano</h2>
                <p className="text-amber text-xs uppercase tracking-widest">Apache 2.0 // Free for Non-Commercial Use</p>
              </div>
              <p className="text-sm text-offwhite/70 leading-relaxed text-center max-w-2xl mx-auto mb-8">
                Open-source geometric obfuscation for AI agent messaging. Derives cipher streams from real model weights via geometric measurement, then applies multi-round obfuscation to protect messages in transit. Session-based with forward ratcheting — each exchange advances the cipher state.
              </p>

              <div className="terminal-box p-4 mb-8 bg-void/50">
                <pre className="text-xs text-phosphor overflow-x-auto"><code>{`// VectorGuard-Nano v2 — session-based agent messaging
const vgn = new VgnV2();
const secret = "shared-agent-secret";

// Agent A creates session (derives cipher stream from model weights)
const session = await vgn.createSession("agentA", "agentB", secret);
const initPacket = session.getInitPacket(); // send once to peer

// Agent A encodes (multi-round obfuscation against model-derived stream)
const { encoded, nonce } = session.encode("Launch data analysis");

// Agent B joins session from init packet, decodes
const peerSession = await vgn.joinSession(initPacket, secret);
const original = peerSession.decode(encoded, nonce);
// Returns: "Launch data analysis"`}</code></pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {nanoFeatures.map(({ label, detail }) => (
                  <div key={label} className="terminal-box p-4">
                    <p className="text-xs font-bold text-phosphor flex items-start gap-2">
                      <span className="flex-shrink-0">[+]</span>
                      {label}
                    </p>
                    <p className="text-[11px] text-offwhite/40 mt-1 ml-5">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="terminal-box p-4 mb-6 border-amber/30 bg-amber/5">
                <p className="text-xs font-bold text-amber mb-2">[!] IMPORTANT: Usage Restrictions</p>
                <p className="text-[11px] text-offwhite/60 mb-2">VectorGuard-Nano provides obfuscation, not encryption. NOT suitable for:</p>
                <ul className="text-[11px] text-offwhite/50 space-y-1 ml-4">
                  <li>• Financial transactions or healthcare data (HIPAA)</li>
                  <li>• Personal identifiable information at scale</li>
                  <li>• Mission-critical production systems</li>
                  <li>• Replacing TLS/HTTPS encryption</li>
                </ul>
                <p className="text-[11px] text-offwhite/60 mt-3">
                  <span className="text-amber font-bold">Commercial use?</span> Contact sales@active-iq.com for licensing.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/Active-IQ/VectorGuard-Nano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-terminal-filled inline-flex items-center gap-2"
                >
                  <GitHubIcon className="h-4 w-4" />
                  Clone Repository
                </a>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/blog/vectorguard-nano.html';
                  }}
                  className="btn-terminal"
                >
                  Read Launch Announcement
                </button>
              </div>
            </TerminalBox>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="NANO vs FULL VECTORGUARD" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <TerminalBox title="COMPARE.matrix">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-phosphor/20">
                      <th className="text-left py-3 pr-4 text-amber uppercase tracking-wider font-bold">Feature</th>
                      <th className="text-left py-3 pr-4 text-phosphor uppercase tracking-wider font-bold">Nano (Free)</th>
                      <th className="text-left py-3 text-phosphor uppercase tracking-wider font-bold">Full (Enterprise)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map(({ feature, nano, full }) => (
                      <tr key={feature} className="border-b border-phosphor/5">
                        <td className="py-3 pr-4 text-amber font-bold">{feature}</td>
                        <td className="py-3 pr-4 text-offwhite/60">{nano}</td>
                        <td className="py-3 text-offwhite/70">{full}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-offwhite/60 mb-4">
                  Full VectorGuard is currently in private beta. We are seeking strategic partnerships with AI companies and enterprise customers.
                </p>
                <a
                  href="mailto:raymondj@active-iq.com?subject=VectorGuard%20Enterprise%20Licensing"
                  className="btn-terminal-filled inline-block"
                >
                  Contact for Enterprise Licensing
                </a>
              </div>
            </TerminalBox>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="CONTACT" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <TerminalBox title="ACTIVE-IQ.info">
                <div className="space-y-5">
                  <div>
                    <span className="text-amber text-xs uppercase tracking-wider">$ organization</span>
                    <p className="text-sm text-phosphor font-bold mt-1">Active-IQ Systems</p>
                    <p className="text-xs text-offwhite/50 mt-1">Model-Bound Cryptography & AI Agent Security</p>
                  </div>
                  <div>
                    <span className="text-amber text-xs uppercase tracking-wider">$ email</span>
                    <p className="text-sm mt-1">
                      <a href="mailto:raymondj@active-iq.com" className="text-offwhite/80 hover:text-phosphor transition-colors">raymondj@active-iq.com</a>
                    </p>
                  </div>
                  <div>
                    <span className="text-amber text-xs uppercase tracking-wider">$ repositories</span>
                    <div className="mt-2 space-y-2">
                      <a href="https://github.com/Active-IQ" className="text-offwhite/50 hover:text-phosphor transition-colors flex items-center gap-2 text-xs" target="_blank" rel="noopener noreferrer">
                        <GitHubIcon className="h-4 w-4" />
                        github.com/Active-IQ
                      </a>
                      <a href="https://github.com/Active-IQ/VectorGuard-Nano" className="text-offwhite/50 hover:text-phosphor transition-colors flex items-center gap-2 text-xs" target="_blank" rel="noopener noreferrer">
                        <GitHubIcon className="h-4 w-4" />
                        VectorGuard-Nano (Apache 2.0)
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="text-amber text-xs uppercase tracking-wider">$ inquiries</span>
                    <div className="mt-2 space-y-1 text-xs text-offwhite/50">
                      <p>{'>'} Enterprise licensing & VectorGuard Full access</p>
                      <p>{'>'} Strategic partnerships & integration</p>
                      <p>{'>'} Security consulting & performance engineering</p>
                    </div>
                  </div>
                </div>
              </TerminalBox>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <TerminalBox title="CONTACT.form">
                <h3 className="text-lg font-bold text-phosphor mb-2">Get in Touch</h3>
                <p className="text-xs text-offwhite/50 mb-6">
                  Licensing inquiries, partnership proposals, or technical questions.
                </p>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-amber uppercase tracking-wider mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      className="w-full bg-void border border-phosphor/20 px-3 py-2 text-sm text-offwhite placeholder-offwhite/30 focus:border-phosphor focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-amber uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      className="w-full bg-void border border-phosphor/20 px-3 py-2 text-sm text-offwhite placeholder-offwhite/30 focus:border-phosphor focus:outline-none transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-amber uppercase tracking-wider mb-1">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      className="w-full bg-void border border-phosphor/20 px-3 py-2 text-sm text-offwhite placeholder-offwhite/30 focus:border-phosphor focus:outline-none transition-colors resize-none"
                      placeholder="Describe your use case or inquiry..."
                    />
                  </div>
                  <button type="submit" className="btn-terminal-filled w-full">
                    Submit Inquiry
                  </button>
                </form>
              </TerminalBox>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-phosphor/10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-phosphor/40">&copy; {new Date().getFullYear()} Active-IQ Systems. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="https://github.com/Active-IQ" className="text-offwhite/30 hover:text-phosphor transition-colors text-xs" target="_blank" rel="noopener noreferrer">
                [GITHUB]
              </a>
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="text-offwhite/30 hover:text-phosphor transition-colors text-xs"
              >
                [BLOG]
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  </Router>
);

export default App;
