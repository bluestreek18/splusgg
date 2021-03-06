angular.module('splus.teams', [])
	.controller('TeamController', ['$rootScope', '$scope', 'DataHandler', 'BuildData', 'Badges', 'APIs', function($rootScope, $scope, DataHandler, BuildData, Badges, APIs) {
		// window.loading_screen.pleaseWait();
		var gameData = DataHandler.gameData;
		$scope.data = gameData.data;
		$scope.matchups = DataHandler.matchups;
		$scope.blueteam = DataHandler.blueteam;
		$scope.redteam = DataHandler.redteam;
		$scope.bluebans = DataHandler.bluebans;
		$scope.redbans = DataHandler.redbans;
		$scope.highestTier = DataHandler.primaryPlayer.tier;
		$scope.gameStarted = gameData.data.gameStartTime;
		$scope.primaryColor = '';
		$rootScope.bgid = 'teamsbg';
		$scope.version = '6.9.1';
	

		$scope.insertData = function() {
			var playerObjBuild;
			var resp;
			BuildData.getSummonerChampionStats().then(function(res) {
				console.log('Champ Stats! = ', res);
				resp = res;
				return BuildData.buildPlayerObjects();
			})
			.catch(function(err) {
				console.log(err);
			})
			.then(function(result) {
				playerObjBuild = result;
				
				return BuildData.teamRecentGames()
			})
			.then(function(data) {
				return BuildData.processPlayers(playerObjBuild, gameData, resp);
			})
			.catch(function(err) {
				console.log(err);
			})
			.then(function(result) {
				console.log('gameData = ', gameData.data)
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

				gameData.data.participants.forEach(function(val, ind) {
					if(ind <= 4) {
						DataHandler.blueteam.push(gameData.data.participants[ind]);
						DataHandler.redteam.push(gameData.data.participants[ind + 5]);
					}

					if(DataHandler.blueteam[ind] && DataHandler.redteam[ind]) {
						champid1 = DataHandler.blueteam[ind].imageUrl;
						champid2 = DataHandler.redteam[ind].imageUrl;
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
				window.loading_screen.finish();
				return BuildData.processMatchupData(matchupArray);
			})
			.then(function(data) {
				$scope.$apply(function() {  //hey AngularJS, execute this function and update the view!
					console.log('applying matchup changes!')
    			$scope.matchups = data;
     		});
				console.log('matchups = ', $scope.matchups);
			})
			.catch(function(err) {
				console.log('Insert Data Error!', err);
			})
		}

		$scope.insertData();
	}])


