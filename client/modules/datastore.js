angular.module('splus.datastore', [])
	.factory('BuildData', function(DataHandler, APIs) {
		//Set it so the team of DataHandler.primaryPlayer is on top !!!

		var getTierData = function(resp) {
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				var target = resp.data[val.summonerId]['0']
				val.tierData = target.entries['0'];
				val.tierData.name = target.name;
				val.tierData.queue = target.queue;
				val.tierData.tier = target.tier.toLowerCase();
				val.tierData.division = target.entries['0'].division.toLowerCase();
				if (val.summonerName.toLowerCase() === DataHandler.primaryPlayer.name.toLowerCase()) {
					DataHandler.primaryPlayer.tier = val.tierData.tier;
				}
			})
		}

		var buildPlayerObjects = function() {
			var promiseArray = [];
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				val.teamId === 100 ? DataHandler.blueteam.push(val) : DataHandler.redteam.push(val);
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
						DataHandler.gameData.data.bannedChampions[ind].role = data.data.role;
						DataHandler.gameData.data.bannedChampions[ind].staticData = data.data.general;
						return data.data.general;
					}));
				}
				
			})

			return Promise.all(promiseArray);  //test promise.all is doing all calls same time or doing 1 per array item syncronously - use postman gives ms of call
		}

		var processPlayers = function(result, gameData, res) {
			result.forEach(function(val, ind) {
				if(val.data && res[ind]) { //test if recieved data!
					gameData.data.participants[ind].champStaticData = val.data;
					gameData.data.participants[ind].summonerChampStats = res[ind].data;
				}
			})
			var query = gameData.data.idArray.toString();
			return APIs.getSummonerLeagueData(query);
		}

		var processMatchupData = function(matchupArray) {
			DataHandler.blueteam.forEach(function(val, index) {
				debugger
				// Assuming here they are sorted.
				console.log('matchupArray', matchupArray);
				DataHandler.blueteam[index];
				DataHandler.redteam[index];
			})
		}

		var getSummonerChampionStats = function() {
			var array = [];
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				if(index < 5) { // RATE LIMIT temporarily!!!
					array.push(APIs.getSummonerChampStats(val.summonerId, val.championId));
				}
			})
			
			return Promise.all(array);
		}

		var sortRoles = function(a, b) {
			if(a.champStaticData.role < b.champStaticData.role) return -1;
    	if(a.champStaticData.role > b.champStaticData.role) return 1;
    	return 0;
		}


		return { //dont need to expose this many methods.
			buildPlayerObjects: buildPlayerObjects,
			getTierData: getTierData,
			addBanStatic: addBanStatic,
			processPlayers: processPlayers,
			getSummonerChampionStats: getSummonerChampionStats,
			processMatchupData: processMatchupData,
			sortRoles: sortRoles
		}

	})
	.service('DataHandler', function() {
		this.gameData = {};
		this.blueteam = [];
		this.redteam = [];
		this.bluebans = [];
		this.redbans = [];
		this.primaryPlayer = {
			name: undefined,
			tier: undefined
		};

	})