// API URL configuration for shivangcodes.in
// Automatically switches between localhost for development and the Cloudflare domain for production

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : 'https://api.shivangcodes.in';

window.API_BASE = API_BASE;
