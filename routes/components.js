const express = require('express');
const router = express.Router();
const { getCollection } = require('../server');
const generateComponentFromDescription = require('./AI');


router.post('/submit/:password', async (req, res) => {
  const componentsCollection = getCollection('components');
  const password = req.params.password;

  if (password !== process.env.MASTER_PASSWORD) {
    return res.status(403).json({ status: 'error', message: 'Invalid password' });
  }

  const { url, code, description } = req.body;

  try {
    let finalCode = code;

    if (!code && description) {
      finalCode = await generateComponentFromDescription(description);
    }

    if (!finalCode) {
      return res.status(400).json({ status: 'error', message: 'No code or description provided' });
    }

    const result = await componentsCollection.insertOne({
      url,
      code: finalCode,
      createdAt: new Date(),
    });

    res.json({ status: 'ok', insertedId: result.insertedId });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ status: 'error', message: 'Insert failed' });
  }
});

module.exports = router;
