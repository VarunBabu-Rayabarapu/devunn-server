const express = require('express');
const router = express.Router();
const { getCollection } = require('../server');

router.get('/component/:url', async (req, res) => {
  const componentsCollection = getCollection('components');
  const urlParam = req.params.url;

  try {
    const component = await componentsCollection.findOne({ url: urlParam });

    if (!component || !component.code) {
      return res.status(404).json({ status: 'error', message: 'Component not found' });
    }

    res.json({
      status: 'ok',
      code: component.code,
    });
  } catch (err) {
    console.error('❌ Error fetching component:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;
