'use strict';

var express = require('express'); 

module.exports = function petRouter() {
  return new express.Router()
  .get('/', getAParticularPet);

  function getAParticularPet(req, res, next) {
    res.send('Tommy');
  }
};

