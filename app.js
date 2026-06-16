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
  const authorName = post.authorName || 'Shivang Codes';
  const authorPhoto = post.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=8b5cf6&color=fff`;

  return `
    <article class="article-card">
      <div class="article-image" style="background-image: url('${post.image}')">
        <span class="article-category">${post.category}</span>
      </div>
      <div class="article-content" style="display: flex; flex-direction: column; justify-content: space-between; height: calc(100% - 200px);">
        <div>
          <div class="article-meta">
            <span>${post.date}</span>
            <span>&bull;</span>
            <span>${post.readTime}</span>
          </div>
          <h3 class="article-title"><a href="post.html?id=${post.id}">${post.title}</a></h3>
          <p class="article-excerpt">${post.excerpt}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${authorPhoto}" alt="${authorName}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--accent-purple);">
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">By ${authorName}</span>
          </div>
          <a href="post.html?id=${post.id}" class="article-readmore" style="margin-top: 0;">Read &rarr;</a>
        </div>
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

// Data Fetching: Load all published blog posts directly from Firebase Firestore
async function getBlogPosts() {
  try {
    if (!window.db) {
      throw new Error("Firebase database SDK is not initialized.");
    }
    
    // Query published posts
    const snapshot = await window.db.collection('posts')
      .where('status', '==', 'published')
      .get();

    const posts = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Format date to local reader-friendly style (e.g. "June 16, 2026")
      let formattedDate = 'Recent';
      const dateTimestamp = data.published_at || data.created_at;
      if (dateTimestamp) {
        const date = dateTimestamp.toDate ? dateTimestamp.toDate() : new Date(dateTimestamp);
        formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }

      posts.push({
        id: data.slug, // maps slug to 'id' for public website backward compatibility
        docId: doc.id,
        title: data.title,
        category: data.category,
        date: formattedDate,
        readTime: data.read_time,
        image: data.cover_image,
        excerpt: data.excerpt,
        content: data.content,
        content_type: data.content_type,
        tags: data.tags || [],
        authorName: data.authorName || 'Anonymous',
        authorPhoto: data.authorPhoto || '',
        published_at: data.published_at ? data.published_at.toDate() : (data.created_at ? data.created_at.toDate() : null)
      });
    });

    // Sort posts by published date descending
    posts.sort((a, b) => {
      const timeA = a.published_at ? a.published_at.getTime() : 0;
      const timeB = b.published_at ? b.published_at.getTime() : 0;
      return timeB - timeA;
    });

    console.log(`[Firebase Data Layer] Successfully loaded ${posts.length} articles.`);
    return posts;
  } catch (err) {
    console.error('[Firebase Data Layer] Failed to fetch articles:', err);
    // Fall back to local posts.js array if Firestore query fails (e.g. initial load before config)
    if (typeof BLOG_POSTS !== 'undefined') {
      console.warn('[Firebase Data Layer] Falling back to static posts.js failsafe array.');
      return BLOG_POSTS;
    }
    return [];
  }
}

// Data Fetching: Load a single published blog post by slug from Firebase Firestore
async function getSinglePost(slug) {
  try {
    if (!window.db) {
      throw new Error("Firebase database SDK is not initialized.");
    }

    const snapshot = await window.db.collection('posts')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.warn(`[Firebase Data Layer] Post "${slug}" not found in Firestore.`);
      // Scan failsafe static array
      if (typeof BLOG_POSTS !== 'undefined') {
        return BLOG_POSTS.find(p => p.id === slug || p.slug === slug);
      }
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();

    let formattedDate = 'Recent';
    const dateTimestamp = data.published_at || data.created_at;
    if (dateTimestamp) {
      const date = dateTimestamp.toDate ? dateTimestamp.toDate() : new Date(dateTimestamp);
      formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    return {
      id: data.slug,
      docId: doc.id,
      title: data.title,
      category: data.category,
      date: formattedDate,
      readTime: data.read_time,
      image: data.cover_image,
      excerpt: data.excerpt,
      content: data.content,
      content_type: data.content_type,
      tags: data.tags || [],
      authorName: data.authorName || 'Anonymous',
      authorPhoto: data.authorPhoto || '',
      published_at: data.published_at ? data.published_at.toDate() : (data.created_at ? data.created_at.toDate() : null)
    };
  } catch (err) {
    console.error(`[Firebase Data Layer] Failed to fetch post "${slug}":`, err);
    // Scan local failsafe array
    if (typeof BLOG_POSTS !== 'undefined') {
      return BLOG_POSTS.find(p => p.id === slug || p.slug === slug);
    }
    return null;
  }
}

// Expose functions globally
window.getBlogPosts = getBlogPosts;
window.getSinglePost = getSinglePost;
