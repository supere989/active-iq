import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Whitepaper from './Whitepaper';
import Blog from './Blog';
import avatarImage from '../avatar/MUGSHOT.jpg';
import resumePdf from '../Resume.pdf?url';

const summary = `Analytically minded technology leader bridging enterprise infrastructure, security, and AI-driven automation to deliver resilient, high-performance operations across regulated environments.`;

const stats = [
  { value: '10+', label: 'Years leading enterprise support & engineering teams' },
  { value: '8+', label: 'Years orchestrating hybrid cloud & virtualization programs' },
  { value: '6+', label: 'Years architecting blockchain security platforms' },
];

const navigation = [
  { href: '#about', label: '// ABOUT' },
  { href: '#experience', label: '// EXPERIENCE' },
  { href: '#projects', label: '// PROJECTS' },
  { href: '#expertise', label: '// EXPERTISE' },
  { href: '#education', label: '// EDUCATION' },
  { href: '#vectorguard', label: '// VECTORGUARD' },
  { href: '/blog', label: '// BLOG', isRoute: true },
  { href: '#contact', label: '// CONTACT' },
];

const focusAreas = [
  {
    symbol: '[CLOUD]',
    title: 'Cloud & Systems Engineering',
    description:
      'Design and maintain hybrid cloud footprints spanning AWS, Azure, and on-prem data centers with strict SLA and compliance targets.',
    highlights: [
      'Automated server deployment pipelines and diskless boot orchestration',
      'Linux server clustering, failover, and performance optimization',
      'Microsoft 365, Active Directory, and remote infrastructure administration',
    ],
  },
  {
    symbol: '[SHIELD]',
    title: 'Security & Trust Engineering',
    description:
      'Fortify critical environments with defense-in-depth strategies that protect data, people, and operations across distributed enterprises.',
    highlights: [
      'CJIS Level 4 certified with rigorous compliance stewardship',
      'Network hardening across Meraki, Sophos, SonicWall, and site-to-site VPN fabrics',
      'Blockchain infrastructure design delivering resilient, tamper-evident services',
    ],
  },
  {
    symbol: '[CPU]',
    title: 'AI & Intelligent Automation',
    description:
      'Integrate intelligent agents, analytics, and automation into service delivery to unlock predictive insight and rapid remediation.',
    highlights: [
      'Prompt engineering for ChatGPT-class assistants and offline AI agents',
      'Data visualization and telemetry dashboards to uphold QoS benchmarks',
      'Machine learning and NLP experimentation for operational intelligence',
    ],
  },
  {
    symbol: '[OPS]',
    title: 'Operations Leadership',
    description:
      'Guide cross-functional teams delivering secure, always-on infrastructure and customer-first experiences.',
    highlights: [
      'Directed GPU compute build-outs achieving 99.999% uptime across distributed nodes',
      'Coordinated enterprise desktop engineering and managed virtual device deployments',
      'Mentored technicians, authored SOPs, and aligned stakeholders to transformation roadmaps',
    ],
  },
];

const experiences = [
  {
    company: 'Devfuzion IT, Marketing & Design',
    role: 'IT Technician Tier III',
    period: 'October 2018 \u2013 Present',
    location: 'Kennewick, WA',
    contributions: [
      'Deliver Tier III managed services across Microsoft 365, hybrid Active Directory, and distributed infrastructure estates.',
      'Engineer AI-driven automations, including prompt-engineered assistants and offline AI agent workflows for client support.',
      'Administer firewalls, VPNs, remote monitoring, and security auditing for regulated small-to-mid sized enterprises.',
      'Harden desktop environments with Group Policy, SQL Server integrations, and proactive incident response.',
    ],
  },
  {
    company: 'Motive IQ',
    role: 'Blockchain & Fintech Infrastructure Engineer',
    period: 'June 2016 \u2013 September 2018',
    location: 'Kennewick, WA',
    contributions: [
      'Directed blockchain and fintech infrastructure programs with detailed project plans and executive-ready presentations.',
      'Automated Linux operations through diskless boot processes, process recovery, and secure SSH orchestration.',
      'Authored policies, procedures, and technical documentation to align stakeholders and investors.',
      'Managed inventory, cost estimation, and procurement to deliver resilient compute installations.',
    ],
  },
  {
    company: 'CompuCom / Amazon Data Services',
    role: 'Data Center Operations Technician',
    period: 'February 2016 \u2013 May 2016',
    location: 'Umatilla, OR',
    contributions: [
      'Triaged high-volume data center ticket queues while coordinating change management resources across global teams.',
      'Enforced security and compliance for personnel, mobile devices, and physical access inside controlled facilities.',
      'Led ongoing training and knowledge transfer for service engineering staff to accelerate incident resolution.',
      'Executed emergency equipment repairs and resource planning to maintain aggressive SLA targets.',
    ],
  },
  {
    company: 'Apex Systems',
    role: 'Desktop Support Engineer',
    period: 'February 2014 \u2013 May 2015',
    location: 'Pasco, WA',
    contributions: [
      'Supported an enterprise environment of 700+ devices with SLA-driven troubleshooting and customer service.',
      'Managed Wyse managed virtual devices in medical environments, preserving QoS and compliance metrics.',
      'Led malware remediation, imaging, and lifecycle management for desktop and mobile endpoints.',
      'Partnered with cross-functional teams to diagnose complex infrastructure and application issues.',
    ],
  },
];

const projects = [
  {
    title: 'Hybrid MSP Automation Platform',
    description:
      'Automated onboarding, configuration management, and incident response workflows for managed service clientele using cloud-native tooling.',
    tech: ['Azure', 'PowerShell', 'Microsoft 365', 'Python'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    link: 'https://github.com/raymondjohnson',
  },
  {
    title: 'Blockchain Operations Control Suite',
    description:
      'Designed monitoring, recovery, and governance frameworks for high-availability blockchain mining and fintech infrastructure.',
    tech: ['Linux', 'Terraform', 'Prometheus', 'Go'],
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.linkedin.com/in/raymondjohnson',
  },
  {
    title: 'Clinical Desktop Modernization Program',
    description:
      'Modernized healthcare desktop platforms with virtualization, automated deployments, and resilient security baselines.',
    tech: ['Windows 10', 'SCCM', 'VMware', 'Power BI'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    link: 'mailto:raymondj@active-iq.com?subject=Clinical%20Desktop%20Modernization',
  },
];

const education = [
  {
    institution: 'Columbia Basin College',
    program: 'A.A. Computer Science \u2013 Cyber Security',
    period: 'January 2017 \u2013 April 2017',
    notes: 'Focused on network defense, incident response, and secure systems architecture.',
  },
  {
    institution: 'Keene IT',
    program: 'Windows 2000 Advanced Server Training',
    period: 'January 2000 \u2013 February 2000',
    notes: 'Certificate of completion covering enterprise server administration and Active Directory.',
  },
  {
    institution: 'Republic High School',
    program: 'Diploma, Computer & Information Sciences',
    period: 'September 1993 \u2013 June 1995',
    notes: 'STEM-focused curriculum with early programming and systems coursework.',
  },
];

const certifications = [
  {
    name: 'CJIS Level 4',
    issuer: 'Washington State Patrol',
    period: 'October 2024',
    notes: 'Validated to manage criminal justice information with rigorous security controls.',
  },
  {
    name: 'CompTIA A+',
    issuer: 'CompTIA',
    period: 'April 2014 \u2013 April 2017',
    notes: 'Completed 90-minute exam in 24 minutes with a 94% score.',
  },
  {
    name: 'Dell Certified Technician (Desktop, Portable, Server, Printer)',
    issuer: 'Dell',
    period: 'April 2014 \u2013 April 2016',
    notes: 'Authorized to service and repair Dell enterprise hardware platforms.',
  },
  {
    name: 'Microsoft Windows 2000 Advanced Server Certification',
    issuer: 'Microsoft',
    period: 'January 2000 \u2013 January 2002',
    notes: 'Advanced server administration, Active Directory, and enterprise infrastructure.',
  },
];

const vectorGuardMetrics = [
  {
    title: 'Unbounded Keyspace',
    description: 'Permutation-driven index tables produce limitless VectorFlow cypher streams from any 3D point cloud.',
  },
  {
    title: 'Deterministic Measurement Path',
    description: 'Index-of-indices graphs serialize every point-to-point measurement for reproducible stream generation.',
  },
  {
    title: 'Cross-Model Synchronization',
    description: 'Shared table metadata lets different model architectures derive aligned VectorGuard primitives.',
  },
];

const vectorGuardComponents = [
  {
    symbol: '[KEY]',
    title: 'VectorGuard Key Derivation',
    description: 'Transforms neural weight hierarchies into deterministic cypher streams bound to specific model instances.',
    bullets: [
      'Maps weight and context data into 3D point clouds using permutation-indexed value tables.',
      'Traverses deterministic index-of-indices paths to calculate point pair measurements.',
      'Locks encryption to shared model architecture, weights, and preserved measurement metadata.',
    ],
  },
  {
    symbol: '[LOCK]',
    title: 'VectorLock Data Encryption',
    description: 'Applies five sequential XOR layers using user, model, and positional entropy to seal data at rest.',
    bullets: [
      'Identity-bound entropy binds secrets to authorized operators.',
      'Model fingerprint indices guarantee only matched models can decrypt.',
      'Byte-level position mixing thwarts statistical or replay analysis.',
    ],
  },
  {
    symbol: '[STREAM]',
    title: 'VectorFlow & VectorStream',
    description: 'Generates and applies cypher streams to tokenizer output for AI-to-AI transport security.',
    bullets: [
      'Scaling is governed by the client hardware envelope and GPU-accelerated measurement pipelines.',
      'Creates session-unique cypher streams destroyed automatically on completion.',
      'Maintains server blindness\u2014intermediaries never see intelligible token data.',
    ],
  },
];

const vectorGuardGuarantees = [
  'Deterministic key regeneration only from exact model weights and fingerprints.',
  'Perfect forward secrecy through ephemeral session data destruction.',
  'Tamper detection via temporal metadata and model state validation.',
];

const vectorGuardUseCases = [
  {
    title: 'AI-to-AI Communication',
    description: 'Secures inter-model collaboration, distributed agents, and privacy-preserving orchestration.',
  },
  {
    title: 'Data Protection',
    description: 'Encrypts storage, databases, and configuration artifacts with model-bound keys.',
  },
  {
    title: 'Network Security',
    description: 'Hardens inference pipelines with zero-trust overlays and immutable audit trails.',
  },
  {
    title: 'Performance Engineering Services',
    description: 'VectorGuard optimization engagements tune measurement pipelines and infrastructure for maximum throughput on bespoke hardware.',
  },
];

/* ── Terminal UI helper components ── */

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

/* ── GitHub / LinkedIn SVG icons ── */

const GitHubIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedInIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ── Home Page ── */

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div id="home-top" className="relative min-h-screen bg-void text-offwhite font-mono">
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
            {/* Mobile hamburger */}
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
          {/* Mobile menu */}
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
            className="grid lg:grid-cols-[1fr_auto] gap-10 items-center"
          >
            <div>
              <p className="text-amber text-sm uppercase tracking-widest mb-4">
                {'>'} Intelligent Automation & Security Architecture<span className="cursor-blink">_</span>
              </p>
              <h1 className="text-5xl md:text-7xl font-bold text-phosphor glow-text tracking-tight">
                ACTIVE-IQ
              </h1>
              <p className="mt-6 text-lg text-offwhite/80 leading-relaxed max-w-2xl">
                {summary}
              </p>
              <div className="mt-8 space-y-2 text-sm text-offwhite/60">
                {stats.map((stat) => (
                  <p key={stat.label}>
                    <span className="text-phosphor font-bold">[{stat.value}]</span>{' '}
                    {stat.label}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/whitepaper')}
                  className="btn-terminal-filled"
                >
                  Discover VectorGuard
                </button>
                <a href={resumePdf} download className="btn-terminal inline-block">
                  Download Resume
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-xs text-offwhite/50">
                <span>$ location: Warden, WA 98857</span>
                <a href="tel:+15095189923" className="hover:text-phosphor transition-colors">
                  $ phone: +1 (509) 518-9923
                </a>
                <a href="mailto:raymondj@active-iq.com" className="hover:text-phosphor transition-colors">
                  $ email: raymondj@active-iq.com
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src={avatarImage}
                alt="Raymond Johnson"
                className="h-64 w-64 object-cover security-feed"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="ABOUT" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <TerminalBox title="ABOUT.sys">
              <div className="grid gap-8 lg:grid-cols-[auto_1fr] items-center">
                <div className="hidden lg:block">
                  <img
                    src={avatarImage}
                    alt="Raymond Johnson portrait"
                    className="h-56 w-56 object-cover security-feed"
                  />
                </div>
                <div>
                  <p className="text-offwhite/80 leading-relaxed">
                    I build dependable technology ecosystems that unite cloud, security, blockchain, and AI disciplines. From Tier III managed services to enterprise data centers, my focus is on translating complex challenges into automated, compliant, and highly available platforms that empower teams and customers.
                  </p>
                </div>
              </div>
            </TerminalBox>
          </motion.div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="terminal-box p-6"
              >
                <p className="text-3xl font-bold text-phosphor glow-text">{stat.value}</p>
                <p className="mt-2 text-sm text-offwhite/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="EXPERIENCE" />
          <p className="text-offwhite/60 mb-10 text-sm">
            Proven record transforming infrastructure, security, and service delivery across MSP, fintech, and enterprise environments.
          </p>
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TerminalBox title={`${experience.company.split(' ')[0].toUpperCase()}.log`}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-phosphor">{experience.role}</h3>
                      <p className="text-amber text-sm">{experience.company}</p>
                    </div>
                    <div className="text-xs text-offwhite/40">
                      <p>{experience.period}</p>
                      <p>{experience.location}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {experience.contributions.map((item) => (
                      <p key={item} className="text-sm text-offwhite/70 flex items-start gap-2">
                        <span className="text-phosphor/60 flex-shrink-0">{'>'}</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </TerminalBox>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="PROJECTS" />
          <p className="text-offwhite/60 mb-10 text-sm">
            Representative programs showcasing automation, security, and operational excellence.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.a
                key={project.title}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group block terminal-box overflow-hidden hover:border-phosphor/50 transition-colors"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover security-feed transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-phosphor">{project.title}</h3>
                  <p className="mt-2 text-xs text-offwhite/60 leading-relaxed">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="border border-phosphor/30 px-2 py-0.5 text-[10px] text-phosphor uppercase tracking-wider">
                        [{tech}]
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="EXPERTISE" />
          <p className="text-offwhite/60 mb-10 text-sm">
            Depth across cloud, security, AI, and operational leadership with measurable business impact.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {focusAreas.map(({ symbol, title, description, highlights }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TerminalBox title={title.split(' ')[0].toUpperCase() + '.cfg'}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-phosphor font-bold text-sm">{symbol}</span>
                    <h3 className="text-base font-bold text-phosphor">{title}</h3>
                  </div>
                  <p className="text-sm text-offwhite/70 leading-relaxed mb-4">{description}</p>
                  <div className="space-y-2">
                    {highlights.map((item) => (
                      <p key={item} className="text-xs text-offwhite/60 flex items-start gap-2">
                        <span className="text-phosphor/60 flex-shrink-0">{'>'}</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </TerminalBox>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="EDUCATION & CREDENTIALS" />
          <p className="text-offwhite/60 mb-10 text-sm">
            Continuing investment in technical mastery, compliance, and leadership excellence.
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <TerminalBox title="EDUCATION.log">
                <div className="space-y-6">
                  {education.map((item, i) => (
                    <div key={item.program} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-phosphor text-xs">{i === education.length - 1 ? '\u2514' : '\u251C'}\u2500\u2500</span>
                      </div>
                      <div>
                        <p className="text-xs text-amber uppercase tracking-wide">{item.period}</p>
                        <h4 className="mt-1 text-sm font-bold text-phosphor">{item.program}</h4>
                        <p className="text-xs text-offwhite/60">{item.institution}</p>
                        <p className="mt-1 text-xs text-offwhite/40">{item.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TerminalBox>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <TerminalBox title="CERTIFICATIONS.log">
                <div className="space-y-6">
                  {certifications.map((cert, i) => (
                    <div key={cert.name} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-phosphor text-xs">{i === certifications.length - 1 ? '\u2514' : '\u251C'}\u2500\u2500</span>
                      </div>
                      <div>
                        <p className="text-xs text-amber uppercase tracking-wide">{cert.period}</p>
                        <h4 className="mt-1 text-sm font-bold text-phosphor">{cert.name}</h4>
                        <p className="text-xs text-offwhite/60">{cert.issuer}</p>
                        <p className="mt-1 text-xs text-offwhite/40">{cert.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TerminalBox>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VectorGuard Section */}
      <section id="vectorguard" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionDivider label="VECTORGUARD" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="terminal-box border-phosphor/40">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2">VECTORGUARD.sys</span>
              </div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-phosphor text-4xl font-bold mb-2">[SHIELD]</p>
                  <h2 className="text-3xl font-bold text-phosphor glow-text">VectorGuard</h2>
                  <p className="mt-4 text-sm text-offwhite/70 leading-relaxed max-w-3xl mx-auto">
                    A proprietary cryptographic fabric that binds AI communications, storage, and network defense to the fingerprints of the participating models, delivering zero-trust security without traditional key exchange.
                  </p>
                </div>

                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => navigate('/whitepaper')}
                    className="btn-terminal-filled"
                  >
                    Read Full Whitepaper
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
                  {vectorGuardMetrics.map(({ title, description }) => (
                    <div key={title} className="terminal-box p-5 text-center">
                      <p className="text-lg font-bold text-phosphor glow-text">{title}</p>
                      <p className="mt-2 text-xs text-offwhite/50">{description}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
                  {vectorGuardComponents.map(({ symbol, title, description, bullets }) => (
                    <div key={title} className="terminal-box p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-phosphor font-bold text-sm">{symbol}</span>
                        <h3 className="text-sm font-bold text-phosphor">{title}</h3>
                      </div>
                      <p className="text-xs text-offwhite/60 leading-relaxed mb-3">{description}</p>
                      <div className="space-y-2">
                        {bullets.map((bullet) => (
                          <p key={bullet} className="text-xs text-offwhite/50 flex items-start gap-2">
                            <span className="text-phosphor/60 flex-shrink-0">{'>'}</span>
                            <span>{bullet}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="terminal-box p-6 border-phosphor/30">
                    <h3 className="text-sm font-bold text-phosphor mb-4">Security Guarantees</h3>
                    <div className="space-y-3">
                      {vectorGuardGuarantees.map((item) => (
                        <p key={item} className="text-xs text-offwhite/60 flex items-start gap-2">
                          <span className="text-phosphor flex-shrink-0">[+]</span>
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="terminal-box p-6">
                    <h3 className="text-sm font-bold text-phosphor mb-4">Deployment Focus</h3>
                    <div className="space-y-3">
                      {vectorGuardUseCases.map(({ title, description }) => (
                        <div key={title} className="bg-void/50 p-3 border border-phosphor/10">
                          <p className="text-sm font-bold text-phosphor">{title}</p>
                          <p className="mt-1 text-xs text-offwhite/40">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-center text-xs text-offwhite/30">
                  Provide mission parameters, performance data, and deployment milestones to extend the VectorGuard showcase with case studies and implementation visuals.
                </p>
              </div>
            </div>
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
              className="space-y-6"
            >
              <div className="terminal-box p-6 space-y-4">
                <div>
                  <span className="text-amber text-xs uppercase tracking-wider">$ location</span>
                  <p className="text-sm text-offwhite/80 mt-1">Warden, WA 98857</p>
                </div>
                <div>
                  <span className="text-amber text-xs uppercase tracking-wider">$ phone</span>
                  <p className="text-sm mt-1">
                    <a href="tel:+15095189923" className="text-offwhite/80 hover:text-phosphor transition-colors">+1 (509) 518-9923</a>
                  </p>
                </div>
                <div>
                  <span className="text-amber text-xs uppercase tracking-wider">$ email</span>
                  <p className="text-sm mt-1">
                    <a href="mailto:raymondj@active-iq.com" className="text-offwhite/80 hover:text-phosphor transition-colors">raymondj@active-iq.com</a>
                  </p>
                </div>
                <div>
                  <span className="text-amber text-xs uppercase tracking-wider">$ certifications</span>
                  <p className="text-xs text-offwhite/60 mt-1">CJIS Level 4 · CompTIA A+ · Dell Certified Technician · Microsoft Windows 2000 Advanced Server</p>
                </div>
                <div>
                  <span className="text-amber text-xs uppercase tracking-wider">$ links</span>
                  <div className="mt-2 flex gap-4">
                    <a href="https://github.com/Active-IQ" className="text-offwhite/50 hover:text-phosphor transition-colors flex items-center gap-2 text-xs" target="_blank" rel="noopener noreferrer">
                      <GitHubIcon className="h-4 w-4" />
                      [GITHUB]
                    </a>
                    <a href="https://www.linkedin.com/in/raymondjohnson" className="text-offwhite/50 hover:text-phosphor transition-colors flex items-center gap-2 text-xs" target="_blank" rel="noopener noreferrer">
                      <LinkedInIcon className="h-4 w-4" />
                      [LINKEDIN]
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <TerminalBox title="CONTACT.form">
                <h3 className="text-lg font-bold text-phosphor mb-2">Send a Message</h3>
                <p className="text-xs text-offwhite/50 mb-6">
                  Share project requirements, collaboration ideas, or speaking opportunities.
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
                      placeholder="How can I help?"
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
              <a href="https://www.linkedin.com/in/raymondjohnson" className="text-offwhite/30 hover:text-phosphor transition-colors text-xs" target="_blank" rel="noopener noreferrer">
                [LINKEDIN]
              </a>
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
      <Route path="/whitepaper" element={<Whitepaper />} />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  </Router>
);

export default App;
