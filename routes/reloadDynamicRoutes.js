// routes/reloadDynamicRoutes.js
const express = require('express');
const router = express.Router();
const loadDynamicRoutes = require('./dynamicRoutesLoader');

router.post('/reload/:password', async (req, res) => {
    const password = req.params.password;
  
    if (password !== process.env.MASTER_PASSWORD) {
      return res.status(403).json({ status: 'error', message: 'Invalid password' });
    }
  
    try {
      await loadDynamicRoutes(req.app); // ✅ This is how you pass the Express app instance
      res.json({ status: 'ok', message: 'Dynamic routes reloaded' });
    } catch (err) {
      console.error('❌ Reload failed:', err?.stack || err?.message || err);
      res.status(500).json({ status: 'error', message: 'Reload failed' });
    }
  });
  
module.exports = router;
