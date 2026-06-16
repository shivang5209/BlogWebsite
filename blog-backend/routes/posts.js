const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure frontend uploads directory exists
const frontendUploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(frontendUploadsDir)) {
  fs.mkdirSync(frontendUploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'cover-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper: Calculate reading time
function calculateReadTime(content, contentType) {
  let text = content || '';
  if (contentType === 'richtext') {
    text = text.replace(/<[^>]*>/g, ' '); // Strip HTML tags
  } else {
    text = text.replace(/[#*`_\[\]()\-]/g, ' '); // Strip Markdown markdown characters
  }
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const wpm = 200; // Words per minute
  const minutes = Math.max(1, Math.round(words / wpm));
  return `${minutes} min read`;
}

// Helper: Format date to local reader-friendly style (e.g. "June 16, 2026")
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper: Generate URL slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores with single dash
    .replace(/^-+|-+$/g, '');  // Trim dashes from start/end
}

// Helper: Export posts cache to frontend root
function exportPostsCache() {
  try {
    // Get all posts that are published or scheduled but past their schedule time
    const query = `
      SELECT * FROM posts 
      WHERE status = 'published' 
         OR (status = 'scheduled' AND datetime(scheduled_at) <= datetime('now'))
      ORDER BY published_at DESC, created_at DESC
    `;
    const posts = db.prepare(query).all();

    const formattedPosts = posts.map(post => {
      let parsedTags = [];
      try {
        parsedTags = JSON.parse(post.tags || '[]');
      } catch (e) {
        parsedTags = (post.tags || '').split(',').map(t => t.trim()).filter(Boolean);
      }

      const dateStr = post.published_at || post.created_at;

      return {
        id: post.slug, // Maps slug to 'id' for public website backward compatibility
        title: post.title,
        category: post.category,
        date: formatDate(dateStr),
        readTime: post.read_time,
        image: post.cover_image,
        excerpt: post.excerpt,
        content: post.content,
        content_type: post.content_type,
        tags: parsedTags,
        status: post.status,
        published_at: post.published_at,
        created_at: post.created_at
      };
    });

    const cachePath = path.join(__dirname, '../../posts-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(formattedPosts, null, 2), 'utf8');
    console.log(`[Cache] Exported ${formattedPosts.length} published posts to posts-cache.json`);
  } catch (error) {
    console.error('[Cache] Failed to export posts cache:', error);
  }
}

// Run cache export on initialization to keep frontend synced
exportPostsCache();

/* PUBLIC ROUTES */

// 1. GET /api/posts - Get list of published posts
router.get('/posts', (req, res) => {
  try {
    const query = `
      SELECT * FROM posts 
      WHERE status = 'published' 
         OR (status = 'scheduled' AND datetime(scheduled_at) <= datetime('now'))
      ORDER BY published_at DESC, created_at DESC
    `;
    const posts = db.prepare(query).all();
    
    const formatted = posts.map(p => {
      let tags = [];
      try { tags = JSON.parse(p.tags || '[]'); } catch (e) {}
      
      const dateStr = p.published_at || p.created_at;

      return {
        id: p.slug,
        title: p.title,
        category: p.category,
        date: formatDate(dateStr),
        readTime: p.read_time,
        image: p.cover_image,
        excerpt: p.excerpt,
        content: p.content,
        content_type: p.content_type,
        tags,
        status: p.status,
        published_at: p.published_at,
        created_at: p.created_at
      };
    });
    
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/posts/:slug - Get single post by slug
router.get('/posts/:slug', (req, res) => {
  try {
    const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(req.params.slug);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    
    // Check if post is draft or scheduled for future
    if (post.status === 'draft') {
      return res.status(403).json({ error: 'This post is a draft and is not publicly visible.' });
    }
    if (post.status === 'scheduled' && new Date(post.scheduled_at) > new Date()) {
      return res.status(403).json({ error: 'This post is scheduled and is not yet visible.' });
    }
    
    let tags = [];
    try { tags = JSON.parse(post.tags || '[]'); } catch (e) {}
    
    const dateStr = post.published_at || post.created_at;

    res.json({
      id: post.slug,
      title: post.title,
      category: post.category,
      date: formatDate(dateStr),
      readTime: post.read_time,
      image: post.cover_image,
      excerpt: post.excerpt,
      content: post.content,
      content_type: post.content_type,
      tags,
      status: post.status,
      published_at: post.published_at,
      created_at: post.created_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ADMIN ROUTES (JWT required) */

// 3. GET /api/admin/posts - Get all posts (including drafts/scheduled)
router.get('/admin/posts', auth, (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    const formatted = posts.map(p => {
      let tags = [];
      try { tags = JSON.parse(p.tags || '[]'); } catch (e) {}
      return {
        ...p,
        tags
      };
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. POST /api/admin/posts - Create post
router.post('/admin/posts', auth, (req, res) => {
  const {
    title,
    slug,
    category,
    excerpt,
    cover_image,
    content,
    content_type, // 'richtext' or 'markdown'
    tags, // expected as array
    status, // 'draft', 'published', 'scheduled'
    scheduled_at,
    featured
  } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, Content, and Category are required.' });
  }

  const postSlug = (slug && slug.trim() !== '') ? generateSlug(slug) : generateSlug(title);
  const readTime = calculateReadTime(content, content_type || 'richtext');
  const tagsStr = JSON.stringify(tags || []);
  const isFeatured = featured ? 1 : 0;

  // Determine published_at
  let publishedAt = null;
  if (status === 'published') {
    publishedAt = new Date().toISOString();
  } else if (status === 'scheduled' && scheduled_at) {
    publishedAt = new Date(scheduled_at).toISOString();
  }

  try {
    const insert = db.prepare(`
      INSERT INTO posts (title, slug, category, excerpt, cover_image, content, content_type, tags, status, scheduled_at, featured, read_time, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      postSlug,
      category,
      excerpt || '',
      cover_image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600',
      content,
      content_type || 'richtext',
      tagsStr,
      status || 'draft',
      status === 'scheduled' ? scheduled_at : null,
      isFeatured,
      readTime,
      publishedAt
    );

    exportPostsCache(); // Refresh JSON fallback

    res.status(201).json({ id: result.lastInsertRowid, slug: postSlug, message: 'Post created successfully.' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: posts.slug')) {
      return res.status(400).json({ error: 'Slug already exists. Please choose a unique slug.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 5. PUT /api/admin/posts/:id - Update post
router.put('/admin/posts/:id', auth, (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    category,
    excerpt,
    cover_image,
    content,
    content_type,
    tags,
    status,
    scheduled_at,
    featured
  } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, Content, and Category are required.' });
  }

  const postSlug = (slug && slug.trim() !== '') ? generateSlug(slug) : generateSlug(title);
  const readTime = calculateReadTime(content, content_type || 'richtext');
  const tagsStr = JSON.stringify(tags || []);
  const isFeatured = featured ? 1 : 0;

  try {
    // Check if post exists
    const currentPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!currentPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Determine published_at logic
    let publishedAt = currentPost.published_at;
    if (status === 'published' && currentPost.status !== 'published') {
      publishedAt = new Date().toISOString();
    } else if (status === 'scheduled' && scheduled_at) {
      publishedAt = new Date(scheduled_at).toISOString();
    } else if (status === 'draft') {
      publishedAt = null;
    }

    const update = db.prepare(`
      UPDATE posts 
      SET title = ?, slug = ?, category = ?, excerpt = ?, cover_image = ?, content = ?, content_type = ?, 
          tags = ?, status = ?, scheduled_at = ?, featured = ?, read_time = ?, published_at = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    update.run(
      title,
      postSlug,
      category,
      excerpt || '',
      cover_image || currentPost.cover_image,
      content,
      content_type || 'richtext',
      tagsStr,
      status || 'draft',
      status === 'scheduled' ? scheduled_at : null,
      isFeatured,
      readTime,
      publishedAt,
      id
    );

    exportPostsCache(); // Refresh JSON fallback

    res.json({ message: 'Post updated successfully.' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: posts.slug')) {
      return res.status(400).json({ error: 'Slug already exists. Please choose a unique slug.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 6. DELETE /api/admin/posts/:id - Delete post
router.delete('/admin/posts/:id', auth, (req, res) => {
  const { id } = req.params;
  try {
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Optional: Delete associated cover image file if it is stored locally in uploads
    if (post.cover_image && post.cover_image.startsWith('/uploads/')) {
      const filename = post.cover_image.replace('/uploads/', '');
      const localFilePath = path.join(uploadsDir, filename);
      const frontendFilePath = path.join(frontendUploadsDir, filename);
      
      try {
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        if (fs.existsSync(frontendFilePath)) fs.unlinkSync(frontendFilePath);
      } catch (err) {
        console.error('Failed to clean up cover image file:', err);
      }
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    
    exportPostsCache(); // Refresh JSON fallback
    
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. POST /api/admin/upload - Handle image upload
router.post('/admin/upload', auth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    // Copy to frontend uploads directory for Netlify deployment
    try {
      const destPath = path.join(frontendUploadsDir, req.file.filename);
      fs.copyFileSync(req.file.path, destPath);
    } catch (copyErr) {
      console.error('[Upload] Failed to copy uploaded image to frontend uploads directory:', copyErr);
    }

    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  });
});

module.exports = {
  router,
  exportPostsCache
};
