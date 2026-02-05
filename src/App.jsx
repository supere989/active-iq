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
// import Whitepaper from './Whitepaper';
import Terminal from './components/Terminal';
// import avatarImage from '../avatar/MUGSHOT.jpg';
// import resumePdf from '../Resume.pdf?url';

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
];

const education = [
  {
    institution: 'Columbia Basin College',
    program: 'A.A. Computer Science – Cyber Security',
    period: 'January 2017 – April 2017',
    notes: 'Focused on network defense, incident response, and secure systems architecture.',
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
      className="relative min-h-screen bg-terminal-bg text-terminal-text transition-colors duration-300 font-mono"
    >
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-terminal-bg/90 backdrop-blur-md z-50 border-b border-primary-900/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => document.getElementById('home-top')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-primary-500 font-bold text-xl tracking-tighter hover:text-primary-400 shadow-primary-500/20"
              >
                &lt;Active-IQ /&gt;
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navigation.map(({ href, label, Icon }) => (
                <motion.button
                  key={href}
                  onClick={() => document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-400 transition-colors hover:text-primary-400"
                >
                  <span className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </span>
                </motion.button>
              ))}
              <motion.button
                type="button"
                onClick={cycleTheme}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full border border-primary-900/50 px-3 py-1.5 text-xs font-medium text-primary-500 transition-colors hover:bg-primary-900/20"
              >
                <ThemeIndicatorIcon className="h-4 w-4" />
                <span className="hidden lg:inline">{resolvedLabel}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-5xl text-center"
          >
            <div className="mb-12">
              <Terminal />
            </div>

            <h1 className="mt-6 text-5xl md:text-7xl font-bold text-white tracking-tight">
              Active-IQ
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-primary-400/80 leading-relaxed font-light">
              {summary}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <motion.button
                type="button"
                // onClick={() => navigate('/whitepaper')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded bg-primary-600 px-8 py-3 text-black font-bold shadow hover:bg-primary-500 transition-colors"
              >
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Initialize Protocols</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Grid Background */}
      <section className="py-20 bg-black relative border-y border-primary-900/30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="rounded border border-primary-900/50 bg-black/50 p-8 backdrop-blur"
              >
                <p className="text-4xl font-bold text-primary-500">{stat.value}</p>
                <p className="mt-3 text-sm text-gray-400 font-mono uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map(({ Icon, title, description, highlights }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded border border-gray-800 bg-gray-900/50 p-8 hover:border-primary-500/50 transition-colors group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded p-2 bg-primary-900/20 text-primary-500 group-hover:text-primary-400 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">{description}</p>
                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-500 font-mono">
                      <span className="text-primary-500 mt-0.5">»</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/whitepaper" element={<Whitepaper />} /> */}
        </Routes>
      </ThemeProvider>
    </Router>
  );
}
