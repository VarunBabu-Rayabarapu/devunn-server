const express = require('express');
const router = express.Router();
const { getCollection, getDb } = require('../server');

router.post('/submit/:password', async (req, res) => {
    const password = req.params.password;
    if (password !== process.env.MASTER_PASSWORD) {
        return res.status(403).json({ status: 'error', message: 'Invalid password' });
    }

    try {
        const db = getDb();
        const collectionName = 'components';

        const existingCollections = await db.listCollections({ name: collectionName }).toArray();
        if (existingCollections.length === 0) {
            await db.createCollection(collectionName);
            console.log(`✅ Collection '${collectionName}' created`);
        }

        const componentsCollection = getCollection(collectionName);
        const result = await componentsCollection.insertOne(req.body);

        res.json({
            status: 'ok',
            insertedId: result.insertedId,
            uptime: process.uptime(),
            message: 'successful',
        });
    } catch (err) {
        console.error('❌ Error inserting into components:', err);
        res.status(500).json({ status: 'error', message: 'Insert failed' });
    }
});

module.exports = router;
