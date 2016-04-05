angular.module('splus.datastore', [])
	.factory('BuildData', function(DataHandler, APIs) {
		//Set it so the team of DataHandler.primaryPlayer is on top !!!

		var getTierData = function(resp) {
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				if(resp.data[val.summonerId]) {
					var target = resp.data[val.summonerId]['0']
					val.tierData = target.entries['0'];
					val.tierData.name = target.name;
					val.tierData.queue = target.queue;
					val.tierData.tier = target.tier.toLowerCase();
					val.tierData.division = target.entries['0'].division.toLowerCase();
					if (val.summonerName.toLowerCase() === DataHandler.primaryPlayer.name.toLowerCase()) {
						DataHandler.primaryPlayer.tier = val.tierData.tier;
					}
				}
			})
		}

		var buildPlayerObjects = function() {
			var promiseArray = [];
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				promiseArray.push(APIs.getChampStaticData(val.imageUrl));
			})

			return Promise.all(promiseArray);
		}

		var addBanStatic = function() {
			var promiseArray = [];
			DataHandler.gameData.data.bannedChampions.forEach(function(item, ind) {
				if(item) {
					promiseArray.push(APIs.getChampStaticData(item.championUrl).then(
					function(data) {
						if(data) {
							DataHandler.gameData.data.bannedChampions[ind].role = data.data.role;
							DataHandler.gameData.data.bannedChampions[ind].staticData = data.data.general;
							return data.data.general;
						}
						console.log('No staticData Found!');
						return 'No staticData Found!';
					}));
				}
				
			})

			return Promise.all(promiseArray);  //test promise.all is doing all calls same time or doing 1 per array item syncronously - use postman gives ms of call
		}

		var processPlayers = function(result, gameData, res) {
			result.forEach(function(val, ind) {
				if(val.data && res[ind]) {
					gameData.data.participants[ind].champStaticData = val.data;
					gameData.data.participants[ind].summonerChampStats = res[ind].data;
				}
				else if(val.data) {
					gameData.data.participants[ind].champStaticData = val.data;
				}
			})
			var query = gameData.data.idArray.toString();
			return APIs.getSummonerLeagueData(query);
		}

		var processMatchupData = function(matchupArray) {
			console.log('matchupArray ==== ', matchupArray)
			// ITS champ A vs champ B
			// Assuming here they are sorted.
			debugger
			for(var i = 0; i < matchupArray.length; ++i) {
				if(matchupArray[i].data['0']) {
					DataHandler.matchups.push(matchupArray[i].data['0']);
					DataHandler.matchups[i].versus = DataHandler.blueteam[i].championName + ' vs ' + DataHandler.redteam[i].championName;
					DataHandler.matchups[i].favors = matchupArray[i].data['0'].winRate < 50.00 ? 
					'Favors ' + DataHandler.redteam[i].championName :
					'Favors ' + DataHandler.blueteam[i].championName;
				}
				else {
					DataHandler.matchups.push(matchupArray[i].data.error);
				}
			}
		}

		var getSummonerChampionStats = function() {
			var array = [];
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				if(index < 4) { // RATE LIMIT temporarily!!!
					array.push(APIs.getSummonerChampStats(val.summonerId, val.championId));
				}
			})
			
			return Promise.all(array);
		}

		return { //dont need to expose this many methods.
			buildPlayerObjects: buildPlayerObjects,
			getTierData: getTierData,
			addBanStatic: addBanStatic,
			processPlayers: processPlayers,
			getSummonerChampionStats: getSummonerChampionStats,
			processMatchupData: processMatchupData
		}

	})
	.service('DataHandler', function() {
		this.gameData = {};
		this.matchups = [];
		this.blueteam = [];
		this.redteam = [];
		this.bluebans = [];
		this.redbans = [];
		this.primaryPlayer = {
			name: undefined,
			tier: undefined
		};

	})