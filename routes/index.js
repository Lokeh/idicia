var keystone = require('keystone'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function(req, res, next) {
  res.notfound();
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
  var title, message;
  if (err instanceof Error) {
    message = err.message;
    err = err.stack;
  }
  res.err(err, title, message);
});

// Load Routes
var routes = {
  views: importRoutes('./views'),
  api: importRoutes('./api'),
};

// Bind Routes
exports = module.exports = function(app) {
  // API Endpoints
  app.get(
    '/api/post/list',
    keystone.middleware.api,
    routes.api.posts.fullList
  );
  app.get(
    '/api/post/latestList',
    keystone.middleware.api,
    routes.api.posts.fullLatestList
  );
  app.get(
    '/api/post/paginated/:page?',
    keystone.middleware.api,
    routes.api.posts.paginatedList
  );
  app.get(
    '/api/post/id/:id',
    keystone.middleware.api,
    routes.api.posts.getId
  );
  app.get(
    '/api/post/slug/:slug',
    keystone.middleware.api,
    routes.api.posts.getSlug
  );

  // Generalized endpoint for site pages like /solutions, /verification, etc which are simply the
  // name of the schema containing the page data
  app.get(
    '/api/staticPages/:page',
    keystone.middleware.api,
    routes.api.staticPages.handler
  );

  app.get(
    '/api/sliders',
    keystone.middleware.api,
    routes.api.sliders.allSliders
  );

  // Serve the front-end SPA for non-API requests
  app.get('*', routes.views.index);
}
