var ExpressBrute = require('express-brute');
var MongoStore = require('express-brute-mongo');
var MongoClient = require('mongodb').MongoClient;

var store = new MongoStore(function (ready) {
  MongoClient.connect('mongodb://127.0.0.1:27017/splusgg', function(err, db) {
    if (err) throw err;
    ready(db.collection('bruteforce-store'));
    db.collection('bruteforce-store').ensureIndex({expires: 1}, {expireAfterSeconds: 0});  //may need to remove ips etc.
    console.log('bruteforce store ready');
  });
});

var handleStoreError = function(error) {
  console.log(error);
}

var globalb = new ExpressBrute(store, {
  freeRetries: 10,
  proxyDepth: 1,  //is this needed
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 10*1000, 	// 1 day 1 hour (should never reach this wait time)
  maxWait: 10*1000, 	// 1 day 1 hour (should never reach this wait time)
  lifetime: 10, 			// 1 day (seconds not milliseconds) //time to remember an ip
  failCallback: ExpressBrute.FailForbidden,
  handleStoreError: handleStoreError
});

module.exports = globalb.getMiddleware({
  key: function(req, res, next) {
  	console.log('using globalb middleware!');
  	var ip = globalb.getIPFromRequest(req);
  	console.log('ip = ', ip);
    next();
  },
  ignoreIP: true
})





