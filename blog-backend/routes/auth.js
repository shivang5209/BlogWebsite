const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shivangcodes.in';
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!adminHash) {
    // Provide a helper message in development if they haven't configured their password hash
    console.warn('\n[WARNING] ADMIN_PASSWORD_HASH is not set in the .env file!');
    console.warn(`To create a password hash for password "${password}", use this hash in your .env file:`);
    console.warn(`ADMIN_PASSWORD_HASH="${bcrypt.hashSync(password, 10)}"\n`);
    
    return res.status(500).json({ 
      error: 'Server authentication is not configured. Check the server console log for instructions on generating your ADMIN_PASSWORD_HASH.' 
    });
  }

  if (email.toLowerCase().trim() === adminEmail.toLowerCase().trim() && bcrypt.compareSync(password, adminHash)) {
    // Sign JWT
    const token = jwt.sign(
      { email, isAdmin: true },
      process.env.JWT_SECRET || 'fallback_secret_for_local_dev',
      { expiresIn: '7d' } // Session remains active for 7 days
    );
    return res.json({ token, email });
  }

  return res.status(401).json({ error: 'Invalid credentials.' });
});

router.post('/logout', (req, res) => {
  // JWT authentication is stateless. The client-side simply discards the token.
  res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
