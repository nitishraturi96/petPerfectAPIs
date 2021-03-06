'use strict';

var express = require('express');

// ROUTE HANDLERS
var pet = require('./api/routes/pet');
var user = require('./api/routes/user');

// WEB CONSTRUCTOR
module.exports = function Web(app) {
  var web = express();

  createAndStartServer(web);

  // Map the Common Path to Route Handlers
  web
  .use('/pet', pet())
  .use('/user', user());

  return web;
};

function createAndStartServer(webApp) {
  var port = process.env.port || 5000;
  webApp.listen(port, () => console.log("Listening on Port: " + port + "...") );
}
