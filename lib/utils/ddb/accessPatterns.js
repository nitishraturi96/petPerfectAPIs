'use strict';

var globals = require('../../globals');

var accessPatterns = {};

// options = {phoneNumber}
accessPatterns.userMeta = function(options) {
  return {
    collection: globals.collection.USER_PET_GRAPH,
    keys: { partitionKey: 'pk', sortKey: 'sk' },
    identifiers: {
      pk: options.phoneNumber,
      sk: 'META'
    }
  };
};

module.exports = accessPatterns;
