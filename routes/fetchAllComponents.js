const express = require('express');
const router = express.Router();
const { getCollection } = require('../server');

router.get('/all-components', async (req, res) => {
  const componentsCollection = getCollection('components');

  try {
    const components = await componentsCollection.find({}).toArray();

    if (!components) {
      return res.status(404).json({ status: 'error', message: 'Component not found' });
    }

    res.json({
      status: 'ok',
      components: components,
    });
  } catch (err) {
    console.error('❌ Error fetching components:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;
