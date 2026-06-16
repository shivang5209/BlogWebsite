const BLOG_POSTS = [
  {
    id: "decentralized-ai-agents",
    title: "The Future of Decentralized AI Agents: Consensus Protocols for LLMs",
    category: "Research",
    date: "June 15, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
    excerpt: "Exploring a theoretical model where decentralized AI agents reach consensus on complex tasks using modified proof-of-stake algorithms.",
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
    id: "repurpose-old-laptop-server",
    title: "Turning an Old Laptop Into a Powerful Local Server: A Hands-On Guide",
    category: "Projects",
    date: "June 10, 2026",
    readTime: "5 min read",
    image: "/fedora-server-thumbnail.png",
    excerpt: "We all have an old laptop lying around collecting dust. Instead of letting that hardware go to waste, why not turn it into something incredibly useful? A dedicated home server can host your backend applications, run local automated workflows, or manage a self-hosted database completely for free—saving you from expensive cloud bills.",
    content: `
      <p>We all have an old laptop lying around collecting dust. Instead of letting that hardware go to waste, why not turn it into something incredibly useful? A dedicated home server can host your backend applications, run local automated workflows, or manage a self-hosted database completely for free—saving you from expensive cloud bills.</p>

      <p>In this article, I will take you through my exact journey of repurposing an old laptop into a Linux-powered server running <strong>Fedora</strong>, including the real-world terminal hurdles I faced and how you can do it too.</p>

      <hr>

      <h2>Why Use an Old Laptop as a Server?</h2>
      <p>Using an old laptop gives you two massive advantages over buying a dedicated mini-PC or a Raspberry Pi:</p>
      <ol>
        <li><strong>Built-in UPS:</strong> If the power goes out in your house, the laptop battery acts as an instant backup, keeping your server online.</li>
        <li><strong>Built-in Console:</strong> You have a built-in keyboard and screen ready to troubleshoot if your network connection drops.</li>
      </ol>

      <hr>

      <h2>Step 1: Setting Up the Operating System</h2>
      <p>To get the absolute maximum performance out of old hardware, you need a lightweight, stable Linux distribution. For this setup, <strong>Fedora</strong> is an exceptional choice—it is incredibly modern, secure, and developer-friendly.</p>
      <p>Once Fedora is installed, you can close the laptop lid (make sure to configure your system settings so closing the lid doesn't trigger sleep mode) and slide it into a corner. Your server is officially alive.</p>

      <hr>

      <h2>Step 2: Transferring Project Files via CLI</h2>
      <p>When setting up a server, you will frequently need to move files over from physical storage like a USB pen drive. Doing this entirely through the terminal can occasionally be tricky, but it gives you total control over the filesystem.</p>
      <p>Here is the exact workflow to mount a USB drive, move your project files, and safely disconnect the drive.</p>

      <h3>1. Identify the USB Drive</h3>
      <p>Plug in your USB drive and locate its device identifier using:</p>
      <pre><code class="language-bash">lsblk</code></pre>
      <p>Look for your drive size (e.g., <code>sdc</code>, <code>sdb</code>). The specific partition you want to mount will usually look like <code>/dev/sdc1</code>.</p>

      <h3>2. Prepare the Mount Point</h3>
      <p>Linux requires a folder (a "bridge") to read the USB. Create a directory inside your <code>/mnt</code> folder:</p>
      <pre><code class="language-bash">sudo mkdir -p /mnt/usb</code></pre>

      <h3>3. Mount the Drive</h3>
      <p>To connect the USB filesystem to your new bridge folder, execute:</p>
      <pre><code class="language-bash">sudo mount /dev/sdc1 /mnt/usb</code></pre>

      <blockquote>
        <strong>Real-World Troubleshooting Note:</strong> If the terminal gives you a warning hint regarding <code>systemd</code> or out-of-sync configuration files, do not panic. This happens when a drive isn't cleanly unmounted previously. You can force Fedora's background services to refresh by running:
        <pre><code class="language-bash">sudo systemctl daemon-reload</code></pre>
        After running the reload, execute the <code>mount</code> command again, and it will go through smoothly!
      </blockquote>

      <h3>4. Copy Your Code Folders</h3>
      <p>To view the contents of your USB drive, use <code>ls /mnt/usb</code>. Once you see your project folder (for example, a Node.js backend named <code>portfolio-server</code>), copy it permanently over to your server's home directory recursively:</p>
      <pre><code class="language-bash">cp -r /mnt/usb/portfolio-server ~/</code></pre>
      <p><em>(The <code>-r</code> flag ensures that every single file and subfolder inside your project copies over perfectly).</em></p>

      <h3>5. Safely Eject the Drive</h3>
      <p>Never just pull out a USB drive from a server! To avoid data corruption, step out of the folder and sever the connection cleanly using the <strong><code>umount</code></strong> command (notice there is no "n" in the middle of the command):</p>
      <pre><code class="language-bash">cd ~
      sudo umount /mnt/usb</code></pre>
      <p>Once the command executes cleanly without any errors, you can safely pull the pen drive out.</p>

      <hr>

      <h2>Step 3: Designing the Architecture (Decoupling)</h2>
      <p>Now that your backend code is on the laptop, how should your application be structured? The most professional and cost-effective approach is <strong>decoupling your frontend and backend</strong>.</p>
      <pre><code>[Static Frontend] --------&gt; Public Secure Tunnel --------&gt; [Fedora Laptop Server]
(Hosted on Netlify)            (e.g., Pinggy/zrok)            (Running Node/Express)</code></pre>
      <ul>
        <li><strong>The Frontend:</strong> Host your static portfolio UI completely for free on platforms like <strong>Netlify</strong> or <strong>Vercel</strong>. They offer global CDN speeds and free auto-renewing SSL (HTTPS) certificates out of the box.</li>
        <li><strong>The Backend:</strong> Run your persistent Node.js or Python backend server 24/7 on your old laptop.</li>
        <li><strong>The Bridge:</strong> Since your laptop sits safely behind your home router, you can expose your local port securely to the internet using tunneling utilities like <strong>Pinggy</strong>, <strong>Zrok</strong>, or <strong>LocalXpose</strong>. These tools give you a secure <code>https://</code> URL that you can simply plug into your Netlify environment variables as your API base path.</li>
      </ul>

      <hr>

      <h2>Step 4: The Ultimate Database Setup (Local Supabase via Docker)</h2>
      <p>If your projects require a database, you don't need to pay for cloud database clusters. You can self-host <strong>Supabase</strong> directly on your Fedora server using Docker. This gives you an enterprise-grade PostgreSQL database, user authentication, and a gorgeous web dashboard (Supabase Studio) accessible across your entire home network.</p>

      <h3>How to Initialize It:</h3>
      <p>1. <strong>Install Docker on Fedora:</strong></p>
      <pre><code class="language-bash">sudo dnf install docker-ce docker-compose-plugin
sudo systemctl enable --now docker</code></pre>

      <p>2. <strong>Launch the Official Supabase Stack:</strong></p>
      <pre><code class="language-bash">curl -fsSL https://supabase.link/setup.sh | sh
cd supabase-project
sh run.sh start</code></pre>

      <p>3. <strong>Open the Local Firewall:</strong> Fedora blocks inbound connections by default. Open the gateway port so your other devices can view the dashboard:</p>
      <pre><code class="language-bash">sudo firewall-cmd --zone=public --add-port=8000/tcp --permanent
sudo firewall-cmd --reload</code></pre>

      <p>Now, by finding your laptop’s local IP address (<code>ip route get 1.1.1.1</code>), you can type <code>http://&lt;your-laptop-ip&gt;:8000</code> into any phone or secondary computer on your Wi-Fi and manage your production data beautifully.</p>

      <hr>

      <h2>Final Thoughts</h2>
      <p>Repurposing an old laptop isn't just a great weekend project—it changes your entire development workflow. You gain a sandbox environment where you can deploy software, experiment with Docker containers, and test live apps without ever opening your wallet for cloud hosting platforms.</p>
      <p>Clean off that old keyboard, flash a Linux ISO, and start building your own local server infrastructure today!</p>
    `
  },
  {
    id: "webgpu-and-next-gen-graphics",
    title: "Why WebGPU is a Game Changer for Browser Applications",
    category: "Tech",
    date: "June 05, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    excerpt: "An in-depth look at how WebGPU is replacing WebGL to bring native-level GPU compute and rendering directly to the web browser.",
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
    id: "custom-hook-typescript-optimization",
    title: "Advanced TypeScript Types for Custom React Hooks",
    category: "Code",
    date: "May 28, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600&auto=format&fit=crop",
    excerpt: "Learn how to use conditional types, generics, and template literal types to build bulletproof custom hooks in TypeScript.",
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
    id: "building-beautiful-ui-from-scratch",
    title: "How to Build a Custom Glassmorphic Component Library",
    category: "Tutorials",
    date: "May 15, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    excerpt: "A step-by-step tutorial on crafting premium frosted-glass UI elements using custom properties, backdrop-filters, and modern layout systems.",
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
    id: "setting-up-domain-and-subdomain",
    title: "My New Digital Home: shivangcodes.in",
    category: "Personal",
    date: "June 16, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop",
    excerpt: "I recently purchased shivangcodes.in. Here is my plan for this domain, the blog subdomain, and the tech stack I am setting up.",
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

// Exporting so it works in both ES Modules (optional) and standard script tags
if (typeof module !== "undefined" && module.exports) {
  module.exports = BLOG_POSTS;
}
