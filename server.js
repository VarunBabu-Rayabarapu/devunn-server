// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup MongoDB client
const client = new MongoClient(process.env.MONGO_URI);
let db;

// Connect once and reuse the connection
async function connectToMongo() {
    try {
        await client.connect();
        db = client.db('devunn'); // defaults to DB from URI
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
}

// Call the connection function
connectToMongo();

function getDb() {
    return db;
}

// Export app and a way to get collection
function getCollection(name) {
    return db.collection(name);
}

module.exports = { app, getCollection, getDb, connectToMongo };
