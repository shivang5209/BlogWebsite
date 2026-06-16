require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const { router: postsRoutes, exportPostsCache } = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup CORS
const allowedOrigins = [
  'https://blog.shivangcodes.in',
  'https://shivangcodes.in',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://localhost:8000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like server-to-server or tools like curl/Postman)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.netlify.app') || 
                      origin.endsWith('.shivangcodes.in');
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api', authRoutes);
app.use('/api', postsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Optional: Endpoint for triggering cron scheduling check or manual cache sync
app.post('/api/admin/sync-cache', require('./middleware/auth'), (req, res) => {
  try {
    exportPostsCache();
    res.json({ message: 'Static posts cache successfully generated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`  Shivang Codes Blog API Server Running`);
  console.log(`  Port:    ${PORT}`);
  console.log(`  Address: http://localhost:${PORT}`);
  console.log(`  Env:     ${process.env.NODE_ENV || 'development'}`);
  console.log(`=================================================`);
});
