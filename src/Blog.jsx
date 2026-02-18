import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    slug: 'vectorguard-nano',
    title: 'Introducing VectorGuard-Nano: Free Secure Messaging for AI Agents',
    date: 'February 5, 2026',
    excerpt:
      'The AI agent revolution is here, but there\'s a critical gap: no standard for secure agent-to-agent communication. Today we\'re releasing VectorGuard-Nano as free, MIT-licensed open-source software.',
    tags: ['AI Security', 'Open Source', 'Product Launch'],
  },
];

const Blog = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-void text-offwhite font-mono">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/')}
          className="text-phosphor/70 hover:text-phosphor text-sm transition-colors mb-8 inline-block"
        >
          {'> cd /'}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-divider mb-6">
            <span>// BLOG</span>
          </div>
          <p className="text-sm text-offwhite/60 mb-12">
            Updates on AI agent security, model-bound cryptography, and the VectorGuard Protocol.
          </p>
        </motion.div>

        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="terminal-box cursor-pointer hover:border-phosphor/50 transition-colors"
              onClick={() => {
                window.location.href = `/blog/${post.slug}.html`;
              }}
            >
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2">POST.entry</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-phosphor text-sm font-bold">[SHIELD]</span>
                  <span className="text-xs text-amber">
                    {post.date}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-phosphor mb-3">
                  {post.title}
                </h2>
                <p className="text-sm text-offwhite/70 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-phosphor/30 px-2 py-0.5 text-[10px] text-phosphor uppercase tracking-wider"
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
