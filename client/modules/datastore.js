angular.module('splus.datastore', [])
	.factory('BuildData', function(DataHandler, APIs, Badges) {
		//Set it so the team of DataHandler.primaryPlayer is on top !!!

		var getTierData = function() {
			var query = DataHandler.gameData.data.idArray.toString();
			APIs.getSummonerLeagueData(query).then(function(resp) {
				DataHandler.gameData.data.participants.forEach(function(val, index) {
					debugger
					var target = resp.data[val.summonerId]['0']
					val.tierData = target.entries['0'];
					val.tierData.name = target.name;
					val.tierData.queue = target.queue;
					val.tierData.tier = target.tier.toLowerCase();
					val.tierData.division = target.entries['0'].division.toLowerCase();
					if(val.summonerName.toLowerCase() === DataHandler.primaryPlayer.name.toLowerCase()) {
						DataHandler.primaryPlayer.tier = val.tierData.tier;
					}		
				})
			})
		}

		var buildPlayerObjects = function() {
			DataHandler.gameData.data.participants.forEach(function(val, index) {
			val.teamId === 100 ? DataHandler.blueteam.push(val) : DataHandler.redteam.push(val);

			APIs.getChampStaticData(val.imageUrl).then(function(staticData) {
				val.champStaticData = staticData.data;
			})

			if(val.teamId === 100) {
				APIs.getSummonerChampStats(val.summonerId, val.championId).then(function(resp) {
					if(resp.data) {
						val.summonerChampStats = resp.data;
						Badges.createBadgeProfiles(val);
					} else {
						console.log('WARN: No summonerChampStats found!')
					}
					
				});
			}
		})

		DataHandler.gameData.data.bannedChampions.forEach(function(item, ind) {
			item.teamId === 100 ? DataHandler.bluebans.push(item) : DataHandler.redbans.push(item);
			APIs.getChampStaticData(item.championUrl).then(function(static) {
				item.staticData = static.data.general;
				item.role = static.data.role;
			})
		})
	}

	return {
		buildPlayerObjects: buildPlayerObjects,
		getTierData: getTierData
	}
		
	})
	.service('DataHandler', function() {
		this.gameData = {};
		this.blueteam = [];
		this.redteam = [];
		this.bluebans = [];
		this.redbans = [];
		this.primaryPlayer = { name: undefined, tier: undefined };

	})