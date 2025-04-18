// index.js
const { app } = require('./server');

// Attach all routes here
app.use('/api', require('./routes/components'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
