const vm = require('vm');
const {getCollection } = require('../server');

const loadDynamicRoutes = async (app) => {
  try {
    const apiCollection = await getCollection('api');
    const apis = await apiCollection.find({}).toArray();

    for (const api of apis) {
      const { endPoint, type, code } = api;

      if (!endPoint || !type || !code) {
        console.warn('⚠️ Skipping invalid API entry:', api);
        continue;
      }

      const method = type.toLowerCase();
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        console.warn(`⚠️ Unsupported method "${type}" for "${endPoint}"`);
        continue;
      }

      const fullPath = '/api' + (endPoint.startsWith('/') ? endPoint : '/' + endPoint);

      const context = {
        module: {},
        require,
        getCollection: getCollection,
        console,
        process,
      };
      vm.createContext(context);

      try {
        vm.runInContext(code, context);
        const handler = context.module.exports;

        if (typeof handler !== 'function') {
          console.error(`❌ Handler for ${fullPath} is not a valid function.`);
          continue;
        }

        // Wrap to ensure it's a native async function
        app[method](fullPath, async (req, res, next) => {
          try {
            await handler(req, res, next);
          } catch (err) {
            console.error(`❌ Error in dynamic handler ${fullPath}:`, err);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
          }
        });

        console.log(`✅ Mounted [${method.toUpperCase()}] ${fullPath}`);
      } catch (err) {
        console.error(`❌ Failed to mount ${fullPath}:`, err.message);
      }
    }
  } catch (err) {
    console.error('❌ Failed to load dynamic routes:', err.message);
  }
};

module.exports = loadDynamicRoutes;
