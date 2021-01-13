'use strict';

var express = require('express'); 

module.exports = function userRouter() {
  return new express.Router()
  .get('/', getAParticularUser);

  function getAParticularUser(req, res, next) {
    res.send('Demo API Response');
  }
};

