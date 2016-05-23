var Promise = require('bluebird');
var redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


exports.addStreamerRiotID = function(streamArray) {

}

exports.getStreamGameData = function(streamArray) {
  return Promise.all()
}