var TCS = process.env.tClientSecret;
var TCID = process.env.tClientID;
var kraken = 'https://api.twitch.tv/kraken';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
Promise.promisifyAll(request);

var createOpts = function(url) {
  var opt = {
    url: url,
    headers: {
      'Client-ID': process.env.tClientID,
      'Accept': 'application/vnd.twitchtv.v3+json'
    }
  };

  return opt;
}

var liveStreams = '?game=League%20of%20Legends&stream_type=live';
var liveSummary = '/summary?game=League%20of%20Legends'

exports.getStreams = function() {
  return request(createOpts(`${kraken}/streams${liveStreams}`))
    .then(function(data) {
      console.log('data: ', JSON.parse(data[0].body).streams[0])
    })
    .catch(function(err) {
      console.log('twitchtv err: ', err)
    })
}

exports.getSummary = function() {
  return request(createOpts(`${kraken}/streams${liveSummary}`))
    .then(function(data) {
      console.log('data: ', data[0].body)
    })
    .catch(function(err) {
      console.log('twitchtv err: ', err)
    })
}

exports.getStreams();
//exports.getSummary();

