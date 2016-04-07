var req = require('request');
var Process = require('./processobj');
var Key = require('./key');
var db = require('./database');

//Move champgg calls here!

exports.updateChampionStaticData = function() {
	return new Promise(function(resolve, reject) {
		req.get('http://api.champion.gg/stats?api_key=' + Key.champggKey, 
			function(err, resp, body) {
				if(err || resp.statusCode === 404) {
						reject(err);
						return;
				}
				resolve(body);
			})
	})
}

exports.getChampionMatchupData = function(champname1, champname2) {
	return new Promise(function(resolve, reject) {
		console.log('NAMES === ', champname1, champname2)
		req.get('http://api.champion.gg/champion/' + champname1 + '/matchup/' + champname2 + '?api_key=' + Key.champggKey, 
			function(err, resp, body) {
				if(err || resp.statusCode === 404) {
					reject(err);
					return;
				}
				resolve(body);
			})
	})
}