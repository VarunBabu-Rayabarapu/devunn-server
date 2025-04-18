const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body);
    res.json({ status: 'ok', uptime: process.uptime() });
});

module.exports = router;
