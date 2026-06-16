// Shared Application Script

// Utility: Format Category to URL Parameter
function categoryToUrl(cat) {
  return cat.toLowerCase();
}

// Utility: Capitalize String
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper: Get categories config (name, icon, number, description, design class)
const CATEGORY_META = {
  research: { name: "Research", icon: "🔬", desc: "Ideas, papers, hypotheses, and theories.", class: "card-light", num: "01" },
  projects: { name: "Projects", icon: "🚀", desc: "Showcases, build updates, and active repositories.", class: "card-dark", num: "02" },
  tech: { name: "Tech", icon: "🌐", desc: "Thoughts, industry insights, and architectural deep-dives.", class: "card-gradient", num: "03" },
  code: { name: "Code", icon: "💻", desc: "Snippets, optimizations, algorithms, and syntax tricks.", class: "card-dark", num: "04" },
  tutorials: { name: "Tutorials", icon: "📖", desc: "Step-by-step programming and development walkthroughs.", class: "card-light", num: "05" },
  personal: { name: "Personal", icon: "☕", desc: "Reflections, milestones, and personal journals.", class: "card-dark", num: "06" }
};

// Render Common Header
function renderHeader() {
  const currentPath = window.location.pathname;
  const isIndexActive = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');
  const isBlogActive = currentPath.includes('blog.html') || currentPath.includes('post.html');
  const isAboutActive = currentPath.includes('about.html');

  const headerHTML = `
    <div class="nav-container">
      <a href="index.html" class="logo">
        <div class="logo-icon">S</div>
        shivangcodes.in
      </a>
      <ul class="nav-links">
        <li><a href="index.html" class="${isIndexActive ? 'active' : ''}">Home</a></li>
        <li><a href="blog.html" class="${isBlogActive ? 'active' : ''}">Blog</a></li>
        <li><a href="about.html" class="${isAboutActive ? 'active' : ''}">About</a></li>
        <li><a href="about.html#contact" class="btn-contact">Get In Touch &rarr;</a></li>
      </ul>
    </div>
  `;
  
  const headerElem = document.createElement('header');
  headerElem.innerHTML = headerHTML;
  document.body.prepend(headerElem);
}

// Render Common Footer
function renderFooter() {
  const footerHTML = `
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} shivangcodes.in. Built with absolute speed & simplicity.</p>
      <div style="margin-top: 1rem; display: flex; justify-content: center; gap: 1.5rem;">
        <a href="index.html">Home</a>
        <a href="blog.html">Blog</a>
        <a href="about.html">About</a>
      </div>
    </div>
  `;
  const footerElem = document.createElement('footer');
  footerElem.innerHTML = footerHTML;
  document.body.appendChild(footerElem);
}

// Build Article HTML string
function buildArticleCard(post) {
  return `
    <article class="article-card">
      <div class="article-image" style="background-image: url('${post.image}')">
        <span class="article-category">${post.category}</span>
      </div>
      <div class="article-content">
        <div class="article-meta">
          <span>${post.date}</span>
          <span>&bull;</span>
          <span>${post.readTime}</span>
        </div>
        <h3 class="article-title"><a href="post.html?id=${post.id}">${post.title}</a></h3>
        <p class="article-excerpt">${post.excerpt}</p>
        <a href="post.html?id=${post.id}" class="article-readmore">Read Article &rarr;</a>
      </div>
    </article>
  `;
}

// Setup Reading Progress Bar
function setupReadingProgress() {
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-bar-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressContainer.appendChild(progressBar);
  document.body.prepend(progressContainer);

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const percentage = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = percentage + '%';
    }
  });
}

// Setup Share Buttons (Static simulation)
function setupShareActions() {
  const shareButtons = document.querySelectorAll('.btn-share');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.getAttribute('title');
      const currentUrl = window.location.href;
      const title = document.title;
      
      if (action.toLowerCase().includes('twitter') || action.toLowerCase().includes('x')) {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`, '_blank');
      } else if (action.toLowerCase().includes('linkedin')) {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
      } else if (action.toLowerCase().includes('copy')) {
        navigator.clipboard.writeText(currentUrl).then(() => {
          alert("Link copied to clipboard!");
        });
      }
    });
  });
}

// Setup Static Newsletter
function setupNewsletter() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value;
      if (email) {
        alert(`Awesome! You have subscribed with ${email}. Updates will be sent when new articles drop.`);
        newsletterForm.reset();
      }
    });
  }
}

// Initialize Page Shared Features
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  
  // Wait a fraction of a second before setting up footers to ensure page content loads
  setTimeout(() => {
    renderFooter();
  }, 50);
});

// Data Fetching: Load all published blog posts with live API and offline cache fallbacks
async function getBlogPosts() {
  // 1. Try fetching from live Fedora API backend first
  if (window.API_BASE) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for quick fallback
      
      const res = await fetch(`${window.API_BASE}/api/posts`, { signal: controller.signal });
      clearTimeout(id);
      
      if (res.ok) {
        const posts = await res.json();
        console.log('[Data Layer] Successfully loaded posts from live API.');
        return posts;
      }
    } catch (err) {
      console.warn('[Data Layer] Live API is unreachable. Falling back to cache. Error:', err.message);
    }
  }

  // 2. Try loading from Netlify's static posts-cache.json next
  try {
    const res = await fetch('posts-cache.json');
    if (res.ok) {
      const posts = await res.json();
      console.log('[Data Layer] Successfully loaded posts from static posts-cache.json.');
      return posts;
    }
  } catch (err) {
    console.warn('[Data Layer] posts-cache.json is not available. Falling back to local posts.js. Error:', err.message);
  }

  // 3. Fall back to hardcoded posts in posts.js (if available)
  if (typeof BLOG_POSTS !== 'undefined') {
    console.log('[Data Layer] Successfully loaded posts from local posts.js array.');
    return BLOG_POSTS;
  }

  return [];
}

// Data Fetching: Load a single published blog post by slug with live API and offline cache fallbacks
async function getSinglePost(slug) {
  // 1. Try fetching from live Fedora API backend first
  if (window.API_BASE) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3500); // 3.5s timeout
      
      const res = await fetch(`${window.API_BASE}/api/posts/${slug}`, { signal: controller.signal });
      clearTimeout(id);
      
      if (res.ok) {
        const post = await res.json();
        console.log(`[Data Layer] Successfully loaded post "${slug}" from live API.`);
        return post;
      }
    } catch (err) {
      console.warn(`[Data Layer] Live API is unreachable for single post "${slug}". Falling back to cache. Error:`, err.message);
    }
  }

  // 2. Scan locally loaded cache/posts array
  console.log(`[Data Layer] Scanning cache/fallback array for post "${slug}".`);
  const allPosts = await getBlogPosts();
  return allPosts.find(p => p.id === slug || p.slug === slug);
}

// Expose functions globally
window.getBlogPosts = getBlogPosts;
window.getSinglePost = getSinglePost;
