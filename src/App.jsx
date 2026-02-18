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
      'The AI agent revolution is here, but there\'s a critical gap: no standard for secure agent-to-agent communication. Today we\'re releasing VectorGuard-Nano as free, MIT-licensed open-source software.',
    tags: ['AI Security', 'Open Source', 'Product Launch'],
  },
];

/* ── VectorGuard Data (from whitepaper docs) ── */

const coreComponents = [
  {
    symbol: '[HELIX]',
    title: 'Helix Protocol',
    description: 'Proprietary bilateral key agreement protocol between two AI models. Both sides derive shared cryptographic material from their own model state -- no classical key exchange required.',
    bullets: [
      'Session-bound: each communication generates unique cryptographic material',
      'Bilateral: both models contribute entropy to the shared stream',
      'Model-native: leverages internal model representations as the security foundation',
    ],
  },
  {
    symbol: '[KEY]',
    title: 'VectorGuard Key Derivation',
    description: 'Generates cryptographic primitives directly from AI model internals. The model itself becomes the key -- no external key management infrastructure required.',
    bullets: [
      'Deterministic: identical model instances produce identical security surfaces',
      'Unidirectional: model data transforms to keys, never reversed',
      'Scales with model complexity: larger models yield exponentially greater security',
    ],
  },
  {
    symbol: '[LOCK]',
    title: 'VectorLock Encryption',
    description: 'Multi-layered data encryption system using model-derived key material. Binds encrypted data to user identity, model identity, and session state simultaneously.',
    bullets: [
      'Identity-bound: encryption tied to specific user and model instances',
      'Multi-layer architecture prevents pattern analysis across all attack surfaces',
      'Perfectly reversible with correct parameters, computationally infeasible without',
    ],
  },
  {
    symbol: '[FLOW]',
    title: 'VectorFlow Stream Generation',
    description: 'Produces synchronized cypher streams consumed by both communicating models. Session-unique streams are destroyed automatically on completion.',
    bullets: [
      'Session-bound cypher stream synchronized across both models',
      'Automatic stream destruction ensures perfect forward secrecy',
      'Server blindness: network intermediaries never see intelligible data',
    ],
  },
  {
    symbol: '[STREAM]',
    title: 'VectorStream Token Protection',
    description: 'Applies cypher stream protection to AI model token outputs during transmission. Ensures each token is cryptographically bound to the session.',
    bullets: [
      'Prevents replay, reordering, and injection attacks',
      'Token-level granularity with session-specific protection',
      'Lockstep encoding/decoding ensures perfect message recovery',
    ],
  },
];

const securityProperties = [
  'Model-bound: cypher streams tied to specific AI model instances',
  'Session isolation: each session generates entirely new cryptographic material',
  'Session-limited decodability: cryptographic data destroyed when session completes',
  'Server blindness: network intermediaries cannot decrypt without the originating models',
  'Perfect forward secrecy: no persistent keys stored between sessions',
  'Whisper Leak immune: no consistent traffic patterns for adversarial model training',
];

const nanoFeatures = [
  { label: 'HMAC-SHA256 character shifting', detail: 'Deterministic obfuscation with shared secrets' },
  { label: 'Zero dependencies', detail: 'Pure JavaScript, ~100 lines of auditable code' },
  { label: 'Round-trip guaranteed', detail: 'Perfect message recovery every time' },
  { label: 'Agent-friendly', detail: 'Works with MCP, Claude Desktop, OpenClaw' },
  { label: 'MIT licensed', detail: 'Free for any project, commercial or personal' },
];

const comparisonRows = [
  { feature: 'Method', nano: 'HMAC-SHA256 character shifting', full: 'Proprietary model-bound cryptography' },
  { feature: 'Security Basis', nano: 'Pre-shared secrets', full: 'AI model internals (proprietary process)' },
  { feature: 'Performance', nano: 'Instant (CPU)', full: 'Billions of digits/second (CUDA)' },
  { feature: 'Whisper Leak', nano: 'Partial (timing patterns remain)', full: 'Complete immunity (no consistent patterns)' },
  { feature: 'Forward Secrecy', nano: 'No', full: 'Yes (context-driven rotation)' },
  { feature: 'Key Exchange', nano: 'Manual pre-shared', full: 'Automatic (model distribution = key distribution)' },
  { feature: 'Session Management', nano: 'Manual timestamp', full: 'Automatic (bilateral key agreement)' },
  { feature: 'Use Case', nano: 'Development, testing, casual use', full: 'Enterprise production, compliance' },
  { feature: 'License', nano: 'MIT (free)', full: 'Enterprise licensing' },
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
              {'>'} Model-Bound Cryptography & AI Security<span className="cursor-blink">_</span>
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-phosphor glow-text tracking-tight">
              ACTIVE-IQ
            </h1>
            <p className="mt-2 text-lg md:text-2xl font-bold text-phosphor/60 tracking-wide">
              SYSTEMS
            </p>
            <p className="mt-8 text-base md:text-lg text-offwhite/70 leading-relaxed max-w-3xl mx-auto">
              VectorGuard is a proprietary AI security platform that derives cryptographic material directly from AI model internals. It enables secure, zero-trust AI-to-AI communication without traditional key exchange -- the model itself is the key.
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
              <span>[WHISPER LEAK IMMUNE]</span>
              <span>[CUDA ACCELERATED]</span>
              <span>[ZERO KEY EXCHANGE]</span>
              <span>[PERFECT FORWARD SECRECY]</span>
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
                    Anthropic&apos;s Model Context Protocol (MCP) revolutionized AI-tool integration, but its transport layer shift from mandatory SSL to flexible HTTP streaming over TLS 1.3 created a critical security gap in the data custody chain for AI-to-AI communications.
                  </p>
                  <div className="space-y-2 text-xs text-offwhite/60">
                    <p className="flex items-start gap-2"><span className="text-amber flex-shrink-0">[!]</span> Data custody chain breaks in AI-to-AI communications</p>
                    <p className="flex items-start gap-2"><span className="text-amber flex-shrink-0">[!]</span> Man-in-the-middle risks on local/private deployments</p>
                    <p className="flex items-start gap-2"><span className="text-amber flex-shrink-0">[!]</span> Session hijacking during inter-model token handoffs</p>
                    <p className="flex items-start gap-2"><span className="text-amber flex-shrink-0">[!]</span> IDS/IPS detection of AI communication patterns via metadata</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber mb-4">[WARNING] Whisper Leak Vulnerability</h3>
                  <p className="text-sm text-offwhite/70 leading-relaxed mb-4">
                    Published by Microsoft researchers, Whisper Leak demonstrates that adversaries can infer LLM conversation topics with <span className="text-phosphor font-bold">&gt;98% accuracy</span> by analyzing encrypted TLS packet timing and sizes across 28 providers.
                  </p>
                  <div className="space-y-2 text-xs text-offwhite/60">
                    <p className="flex items-start gap-2"><span className="text-phosphor flex-shrink-0">{'>'}</span> TLS encryption protects content but NOT metadata</p>
                    <p className="flex items-start gap-2"><span className="text-phosphor flex-shrink-0">{'>'}</span> Current patches (padding, batching) add 2-3x bandwidth overhead</p>
                    <p className="flex items-start gap-2"><span className="text-phosphor flex-shrink-0">{'>'}</span> Microsoft&apos;s own research: &quot;none provides complete protection&quot;</p>
                    <p className="flex items-start gap-2"><span className="text-phosphor flex-shrink-0">{'>'}</span> Affects ALL major LLM providers (OpenAI, Anthropic, Google, AWS)</p>
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
            VectorGuard operates as a pre-transport geometric obfuscation layer. The model itself is the key.
          </p>
          <p className="text-offwhite/40 mb-10 text-xs">
            {'>'} AI model internals -&gt; Geometric transformation -&gt; Bilateral key agreement -&gt; Cypher stream generation -&gt; Protected token transmission
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
                <p><span className="text-amber">[01]</span> Sender AI processes message through local model</p>
                <p><span className="text-amber">[02]</span> Helix protocol initiates bilateral key agreement between models</p>
                <p><span className="text-amber">[03]</span> Both models derive shared cryptographic material from their own internal state</p>
                <p><span className="text-amber">[04]</span> VectorFlow generates synchronized cypher streams on both sides</p>
                <p><span className="text-amber">[05]</span> VectorStream applies cypher protection to outbound token data</p>
                <p><span className="text-amber">[06]</span> Protected tokens transmitted through standard transport layer</p>
                <p><span className="text-amber">[07]</span> Receiver decodes tokens in lockstep using matching cypher stream</p>
                <p><span className="text-amber">[08]</span> Receiver validates stream integrity and presents decrypted message</p>
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
                <p className="text-amber text-xs uppercase tracking-widest">MIT Licensed // Free Forever</p>
              </div>
              <p className="text-sm text-offwhite/70 leading-relaxed text-center max-w-2xl mx-auto mb-8">
                Lightweight, open-source secure messaging for AI agents. Drop-in solution for OpenClaw, MCP servers, and Claude Desktop. Start securing your agents today while evaluating the full VectorGuard platform for enterprise.
              </p>

              <div className="terminal-box p-4 mb-8 bg-void/50">
                <pre className="text-xs text-phosphor overflow-x-auto"><code>{`// Simple agent-to-agent secure messaging
const vgn = new Vgn();
const secret = "shared-agent-secret-key";

// Agent A sends
const secured = vgn.obfuscate("Launch data analysis", secret);

// Agent B receives
const original = vgn.deobfuscate(secured, secret);
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
                        VectorGuard-Nano (MIT)
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
