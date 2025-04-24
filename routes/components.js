const express = require('express');
const router = express.Router();
const { getCollection } = require('../server');
const generateComponentFromDescription = require('./AI');
const generateApiRoute = require('./AIBackend');

router.post('/submit/:password', async (req, res) => {
  const componentsCollection = getCollection('components');
  const password = req.params.password;

  if (password !== process.env.MASTER_PASSWORD) {
    return res.status(403).json({ status: 'error', message: 'Invalid password' });
  }

  const { url, code, description } = req.body;

  try {
    let finalCode = code;
    let apiDefinitions = [];

    if (!code && description) {
      const generated = await generateComponentFromDescription(description);
      finalCode = generated.code;
      apiDefinitions = generated.api || [];
    }

    if (!finalCode) {
      return res.status(400).json({ status: 'error', message: 'No code or description provided' });
    }

    // Insert component code
    const result = await componentsCollection.insertOne({
      url,
      code: finalCode,
      createdAt: new Date(),
    });

    // Process and insert each API definition
    if (apiDefinitions.length > 0) {
      const apiCollection = getCollection('api');
      for (const [endPoint, type, apiDescription] of apiDefinitions) {
        try {
          const generatedApi = await generateApiRoute(endPoint, type, apiDescription);

          await apiCollection.insertOne({
            endPoint: generatedApi.endPoint,
            type: generatedApi.type,
            code: generatedApi.code,
            createdAt: new Date(),
          });
        } catch (apiErr) {
          console.error(`Failed to generate or insert API for ${endPoint}:`, apiErr);
        }
      }
    }

    res.json({ status: 'ok', insertedId: result.insertedId });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ status: 'error', message: 'Insert failed' });
  }
});

module.exports = router;
