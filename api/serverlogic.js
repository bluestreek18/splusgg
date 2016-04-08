var Riot = require('./riot');
var db = require('./database');

exports.getStaticAll = function(array) {
	if(Array.isArray(array)) {
		array = array.split(',');
		var promiseArray = [];

		array.forEach(function(val, ind) {
			promiseArray.push(db.getOverallChampionStats(val));
		})

		return Promise.all(promiseArray);
	}
	else {
		return db.getOverallChampionStats(array);
	}

}


exports.getGameSummoner = function(query) {
	return new Promise(function(resolve, reject) {
		getSummonerID(query).then(function(data) {
			if(data === 404) {
				reject('Summoner ID not Found!');
				return;
			}

			return getGameCurrent(query, data);
		})
		.then(function(data) {
			resolve(data);
		})
		.catch(function(err) {
			if(err === 404) {
				reject(err);
				return;
			}

			console.log('Summoner Not in Game!');
			reject('Summoner Not in Game!');
		})
	})


}


var getSummonerID = function(query) {
	return new Promise(function(resolve, reject) {
		db.getPlayerId(query).then(function(summoner) {
			resolve(summoner);
		})
		.catch(function(err) {
			Riot.getSummonerID(query).then(function(data) {
				if(data.status) {
					reject(data.status.status_code);
					return;
				}

				resolve(data);
			})
			.catch(function(err) {
				reject('Unable to get Summoner ID', err);
			})
		})

	})
}
		

var getGameCurrent = function(query, summonerObj) {
	return new Promise(function(resolve, reject) {
		Riot.getCurrentGame(summonerObj[query].id).then(function(data) {
			resolve(data);
		})
		.catch(function(err) {
			reject(err);
		})
	})
}
