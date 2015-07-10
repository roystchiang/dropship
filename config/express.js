'use strict';

var express = require('express'),
  jade = require('jade'),
	config = require('./config'),
  path = require('path'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cookieParser = require('cookie-parser');

module.exports = function() {
  // Initialize Express
  var app = express();

  // Set up Globbing model
  config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

  // Set up application local variables
	app.locals.jsFiles = config.getJavaScriptAssets();
  app.locals.cssFiles = config.getCSSAssets();

  // set jade as default engine
  app.set('view engine', 'jade');
  app.set('views', './app/views');

  // set bodyParser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // set cookieParser
  app.use(cookieParser());

  // Setting the app router and static folder
  app.use('/public', express.static(path.resolve('./public')));

  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  return app;
};
