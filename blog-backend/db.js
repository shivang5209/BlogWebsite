const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'blog.db');
const db = new Database(dbPath);

// Enable WAL journal mode for performance and concurrent read/writes
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    content TEXT,
    content_type TEXT DEFAULT 'richtext',
    tags TEXT,
    status TEXT DEFAULT 'draft',
    scheduled_at TEXT,
    featured INTEGER DEFAULT 0,
    read_time TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    published_at TEXT
  );
`);

// Seed function to pre-populate existing mock posts if database is fresh
function seedDatabase() {
  const count = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  if (count > 0) return;

  console.log('Database is empty. Seeding initial posts...');

  const initialPosts = [
    {
      title: "The Future of Decentralized AI Agents: Consensus Protocols for LLMs",
      slug: "decentralized-ai-agents",
      category: "Research",
      excerpt: "Exploring a theoretical model where decentralized AI agents reach consensus on complex tasks using modified proof-of-stake algorithms.",
      cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
      content_type: "richtext",
      tags: JSON.stringify(["AI", "Protocols", "Consensus"]),
      status: "published",
      featured: 1,
      read_time: "7 min read",
      published_at: new Date().toISOString(),
      content: `
        <p>As large language models (LLMs) grow in capability, the paradigm is shifting from individual chat completions to multi-agent architectures. However, coordinating these agents in trustless or semi-trusted environments introduces classical distributed systems challenges. How do we ensure that a swarm of agents agrees on a single execution path or truth value without a single centralized orchestrator?</p>
        
        <h2>The Consensus Problem in LLM Swarms</h2>
        <p>Traditional consensus mechanisms like Raft or Paxos rely on deterministic state machines. LLMs, by their nature, are probabilistic. The same prompt given to three identical agents can produce three semantically similar but syntactically distinct plans. Therefore, agreement must be reached on a <em>semantic level</em> rather than a binary state level.</p>
        
        <h3>Introducing Semantic Proof-of-Stake (sPoS)</h3>
        <p>We propose a hybrid mechanism where agents act as validators. An agent proposes a solution (e.g., a synthesized code block or a query execution plan). A set of randomly selected validator agents evaluate the proposal based on a deterministic test suite and a probabilistic cross-examination prompt.</p>
        
        <pre><code class="language-javascript">
// Theoretical Validator Vote Schema
const validatorVote = {
  proposalId: "prop_9832",
  validatorId: "agent_node_3",
  semanticAlignmentScore: 0.94, // Eval via embedding similarity
  testVerificationPassed: true,
  signature: "0x892a...f4"
};
        </code></pre>
        
        <h2>Next Steps in the Research</h2>
        <p>Our initial simulations show that semantic consensus can prevent hallucination loops in up to 85% of multi-agent execution paths, but at the cost of high token overhead. We are currently working on a lightweight latency-friendly model using smaller fine-tuned models to act as validators.</p>
      `
    },
    {
      title: "Building Antigravity: An Ultra-Fast Static Engine",
      slug: "building-antigravity-engine",
      category: "Projects",
      excerpt: "A behind-the-scenes look at how I developed an open-source static site compiler that builds websites in milliseconds.",
      cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
      content_type: "richtext",
      tags: JSON.stringify(["Open Source", "Builds", "Go"]),
      status: "published",
      featured: 0,
      read_time: "5 min read",
      published_at: new Date().toISOString(),
      content: `
        <p>Over the last few months, I've been building <strong>Antigravity</strong>, an experimental static site compiler optimized for rapid rendering and minimal client-side overhead. Here is why I built it and how it works.</p>
        
        <h2>Why Another Static Site Generator?</h2>
        <p>Most modern SSGs pull in massive dependencies and produce large client JS payloads. I wanted a zero-dependency compiler written in a language that compiles to binary, with native assets bundling and instant hot-reloading.</p>
        
        <h3>Core Tech Stack</h3>
        <ul>
          <li><strong>Compiler Core</strong>: Go (for concurrent markdown parsing)</li>
          <li><strong>Asset Pipeline</strong>: Custom Rust-based minifier</li>
          <li><strong>Client Router</strong>: Pure vanilla script under 2KB</li>
        </ul>
        
        <pre><code class="language-rust">
// Rust-based asset pipeline entry point
fn minify_javascript(source: &str) -> String {
    let mut minified = String::new();
    // Tokenization and structural compression here
    minified
}
        </code></pre>
        
        <h2>Performance Results</h2>
        <p>On a test directory of 1,000 markdown pages, Antigravity built the entire site in exactly <strong>142ms</strong>. Hot reload is virtually instantaneous because it uses a WebSocket-free DOM diffing injection mechanism.</p>
      `
    },
    {
      title: "Why WebGPU is a Game Changer for Browser Applications",
      slug: "webgpu-and-next-gen-graphics",
      category: "Tech",
      excerpt: "An in-depth look at how WebGPU is replacing WebGL to bring native-level GPU compute and rendering directly to the web browser.",
      cover_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
      content_type: "richtext",
      tags: JSON.stringify(["GPU compute", "Cloud", "WebGPU"]),
      status: "published",
      featured: 0,
      read_time: "4 min read",
      published_at: new Date().toISOString(),
      content: `
        <p>WebGPU is officially here, and it is not just a simple upgrade to WebGL. It is a completely new API designed from the ground up to match the architecture of modern system APIs like Vulkan, Metal, and Direct3D 12.</p>
        
        <h2>WebGL vs WebGPU: The Architectural Shift</h2>
        <p>WebGL was based on OpenGL ES 2.0, representing a global state machine model. It was single-threaded and struggled with CPU overhead. WebGPU, on the other hand, embraces multithreaded command recording, pipelines, and native GPU compute shaders.</p>
        
        <pre><code class="language-javascript">
// Initializing a WebGPU Device
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  console.log("WebGPU not supported on this browser.");
}
const device = await adapter.requestDevice();
        </code></pre>
        
        <h2>Compute Shaders in the Browser</h2>
        <p>With compute shaders, browsers can now run complex physics simulations, large-scale data rendering, and even local neural network inference at speeds that were previously impossible without native binaries.</p>
      `
    },
    {
      title: "Advanced TypeScript Types for Custom React Hooks",
      slug: "custom-hook-typescript-optimization",
      category: "Code",
      excerpt: "Learn how to use conditional types, generics, and template literal types to build bulletproof custom hooks in TypeScript.",
      cover_image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600&auto=format&fit=crop",
      content_type: "richtext",
      tags: JSON.stringify(["TypeScript", "Snippets", "React"]),
      status: "published",
      featured: 0,
      read_time: "6 min read",
      published_at: new Date().toISOString(),
      content: `
        <p>Writing type-safe React hooks is relatively straightforward for simple states, but when building complex reusable hooks that handle dynamic options, TypeScript's advanced type system becomes essential.</p>
        
        <h2>The Goal: A Dynamic LocalStorage Hook</h2>
        <p>We want a <code>useLocalStorage</code> hook that dynamically handles serialization/deserialization while strictly typing the key and the stored values based on a global schema.</p>
        
        <pre><code class="language-typescript">
// Advanced generic hook typing
interface StorageSchema {
  theme: 'light' | 'dark';
  fontSize: number;
  userName: string;
}

function useLocalStorage<K extends keyof StorageSchema>(
  key: K,
  initialValue: StorageSchema[K]
): [StorageSchema[K], (val: StorageSchema[K]) => void] {
  // Implementation details...
  return [initialValue, (val) => {}];
}
        </code></pre>
        
        <h2>Leveraging Template Literal Types</h2>
        <p>By combining template literals with index types, we can auto-generate prefix-based storage namespaces directly in our types, ensuring no collision between storage environments.</p>
      `
    },
    {
      title: "How to Build a Custom Glassmorphic Component Library",
      slug: "building-beautiful-ui-from-scratch",
      category: "Tutorials",
      excerpt: "A step-by-step tutorial on crafting premium frosted-glass UI elements using custom properties, backdrop-filters, and modern layout systems.",
      cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      content_type: "richtext",
      tags: JSON.stringify(["CSS", "React", "Design"]),
      status: "published",
      featured: 0,
      read_time: "10 min read",
      published_at: new Date().toISOString(),
      content: `
        <p>In this tutorial, we will construct a set of flexible, responsive cards and buttons with a sleek, premium glass aesthetic. No third-party UI framework required.</p>
        
        <h2>Step 1: Setting up the Backdrop Blur</h2>
        <p>The foundation of glassmorphism is the <code>backdrop-filter</code> property. This applies graphics effects like blur or color shifting to the area behind an element.</p>
        
        <pre><code class="language-css">
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
        </code></pre>
        
        <h2>Step 2: Adding the Inner Border Glow</h2>
        <p>To make cards look premium, we simulate a light source reflecting on the edges by adding a slightly lighter top/left border using linear gradients.</p>
      `
    },
    {
      title: "My New Digital Home: shivangcodes.in",
      slug: "setting-up-domain-and-subdomain",
      category: "Personal",
      excerpt: "I recently purchased shivangcodes.in. Here is my plan for this domain, the blog subdomain, and the tech stack I am setting up.",
      cover_image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop",
      content_type: "richtext",
      tags: JSON.stringify(["Updates", "Journal", "Setup"]),
      status: "published",
      featured: 0,
      read_time: "3 min read",
      published_at: new Date().toISOString(),
      content: `
        <p>Yesterday, I made it official and bought my new domain name: <strong>shivangcodes.in</strong>! 🌐</p>
        
        <h2>The Vision</h2>
        <p>This domain is going to serve as my personal digital hub. I wanted a space that I fully own, free from the algorithms and styling constraints of medium, dev.to, or social platforms. It is a place to document what I build, host research notes, and store simple code scripts.</p>
        
        <h3>Domain Architecture</h3>
        <ul>
          <li><code>shivangcodes.in</code> — Portfolio, personal bio, and list of ongoing projects.</li>
          <li><code>blog.shivangcodes.in</code> — This blog! Dedicated to tutorials, coding guides, tech discussions, and raw research ideas.</li>
        </ul>
        
        <h2>Setting Up Netlify DNS</h2>
        <p>For hosting, I decided to go with Netlify. It's incredibly fast, handles custom domains with automated SSL generation out of the box, and deploys directly from my GitHub repository.</p>
        <p>I'm looking forward to using this space to write regularly. Let the journey begin!</p>
      `
    }
  ];

  const insert = db.prepare(`
    INSERT INTO posts (title, slug, category, excerpt, cover_image, content_type, tags, status, featured, read_time, published_at, content)
    VALUES (@title, @slug, @category, @excerpt, @cover_image, @content_type, @tags, @status, @featured, @read_time, @published_at, @content)
  `);

  const insertMany = db.transaction((posts) => {
    for (const post of posts) insert.run(post);
  });

  insertMany(initialPosts);
  console.log('Seeded database with initial posts successfully.');
}

// Call seed function
seedDatabase();

module.exports = db;
