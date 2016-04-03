var Riot = require('./riot');
var db = require('./database');


exports.getGameSummoner = function(query) {
	return new Promise(function(resolve, reject) {
		db.getPlayerId(query).then(function(summoner) {
			return summoner;
		})
		.then(function(summoner) {
			Riot.getCurrentGame(summoner[query].id).then(function(gamedata) {
				resolve(gamedata);
			})
			.catch(function(err) {
				reject('Summoner not In Game!');
			})	
		})
		.catch(function(err) {
			Riot.getSummonerID(query)
			.then(function(idObj) {
				return idObj;
			})
			.then(function(obj) {
				return Riot.getCurrentGame(obj[query].id);
			})
			.then(function(data) {
				resolve(data);
			})
			.catch(function(err) {
				reject('Summoner is not Currently in a Game or Summoner Name does not Exist!');
			})
		})
	})
}