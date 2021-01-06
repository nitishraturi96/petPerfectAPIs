'use strict';

var Q = require('q');
var express = require('express');
var tfa = require('2factor');;

module.exports = function userRouter() {
  return new express.Router()
  .post('/send-code/:phoneNumber', sendVerificationCodeToAUser)
  .post('/verify-code', verifyVerificationCodeOfAUser);

  function sendVerificationCodeToAUser(req, res, next) {
    var twoFactor = new (tfa)(process.env.TFA_API_KEY);
    //Generating 4 digit OTP code
    var code = Math.floor(1000 + Math.random() * 9000);

    sendCode(twoFactor, req.params.phoneNumber, code)
    .then(function (sessionId) { res.send ( { sessionId, code }); })
    .catch(function(err) { next(err); }).done();
  }

  function verifyVerificationCodeOfAUser(req, res, next) {
    var twoFactor = new (tfa)(process.env.TFA_API_KEY);

    verifyVerificationCode(twoFactor, req.query.sessionId, req.query.code)
    .then(function (result) { res.send(result); })
    .catch(function(err) { next(err); }).done();
  }
};

function sendCode(twoFactor, number, code) {
  var deferred = Q.defer();

  var otpOptions = {
    otp: code,
    template: "Credibl code verification", // To be updated
  };

  twoFactor.sendOTP(number, otpOptions)
  .then(function (result) { deferred.resolve(result); })
  .catch(function (err) { deferred.reject(err);
  })
  return deferred.promise;
}

function verifyVerificationCode(twoFactor, sessionId, code) {
  var deferred = Q.defer();

  twoFactor.verifyOTP(sessionId, code)
  .then(function (result) { deferred.resolve(result); })
  .catch(function (err) { deferred.reject(err);
  })
  return deferred.promise;
}

