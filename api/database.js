var db = require('mongodb').Db;
var Moment = require('../node_modules/moment/moment');
var timeNow = Moment();
var Riot = require('./riot');
var ChampGG = require('./championgg');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = require('mongodb').MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/splusgg';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
  	db.createCollection('currentgames');
  	db.createCollection('playerids');
  	db.createCollection('winrates');
  	db.createCollection('playerchampionstats');
  	db.createCollection('championstaticwinratedata');

    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);
	}

		//GET DATA
	exports.getPlayerId = function(name) {
		return new Promise(function(resolve, reject) {
			var finder = {};
			finder[name] = { $exists: true };
			db.collection('playerids').findOne(finder, function(err, data) {
				if ( ! data || data.length === 0) {
					reject(data);
					return;
				}

				resolve(data);
			})
		})
	}

	exports.getPlayerChampStats = function(summonerId, champId) {
		return new Promise(function(resolve, reject) {
			var finder0 = {summonerId: Number(summonerId)};
			var finder1 = {champions: {$elemMatch: {id: Number(champId)}}};

			db.collection('playerchampionstats').findOne(finder0, finder1, function(error, data) {
				
				if ( ! data || data.length === 0) {
					reject(error);
					return;
				}
				else if(timeNow.diff(data.modifyDate, 'days') > 3) {
					db.collection('playerchampionstats').deleteOne({summonerId: summonerId}, function(err, results) {
						reject(results);
					})
					return;
				}

				if(data.champions) {
					resolve(data.champions[0]);
				}
				else {
					reject(data);
					return;
				}
			})
		})
	}

	//INSERT DATA
	exports.insertCurrentMatch = function(apidata) {
		return new Promise(function(resolve, reject) {
			db.collection('currentgames').find({gameId: apidata.gameId}).toArray().then(function(data) {
				if(!data || data === undefined) {
					db.collection('currentgames').insert(data);
					resolve(data);
				}
				else {
					for(var i = 0; i < data.length; ++i) {
						var playerObj = {
							id: data[i].summonerId,
							name: data.summonerName,
							profileIconId: data.profileIconId
						};
						db.collection('playerids').update(playerObj, {upsert: true});
					}
					resolve(data);
				}
			})
			.catch(function(err) {
				reject(err);
			})
		})
	}

	exports.insertPlayerIdObj = function(obj) {
		return new Promise(function(resolve, reject) {
		 db.collection('playerids').insert(obj, 
		 	function(err, result) {
				if(err !== null) {
					reject(err);
					return;
				}
				resolve(result);
			});
		})
	}

exports.insertPlayerChampionStats = function(obj) {
	return new Promise(function(resolve, reject) {
	 db.collection('playerchampionstats').insert(obj,
	 	function(err, result) {
			if(err !== null) {
				reject(err);
				return;
			}
			resolve(result);
		});
	})
}

//Champion.gg static data || http://api.champion.gg/stats/
exports.getOverallChampionStats = function(champ) {
	return new Promise(function(resolve, reject) {
		db.collection('championstaticwinratedata').findOne({key: champ}, function(err, result) {
			if(err) {
				reject(err);
				return;
			}
			resolve(result);
		})
	})
}


// Static Data Functions Here!
exports.insertChampGGStatic = function(obj) {
	return new Promise(function(resolve, reject) {
		db.collection('championstaticwinratedata').remove({});
		var batch = db.collection('championstaticwinratedata').initializeOrderedBulkOp();
		//declare new batch insert ~	150 inserts

		for(var key in obj) {
			obj[key].age = Date.now();
			batch.insert(obj[key]);
		}

		batch.execute(function(err, result) {
			if(err) {
				reject(err);
				return;
			}
			resolve(result);
		})
    
	})
}

var getStaticDataAge = function() {
	return new Promise(function(resolve, reject) {
		db.collection('championstaticwinratedata').findOne({}, 
			function(err, result) {
				console.log('moment! > 3', timeNow.diff(result.age, 'days') > 3);
				if(err || timeNow.diff(result.age, 'days') > 3) {
					reject(err);
					return;
				}
				resolve(result);
			})
	})
}

var getNewStaticdata = function() {
	getStaticDataAge().then(function(data) {
		console.log('static data ok!', data.age);
	})
	.catch(function(err) {
		ChampGG.updateChampionStaticData().then(function(data) {
			var parsed = JSON.parse(data);
			return exports.insertChampGGStatic(parsed);
		})
		.then(function(res) {
			console.log('staticdata update successful!', res.nInserted);
		})
		.catch(function(err) {
			console.log('update failed!', err);
		})
	})
}

exports.getRoles = function(champ) {
	return db.collection('championstaticwinratedata').find({"name": champ}, {"role": 1}).toArray();
}

	getNewStaticdata(); // Run on server start!

});



