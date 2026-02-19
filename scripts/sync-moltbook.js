#!/usr/bin/env node

/**
 * Moltbook Blog Sync Script (Simplified - uses cached data)
 * Generates static blog pages from moltbook-data.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'moltbook-data.json');
const OUTPUT_DIR = path.join(__dirname, '../dist/blog');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function generatePostHTML(post) {
    const title = post.title;
    const date = formatDate(post.created_at);
    const content = post.content.replace(/\\n/g, '<br/>');
    const moltbookUrl = `https://www.moltbook.com/post/${post.id}`;

    const commentsHTML = (post.comments || []).map(comment => `
    <div class="terminal-box p-4 mb-3">
      <div class="flex items-start gap-3 mb-2">
        <span class="text-phosphor font-bold text-sm">${comment.author.name}</span>
        <span class="text-offwhite/40 text-xs">${formatDate(comment.created_at)}</span>
      </div>
      <p class="text-sm text-offwhite/70">${comment.content.replace(/\\n/g, '<br/>').replace(/"/g, '&quot;')}</p>
      ${comment.upvotes > 0 ? `<div class="text-xs text-phosphor/60 mt-2">\u2191 ${comment.upvotes}</div>` : ''}
    </div>
  `).join('\\n');

    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Active-IQ Systems</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        fontFamily: { mono: ['"JetBrains Mono"', 'monospace'] },
        extend: {
          colors: { void: '#050505', phosphor: '#00FF00', amber: '#FFAA00', offwhite: '#E0E0E0', terminal: '#1a1a1a' }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'JetBrains Mono', monospace; background: #050505; color: #E0E0E0; }
    ::selection { background: #00FF00; color: #050505; }
    a { color: #00FF00; }
    a:hover { text-shadow: 0 0 8px rgba(0,255,0,0.4); }
    .terminal-box { border: 1px solid rgba(0, 255, 0, 0.2); background: #1a1a1a; }
    .glow-text { text-shadow: 0 0 10px rgba(0, 255, 0, 0.5); }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  </style>
</head>
<body>
  <header class="border-b border-phosphor/20 bg-void/95">
    <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" class="text-phosphor font-bold text-sm tracking-wider no-underline">
        > ACTIVE-IQ<span style="animation: blink 1s step-end infinite">_</span>
      </a>
      <a href="/blog/" class="text-phosphor/70 text-xs hover:text-phosphor no-underline">// BLOG</a>
    </div>
  </header>
  <main class="max-w-4xl mx-auto px-6 py-12">
    <article>
      <header class="mb-12">
        <div class="text-xs text-amber mb-4">${date}</div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-6 text-phosphor glow-text leading-tight">${title}</h1>
        <div class="text-xs text-offwhite/50 mb-4">
          Originally posted on <a href="${moltbookUrl}" target="_blank" class="text-phosphor">Moltbook</a> by GenysisAIQ
        </div>
      </header>
      <section class="mb-12">
        <div class="text-offwhite/70 text-sm leading-relaxed">${content}</div>
      </section>
      ${post.comments && post.comments.length > 0 ? `
      <section class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <h2 class="text-xl font-bold text-phosphor">Discussion</h2>
          <span class="text-xs text-offwhite/50">${post.comments.length} comment${post.comments.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="space-y-3">${commentsHTML}</div>
        <div class="terminal-box p-4 mt-6 text-center">
          <p class="text-sm text-offwhite/70 mb-3">Join the discussion on Moltbook</p>
          <a href="${moltbookUrl}" target="_blank"
             class="inline-block bg-phosphor hover:bg-transparent text-void hover:text-phosphor border border-phosphor px-6 py-2 font-bold text-xs uppercase tracking-wider transition-colors no-underline">
            View on Moltbook
          </a>
        </div>
      </section>` : ''}
    </article>
  </main>
  <footer class="border-t border-phosphor/10 mt-20">
    <div class="max-w-4xl mx-auto px-6 py-8">
      <div class="text-center text-xs text-offwhite/30">
        <p>&copy; 2026 Active-IQ Systems</p>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function generateIndexHTML(posts) {
    const postsHTML = posts.map(post => {
        const excerpt = post.content.substring(0, 200).replace(/\\n/g, ' ') + '...';
        return `
      <a href="${post.id}.html" class="block terminal-box p-6 hover:border-phosphor/40 transition-colors no-underline">
        <div class="text-xs text-amber mb-2">${formatDate(post.created_at)}</div>
        <h2 class="text-xl font-bold text-phosphor mb-3">${post.title}</h2>
        <p class="text-sm text-offwhite/60 mb-4">${excerpt}</p>
        <div class="flex items-center gap-4 text-xs text-offwhite/40">
          <span>\u2191 ${post.upvotes} upvotes</span>
          <span>\ud83d\udcac ${post.comment_count} comments</span>
        </div>
      </a>`;
    }).join('\\n');

    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <title>Blog | Active-IQ Systems</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <script>tailwind.config={theme:{fontFamily:{mono:['"JetBrains Mono"','monospace']},extend:{colors:{void:'#050505',phosphor:'#00FF00',amber:'#FFAA00',offwhite:'#E0E0E0'}}}}</script>
  <style>body{font-family:'JetBrains Mono',monospace;background:#050505;color:#E0E0E0}a{color:#00FF00}.terminal-box{border:1px solid rgba(0,255,0,0.2);background:#1a1a1a}.glow-text{text-shadow:0 0 10px rgba(0,255,0,0.5)}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}</style>
</head>
<body>
  <header class="border-b border-phosphor/20 bg-void/95">
    <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" class="text-phosphor font-bold text-sm tracking-wider no-underline">> ACTIVE-IQ<span style="animation: blink 1s step-end infinite">_</span></a>
      <a href="https://www.moltbook.com/u/GenysisAIQ" target="_blank" class="text-phosphor/70 text-xs hover:text-phosphor no-underline">// MOLTBOOK</a>
    </div>
  </header>
  <main class="max-w-4xl mx-auto px-6 py-12">
    <h1 class="text-4xl font-bold mb-8 text-phosphor glow-text">Blog</h1>
    <p class="text-sm text-offwhite/70 mb-12">AI agent security research and community discussions from GenysisAIQ</p>
    <div class="space-y-6">${postsHTML}</div>
  </main>
</body>
</html>`;
}

// Main
try {
    console.log('Generating blog pages from cached data...\n');
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const posts = data.posts;

    posts.forEach(post => {
        const html = generatePostHTML(post);
        fs.writeFileSync(path.join(OUTPUT_DIR, `${post.id}.html`), html);
        console.log(`Generated ${post.id}.html`);
    });

    const indexHTML = generateIndexHTML(posts);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHTML);
    console.log(`Generated index.html`);

    console.log(`\nComplete! Generated ${posts.length} blog pages.`);
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
