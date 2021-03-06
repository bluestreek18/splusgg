angular.module('splus.datastore', [])
	.factory('BuildData', ['DataHandler', 'APIs', function(DataHandler, APIs) {
		//Set it so the team of DataHandler.primaryPlayer is on top !!!

		var getTierData = function(resp) {
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				if(resp && resp.data[val.summonerId]) {
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
				else {
					val.tierData = {};
					val.tierData.tier = 'i';
					val.tierData.division = 'unranked';
				}
			})
		}

		var buildPlayerObjects = function() {		//The api can accept all the champs at once. Refactor this to do that.
			return Promise.all(DataHandler.gameData.data.participants.map(function(val) {
				if(val) {
					return APIs.getChampStaticData(val.imageUrl);
				}
			}));
		}

		var addBanStatic = function() { 
			var queryString = '';

			DataHandler.gameData.data.bannedChampions.forEach(function(item, ind) {
				if(item) {
					queryString += item.championUrl + ',';
				}
			})

			queryString = queryString.slice(0, -1);
			return APIs.getChampStaticData(queryString).then(function(resp) {
				if(resp) {
					resp.data.forEach(function(val, ind) {
						DataHandler.gameData.data.bannedChampions[ind].role = val.role;
						DataHandler.gameData.data.bannedChampions[ind].staticData = val.general;
						return val.general;
					})
				}
			})
		}


		var processPlayers = function(result, gameData, res) {
			result.forEach(function(val, ind) {
				if(val && res[ind]) {
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
			return new Promise(function(resolve, reject) {
				if(!matchupArray) {
					reject(matchupArray);
					return;
				}

				var mHold = [];
				var rolePos = ['Jungle', 'ADC', 'Top', 'Support', 'Middle'];
					for(var i = 0; i < matchupArray.length; ++i) {
						if(matchupArray[i].data['0']) {
							mHold.push(matchupArray[i].data['0']);
							mHold[i].versus = DataHandler.blueteam[i].championName + ' vs ' + DataHandler.redteam[i].championName;
							mHold[i].favors = matchupArray[i].data['0'].winRate < 50.00 ? 
							'Favors ' + DataHandler.redteam[i].championName :
							'Favors ' + DataHandler.blueteam[i].championName;
							mHold[i].games += ' Games Analyzed';
							mHold[i].winRate += ' %';
							mHold[i].role = rolePos[i];
						}
						else {
							mHold[i] = { error: 'Matchup Not Found!' };
							mHold[i].role = rolePos[i];
						}
					}

					resolve(mHold);
			})		
		}

		var getSummonerChampionStats = function() {
			var array = [];
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				if(val) { // RATE LIMIT temporarily!!! also checking summoner isnt null
					array.push(APIs.getSummonerChampStats(val.summonerId, val.championId));
				}
			})
			
			return Promise.all(array);
		}

		// team here is the string 'redteam' or 'blueteam'
		var teamRecentGames = function() {
			return Promise.all(DataHandler.gameData.data.participants.map(function(val) {
				return APIs.getSummonerRecentGames(val.summonerId)
					.then(function(data) {
						console.log('data from recent games = ', data)
						val.recentGames = data.data;
					})
			}))
		}

		return { //dont need to expose this many methods.
			buildPlayerObjects: buildPlayerObjects,
			getTierData: getTierData,
			addBanStatic: addBanStatic,
			processPlayers: processPlayers,
			getSummonerChampionStats: getSummonerChampionStats,
			processMatchupData: processMatchupData,
			teamRecentGames: teamRecentGames
		}

	}])
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