angular.module('splus.teams', [])
	.controller('TeamController', function($rootScope, $scope, DataHandler, BuildData, Badges, APIs) {
		var gameData = DataHandler.gameData;
		$scope.data = gameData.data;
		$scope.blueteam = DataHandler.blueteam;
		$scope.redteam = DataHandler.redteam;
		$scope.bluebans = DataHandler.bluebans;
		$scope.redbans = DataHandler.redbans;
		$scope.highestTier = DataHandler.primaryPlayer.tier;
		$scope.gameStarted = $scope.data.gameStartTime;
		$rootScope.bgid = 'teamsbg';

		$scope.insertData = function() {
			var resp;
			BuildData.getSummonerChampionStats().then(function(res) {
				resp = res;
				return BuildData.buildPlayerObjects();
			})
			.catch(function(err) {
				console.log(err);
			})
			.then(function(result) {
				return BuildData.processPlayers(result, gameData, resp);
			})
			.catch(function(err) {
				console.log(err);
			})
			.then(function(result) {
				BuildData.getTierData(result);
				return BuildData.addBanStatic();
			})
			.catch(function(err) {
				console.log(err);
			})
			.then(function(result) {
				gameData.data.bannedChampions.forEach(function(val, ind) {
					val.teamId === 100 ? DataHandler.bluebans.push(val) : DataHandler.redbans.push(val);
				})
				var matchupPromises = [];

				DataHandler.blueteam = DataHandler.blueteam.sort(BuildData.sortRoles);
				//DataHandler.redteam = DataHandler.redteam.sort(BuildData.sortRoles); // Disabled due to api limit!
				gameData.data.participants.forEach(function(val, ind) {
					if(ind < 5) {
						champid1 = DataHandler.blueteam[ind].championName;
						champid2 = DataHandler.redteam[ind].championName;
						champid1 = champid1.replace(/\s+/g, '');
						champid2 = champid2.replace(/\s+/g, '');
						matchupPromises.push(APIs.getChampionMatchupData(champid1, champid2));
					}
					
					Badges.createBadgeProfiles(gameData.data.participants[ind]);
				})
				
				return Promise.all(matchupPromises);
			})
			.catch(function(err) {
				console.log(err);
			})
			.then(function(matchupArray) {
				console.log('MATCHUP ===  ', matchupArray);
				//add matchup data somewhere
				//process both botlanes as one normalized matchup
				//add function to datastorejs
				BuildData.processMatchupData(matchupArray);
				
			})
			.catch(function(err) {
				console.log('Insert Data Error!', err);
			})
		}

		$scope.insertData();
	})


