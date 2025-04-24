const express = require('express');
const router = express.Router();
const { getCollection } = require('../server');

router.delete('/delete-component/:password', async (req, res) => {
  const componentsCollection = getCollection('components');
  const password = req.params.password;
  const {url} = req.body;

  if (password !== process.env.MASTER_PASSWORD) {
    return res.status(403).json({ status: 'error', message: 'Invalid password' });
  }

  try {
    const components = await componentsCollection.deleteOne({url: url});

    if (!components) {
      return res.status(404).json({ status: 'error', message: 'Failed to delete' });
    }

    res.json({
      status: 'ok'
    });
  } catch (err) {
    console.error('❌ Error deleting component:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;
