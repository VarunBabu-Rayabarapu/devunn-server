// index.js
const { app, getCollection, connectToMongo } = require('./server');
const loadDynamicRoutes = require('./routes/dynamicRoutesLoader');

// Attach predefined routes
app.use('/api', require('./routes/components'));
app.use('/api', require('./routes/fetchComponent'));
app.use('/api', require('./routes/fetchAllComponents'));
app.use('/api', require('./routes/deleteComponent'));
app.use('/api', require('./routes/reloadDynamicRoutes'));

// Start everything inside an async IIFE
(async () => {
  try {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
    await connectToMongo();
    await loadDynamicRoutes(app, getCollection);
  } catch (err) {
    console.error('❌ Failed to load dynamic routes:', err);
    process.exit(1);
  }
})();
