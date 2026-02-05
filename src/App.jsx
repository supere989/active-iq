import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  MapPinIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import {
  BriefcaseIcon,
  UserIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/solid';
import Whitepaper from './Whitepaper';
import avatarImage from '../avatar/MUGSHOT.jpg';
import resumePdf from '../Resume.pdf?url';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'theme-preference';

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyDocumentTheme = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved === 'dark' ? 'dark' : 'light');
  root.dataset.theme = resolved;
};

const useThemeManager = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    return localStorage.getItem(THEME_STORAGE_KEY) ?? 'system';
  });

  const resolvedTheme = useMemo(() => (theme === 'system' ? getSystemTheme() : theme), [theme]);

  useEffect(() => {
    applyDocumentTheme(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyDocumentTheme('system');
      }
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      const order = ['system', 'light', 'dark'];
      return order[(order.indexOf(prev) + 1) % order.length];
    });
  };

  return {
    theme,
    resolvedTheme,
    cycleTheme,
  };
};

const ThemeProvider = ({ children }) => {
  const value = useThemeManager();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const summary = `Analytically minded technology leader bridging enterprise infrastructure, security, and AI-driven automation to deliver resilient, high-performance operations across regulated environments.`;

const stats = [
  { value: '10+', label: 'Years leading enterprise support & engineering teams' },
  { value: '8+', label: 'Years orchestrating hybrid cloud & virtualization programs' },
  { value: '6+', label: 'Years architecting blockchain security platforms' },
];

const navigation = [
  { href: '#about', label: 'About', Icon: UserIcon },
  { href: '#experience', label: 'Experience', Icon: BriefcaseIcon },
  { href: '#projects', label: 'Projects', Icon: ServerStackIcon },
  { href: '#expertise', label: 'Expertise', Icon: CpuChipIcon },
  { href: '#education', label: 'Education', Icon: AcademicCapIcon },
  { href: '#vectorguard', label: 'VectorGuard', Icon: ShieldCheckIcon },
  { href: '#contact', label: 'Contact', Icon: EnvelopeIcon },
];

const focusAreas = [
  {
    Icon: CloudArrowUpIcon,
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
    Icon: ShieldCheckIcon,
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
    Icon: CpuChipIcon,
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
    Icon: ServerStackIcon,
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
    period: 'October 2018 – Present',
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
    period: 'June 2016 – September 2018',
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
    period: 'February 2016 – May 2016',
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
    period: 'February 2014 – May 2015',
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
    link: 'mailto:supere989@gmail.com?subject=Clinical%20Desktop%20Modernization',
  },
];

const education = [
  {
    institution: 'Columbia Basin College',
    program: 'A.A. Computer Science – Cyber Security',
    period: 'January 2017 – April 2017',
    notes: 'Focused on network defense, incident response, and secure systems architecture.',
  },
  {
    institution: 'Keene IT',
    program: 'Windows 2000 Advanced Server Training',
    period: 'January 2000 – February 2000',
    notes: 'Certificate of completion covering enterprise server administration and Active Directory.',
  },
  {
    institution: 'Republic High School',
    program: 'Diploma, Computer & Information Sciences',
    period: 'September 1993 – June 1995',
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
    period: 'April 2014 – April 2017',
    notes: 'Completed 90-minute exam in 24 minutes with a 94% score.',
  },
  {
    name: 'Dell Certified Technician (Desktop, Portable, Server, Printer)',
    issuer: 'Dell',
    period: 'April 2014 – April 2016',
    notes: 'Authorized to service and repair Dell enterprise hardware platforms.',
  },
  {
    name: 'Microsoft Windows 2000 Advanced Server Certification',
    issuer: 'Microsoft',
    period: 'January 2000 – January 2002',
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
    Icon: CpuChipIcon,
    title: 'VectorGuard Key Derivation',
    description: 'Transforms neural weight hierarchies into deterministic cypher streams bound to specific model instances.',
    bullets: [
      'Maps weight and context data into 3D point clouds using permutation-indexed value tables.',
      'Traverses deterministic index-of-indices paths to calculate point pair measurements.',
      'Locks encryption to shared model architecture, weights, and preserved measurement metadata.',
    ],
  },
  {
    Icon: ShieldCheckIcon,
    title: 'VectorLock Data Encryption',
    description: 'Applies five sequential XOR layers using user, model, and positional entropy to seal data at rest.',
    bullets: [
      'Identity-bound entropy binds secrets to authorized operators.',
      'Model fingerprint indices guarantee only matched models can decrypt.',
      'Byte-level position mixing thwarts statistical or replay analysis.',
    ],
  },
  {
    Icon: ServerStackIcon,
    title: 'VectorFlow & VectorStream',
    description: 'Generates and applies cypher streams to tokenizer output for AI-to-AI transport security.',
    bullets: [
      'Scaling is governed by the client hardware envelope and GPU-accelerated measurement pipelines.',
      'Creates session-unique cypher streams destroyed automatically on completion.',
      'Maintains server blindness—intermediaries never see intelligible token data.',
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

const Home = () => {
  const navigate = useNavigate();
  const { theme, resolvedTheme, cycleTheme } = useTheme();

  const ThemeIndicatorIcon = useMemo(() => {
    if (theme === 'system') return ComputerDesktopIcon;
    return theme === 'dark' ? MoonIcon : SunIcon;
  }, [theme]);

  const resolvedLabel = useMemo(() => {
    if (theme === 'system') {
      return `System (${resolvedTheme})`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }, [theme, resolvedTheme]);

  return (
    <div
      id="home-top"
      className="relative min-h-screen bg-gradient-to-b from-primary-50 to-white text-gray-900 transition-colors duration-300 dark:from-slate-950 dark:to-slate-900 dark:text-gray-100"
    >
    {/* Navigation */}
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm dark:bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => document.getElementById('home-top')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full focus:outline-none focus-visible:ring focus-visible:ring-primary-300"
            >
              <img
                src={avatarImage}
                alt="Raymond Johnson"
                className="h-12 w-12 rounded-full border-2 border-white shadow"
              />
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map(({ href, label, Icon }) => (
              <motion.button
                key={href}
                onClick={() => document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                className="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-300"
              >
                <span className="flex items-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </span>
              </motion.button>
            ))}
            <motion.button
              type="button"
              onClick={cycleTheme}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:text-primary-300"
              aria-label={`Toggle color mode (current: ${resolvedLabel})`}
            >
              <ThemeIndicatorIcon className="h-5 w-5" />
              <span className="hidden lg:inline">{resolvedLabel}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="relative pt-32 pb-32 lg:pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center lg:text-left"
        >
          <div>
            <p className="text-lg font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-300">
              Cloud Systems Architect · AI Systems Integration
            </p>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
              Raymond Johnson
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-600 leading-relaxed dark:text-gray-300">
              {summary}
            </p>
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
            <motion.button
              type="button"
              onClick={() => navigate('/whitepaper')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-3 text-white shadow hover:bg-primary-700 transition-colors"
            >
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Discover VectorGuard</span>
            </motion.button>
            <motion.a
              href={resumePdf}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary-600 px-8 py-3 text-primary-600 shadow hover:bg-primary-50 transition-colors"
              download
            >
              <BriefcaseIcon className="h-5 w-5" />
              <span>Download Résumé</span>
            </motion.a>
          </div>
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm md:text-base text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-primary-600 dark:text-primary-300" />
              Warden, WA 98857
            </span>
            <a href="tel:+15095189923" className="inline-flex items-center gap-2 hover:text-primary-600">
              <PhoneIcon className="h-5 w-5 text-primary-600 dark:text-primary-300" />
              +1 (509) 518-9923
            </a>
            <a href="mailto:supere989@gmail.com" className="inline-flex items-center gap-2 hover:text-primary-600">
              <EnvelopeIcon className="h-5 w-5 text-primary-600 dark:text-primary-300" />
              supere989@gmail.com
            </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* About Section */}
    <section id="about" className="py-20 bg-gray-50 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
            <div className="hidden lg:flex justify-center">
              <img
                src={avatarImage}
                alt="Raymond Johnson portrait"
                className="h-72 w-72 rounded-3xl border-4 border-primary-100 shadow-xl object-cover"
              />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">About</h2>
              <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed dark:text-gray-300">
                I build dependable technology ecosystems that unite cloud, security, blockchain, and AI disciplines. From Tier III managed services to enterprise data centers, my focus is on translating complex challenges into automated, compliant, and highly available platforms that empower teams and customers.
              </p>
            </div>
          </div>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800/80 dark:shadow-slate-900/40"
            >
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-300">{stat.value}</p>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Experience Section */}
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Experience</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Proven record transforming infrastructure, security, and service delivery across MSP, fintech, and enterprise environments.
          </p>
        </motion.div>

        <div className="mt-12 space-y-10">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800/80"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{experience.role}</h3>
                  <p className="mt-1 text-lg text-primary-600 dark:text-primary-300">{experience.company}</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>{experience.period}</p>
                  <p>{experience.location}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {experience.contributions.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600">
                    <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-300" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Projects Section */}
    <section id="projects" className="py-20 bg-gray-50 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Projects & Initiatives</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Representative programs showcasing automation, security, and operational excellence.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
              className="group block overflow-hidden rounded-2xl bg-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-slate-800/80"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed dark:text-gray-300">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
                      {tech}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Core Expertise</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Depth across cloud, security, AI, and operational leadership with measurable business impact.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {focusAreas.map(({ Icon, title, description, highlights }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800/80"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary-100 p-3 text-primary-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              </div>
              <p className="mt-4 text-base text-gray-600 leading-relaxed dark:text-gray-300">{description}</p>
              <ul className="mt-6 space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600">
                    <CheckCircleIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-300" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Education & Certifications */}
    <section id="education" className="py-20 bg-gray-50 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Education & Credentials</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Continuing investment in technical mastery, compliance, and leadership excellence.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800/80"
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Education</h3>
            <div className="mt-6 space-y-6">
              {education.map((item) => (
                <div key={item.program} className="border-l-2 border-primary-200 pl-4">
                  <p className="text-sm uppercase tracking-wide text-primary-600 dark:text-primary-300">{item.period}</p>
                  <h4 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{item.program}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.institution}</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.notes}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800/80"
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Certifications</h3>
            <div className="mt-6 space-y-6">
              {certifications.map((cert) => (
                <div key={cert.name} className="border-l-2 border-primary-200 pl-4">
                  <p className="text-sm uppercase tracking-wide text-primary-600 dark:text-primary-300">{cert.period}</p>
                  <h4 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{cert.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{cert.issuer}</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{cert.notes}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* VectorGuard Section */}
    <section id="vectorguard" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-primary-200 bg-white p-10 shadow-lg"
        >
          <div className="flex justify-center">
            <div className="rounded-full bg-primary-100 p-4 text-primary-600">
              <ShieldCheckIcon className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">VectorGuard</h2>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            A proprietary cryptographic fabric that binds AI communications, storage, and network defense to the fingerprints of the participating models, delivering zero-trust security without traditional key exchange.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/whitepaper')}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Read Full Whitepaper
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {vectorGuardMetrics.map(({ title, description }) => (
              <div key={title} className="rounded-2xl bg-primary-50 p-6 text-center text-primary-700 shadow-sm">
                <p className="text-3xl font-bold">{title}</p>
                <p className="mt-3 text-sm font-medium text-primary-800/80">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {vectorGuardComponents.map(({ Icon, title, description, bullets }) => (
              <div key={title} className="flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-6 shadow-sm dark:border-primary-900/40 dark:bg-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary-100 p-3 text-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed dark:text-gray-300">{description}</p>
                <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-primary-50 p-8 dark:bg-primary-900/20">
              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Security Guarantees</h3>
              <ul className="mt-4 space-y-3 text-sm text-primary-900 dark:text-primary-100">
                {vectorGuardGuarantees.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-primary-100 p-8 dark:border-primary-900/40 dark:bg-slate-800/80">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deployment Focus</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                {vectorGuardUseCases.map(({ title, description }) => (
                  <li key={title} className="rounded-xl bg-gray-50 p-4 dark:bg-slate-900/70">
                    <p className="font-medium text-gray-900 dark:text-white">{title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Provide mission parameters, performance data, and deployment milestones to extend the VectorGuard showcase with case studies and implementation visuals.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Contact Section */}
    <section id="contact" className="py-20 bg-gray-900 text-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold">Let’s Build What’s Next</h2>
          <p className="mt-4 text-lg text-gray-300">
            I welcome conversations around cloud modernization, AI integration, security architecture, and blockchain-enabled resiliency.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary-600/20 p-3 text-primary-200">
                <MapPinIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Location</h3>
                <p className="text-gray-300">Warden, WA 98857</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary-600/20 p-3 text-primary-200">
                <PhoneIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Phone</h3>
                <a href="tel:+15095189923" className="text-gray-300 hover:text-white">+1 (509) 518-9923</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary-600/20 p-3 text-primary-200">
                <EnvelopeIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <a href="mailto:supere989@gmail.com" className="text-gray-300 hover:text-white">supere989@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary-600/20 p-3 text-primary-200">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Certifications</h3>
                <p className="text-gray-300">CJIS Level 4 · CompTIA A+ · Dell Certified Technician · Microsoft Windows 2000 Advanced Server</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary-600/20 p-3 text-primary-200">
                <ServerStackIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Social</h3>
                <div className="mt-2 flex gap-4">
                  <a href="https://github.com/raymondjohnson" className="text-gray-400 hover:text-white" aria-label="GitHub">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  </a>
                  <a href="https://www.linkedin.com/in/raymondjohnson" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </motion.div>
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
            className="rounded-3xl bg-white/5 p-10 shadow-lg dark:bg-white/10"
          >
            <h3 className="text-2xl font-semibold">Send a Message</h3>
            <p className="mt-2 text-sm text-gray-300">
              Share project requirements, collaboration ideas, or speaking opportunities.
            </p>
            <form className="mt-6 space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="How can I help?"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary-600 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg hover:bg-primary-500"
              >
                Submit Inquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-black py-8 text-gray-400 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Raymond Johnson. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com/raymondjohnson" className="hover:text-white" aria-label="GitHub">
              <motion.div whileHover={{ scale: 1.1 }}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            </a>
            <a href="https://www.linkedin.com/in/raymondjohnson" className="hover:text-white" aria-label="LinkedIn">
              <motion.div whileHover={{ scale: 1.1 }}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.div>
            </a>
          </div>
        </div>
      </div>
    </footer>

    {/* Scroll Down Arrow */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="pointer-events-none fixed bottom-10 left-1/2 hidden -translate-x-1/2 md:block"
    >
      <motion.div whileHover={{ y: -5 }} className="text-primary-600">
        <ChevronDownIcon className="w-6 h-6" />
      </motion.div>
    </motion.div>
  </div>
  );
};

const App = () => (
  <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whitepaper" element={<Whitepaper />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
