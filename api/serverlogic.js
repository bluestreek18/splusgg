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

var getSummonerID = function(query) {
	return new Promise(function(resolve, reject) {
		db.getPlayerId(query).then(function(summoner) {
			console.log('found sum name in db!')
			resolve(summoner);
		})
		.catch(function(err) {
			Riot.getSummonerID(query).then(function(data) {
				if(data.status) {
					reject(data.status.status_code);
					return;
				}
				console.log('summ id not in db found from api!')

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
			console.log('GCG err = ', err);
			reject('Summoner Not In Game!');
		})
	})
}

exports.getSummonerGame = function(sumName) {
	return getSummonerID(sumName).then(function(data) {
		return data;
	})
	.then(function(data) {
		// console.log('getting curre game = ', sumName, data)
		return getGameCurrent(sumName, data);
	})
	.catch(function(err) {
		// console.log('get current game err! = ', err)
		return err;
	})

}