var Q = require('q');
var AWS  = require('aws-sdk');
var globals = require('./globals.js');

var _DynamoDB;

/**
 * Opt.collection: {String} - Name of dynamo table.
 * Opt.body: {JSON} - JSON data object for the entity
 * Opt.identifiers: {Object} {key: value, key: value}
 * Opt.bCreateIfNotExists Boolean
 */
function __createEntity(options) {
  var deferred = Q.defer();

  var params = _getCreateOperationOptions(options);
  var startTime = Date.now();

  _DynamoDB.put(params, function(err, data) {
    console.log('Response from createEntity DYNAMO (' + options.collection  + ') received',
      '.responseTime=' + (Date.now() - startTime) + 'ms. ', JSON.stringify(options.identifiers));

    if(err) { deferred.reject(err); }
    else { deferred.resolve(data.Items); }
  });

  return deferred.promise;
}

/**
 * Opt.collection: {String} - Name of dynamo table.
 * Opt.body: {JSON} - JSON data object for the entity
 * Opt.identifiers: {Object} {key: value, key: value}
 * Opt.bCreateIfNotExists Boolean
 */
function _getCreateOperationOptions(options) {
  // Add bydefault fields in body
  if(options.body) {
    options.body.modified = Date.now();
    options.body.version = 1;
  }
  var params = {
    TableName: options.collection,
    Item: options.body
  };

  if(options.bCreateIfNotExists && options.identifiers) {
    var formattedCondition = _createDynamoDbConditionExpression(options.identifiers);
    Object.assign(params, formattedCondition);
  }

  return params;
}

function _createDynamoDbConditionExpression(identifiers) {

  var ExpressionAttributeNames = {};
  var ExpressionAttributeValues = {};
  var ConditionExpression = [];

  var count = 1;

  for(var idx in identifiers) {
    ExpressionAttributeNames['#k' + count] = idx;
    ExpressionAttributeValues[':v' + count] = identifiers[idx];
    ConditionExpression.push(' NOT #k' + count + ' = :v' + count);
    count++;
  }
  ConditionExpression = ConditionExpression.join(' AND ');

  var conditionExpressionObj = {
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
    ConditionExpression: ConditionExpression
  };

  return conditionExpressionObj;
}

module.exports = {
  createEntity: __createEntity
};