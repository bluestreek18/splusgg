var req = require('request');
var Process = require('./processobj');
var Key = require('./key');
var db = require('./database');

//Summoner v1.4
exports.getSummonerID = function(name) {
	return new Promise(function(resolve, reject) {
		req.get('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + name + Key.apiKey, 
			function(err, resp, body) {
				if(err) {
					reject(err);
					return;
				}

				var resultBody = JSON.parse(body);
				db.insertPlayerIdObj(resultBody).then(function(data) {
					resolve(resultBody, resp);
				})
				.catch(function(err) {
					resolve(resultBody, resp);
				});
			})
	})
}

//Current Game v1.0
//Do not cache any of this. Waste of time!
exports.getCurrentGame = function(id) {
	return new Promise(function(resolve, reject) {
		req.get('https://na.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/' + id + Key.apiKey, 
			function(err, resp, body) {
				if(err || resp.statusCode !== 200) {
					reject(resp.statusCode);
					return;
				}

				var result = JSON.parse(body);
				console.log(result)
				if(result.bannedChampions.length === 0) {
					reject('Not A Ranked Game!');
				}
				
				Process.addImageData(result);
				Process.sortParticipantsByRole(result.participants).then(function(data) {
					result.participants = data;
					resolve(result, resp);
				})
				
			})
	})
}

//Matchlist v2.2
exports.getMatchSummaryRanked = function(id) {
	return new Promise(function(resolve, reject) {
		req.get('https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/' + id + '?rankedQueues=RANKED_SOLO_5x5&seasons=SEASON2016&' + Key.apiKey, 
			function(err, resp, body) {
				if(err) {
					reject(err);
					return;
				}
				resolve(body, resp);
			})
	})
}

//Game v1.3
exports.getRecentGames = function(id) {
	return new Promise(function(resolve, reject) {
		req.get('https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/' + id + '/recent' + Key.apiKey, 
			function(err, resp, body) {
				if(err) {
					reject(err);
					return;
				}
				resolve(body, resp);
			})
	})
}

//Match v2.2
exports.getMatchById = function(matchId) {
	return new Promise(function(resolve, reject) {
		req.get('https://na.api.pvp.net/api/lol/na/v2.2/match/' + matchId + Key.apiKey, 
			function(err, resp, body) {
				if(err) {
					reject(err);
					return;
				}
				resolve(body, resp);
			})
	})
}

exports.getSummonerChampionStats = function(summid, champid) {
	return new Promise(function(resolve, reject) {
		db.getPlayerChampStats(summid, champid).then(function(resultdata) {
			console.log('found existing stats for player!');
			resolve(resultdata);
		})
		.catch(function() {
			req.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + summid + '/ranked?season=SEASON2016&' + Key.apiKey.slice(1),
				function(err, resp, body) {
					// console.log('response body', body)
					if(err || resp.status_code === 404) {
						console.log('Summoner stats lookup FAILED!!!!')
						reject(err);
						return;
					}

					Process.processSummonerChampionData(JSON.parse(body), champid).then(function(ret) {
						resolve(ret);
					})
					.catch(function(err) {
						reject(err);
					})
				})
		})
	})
}

//League Data v2.5 / No need for caching, one call per game
exports.getSummonerLeagueData = function(summonerIds) {
	return new Promise(function(resolve, reject) {
		req.get('https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + summonerIds + '/entry' + Key.apiKey,
			function(err, resp, body) {
				console.log('get league data code: === ', resp.statusCode)
				if(err || resp.statusCode === 404) {
						reject(err);
						return;
				}
				resolve(body);
			})
	})
}

exports.getDDVersion = function() {
	return new Promise(function(resolve, reject) {
		req.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/versions' + Key.apiKey,
			function(err, resp, body) {
				if(err || resp.statusCode === 404) {
					reject(err);
					return;
				}

				resolve(body.split('"').slice(1, 2));
		});
	})
}





