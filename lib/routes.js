'use strict';

var api = require('./controllers/api'),
    signature = require('./controllers/signature'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // signature Routes
  app.route('/sig/:id')
    .get(signature.buildSig);

  // Server API Routes
  app.route('/api/usersearch/:id')
    .get(api.userSearch);
  app.route('/api/realmRanks')
    .get(api.realmRanks);
  app.route('/api/changeLog')
    .get(api.getChangeLog)
    .post(api.addChange);
  app.route('/api/contact')
    .post(api.contact);
  app.route('/api/characters/:id')
    .get(api.getCharacters);
  app.route('/api/search/:name/:cluster')
    .get(middleware.auth, api.searchCharacters);
  app.route('/api/add/:id/:charId')
    .post(middleware.auth, api.addCharacter);
  app.route('/api/characters/:id/:charId')
    .delete(middleware.auth, api.deleteCharacter);

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword)
    .get(users.retrievePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};