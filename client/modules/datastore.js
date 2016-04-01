angular.module('splus.datastore', [])
	.factory('BuildData', function(DataHandler, APIs, Badges) {
		//Set it so the team of DataHandler.primaryPlayer is on top !!!

		var buildPlayerObjects = function() {
			DataHandler.gameData.data.participants.forEach(function(val, index) {
			val.teamId === 100 ? DataHandler.blueteam.push(val) : DataHandler.redteam.push(val);

			APIs.getChampStaticData(val.imageUrl).then(function(staticData) {
				val.champStaticData = staticData.data;
			})

			if(val.teamId === 100) {
				APIs.getSummonerChampStats(val.summonerId, val.championId).then(function(resp) {
					console.log('championID SummChampStats = ', val.championId);
					console.log('VAL ======== ', val);
					console.log('REPSONSEFROMAPI = ', resp.data);
					val.summonerChampStats = resp.data;
					Badges.createBadgeProfiles(val);
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
		buildPlayerObjects: buildPlayerObjects
	}
		
	})
	.service('DataHandler', function() {
		this.gameData = {};
		this.blueteam = [];
		this.redteam = [];
		this.bluebans = [];
		this.redbans = [];
		this.primaryPlayer = { name: undefined };

	})