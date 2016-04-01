angular.module('splus.teams', [])
	.controller('TeamController', function($rootScope, $scope, DataHandler, APIs, Badges) {
		$scope.data = DataHandler.gameData.data;
		$scope.blueteam = [];
		$scope.redteam = [];
		$scope.bluebans = [];
		$scope.redbans = [];
		$scope.gameStarted = $scope.data.gameStartTime;
		$rootScope.bgid = 'teamsbg';

		$scope.insertData = function() {
			$scope.data.participants.forEach(function(val, index) {
				val.teamId === 100 ? $scope.blueteam.push(val) : $scope.redteam.push(val);

				APIs.getChampStaticData(val.imageUrl).then(function(staticData) {
					val.champStaticData = staticData.data;
				})

				if(val.teamId === 100) {
					APIs.getSummonerChampStats(val.summonerId, val.championId).then(function(resp) {
						val.summonerChampStats = resp.data;
						Badges.createBadgeProfiles(val);
					});
				}
			})

			$scope.data.bannedChampions.forEach(function(item, ind) {
				item.teamId === 100 ? $scope.bluebans.push(item) : $scope.redbans.push(item);
				APIs.getChampStaticData(item.championUrl).then(function(static) {
					item.staticData = static.data.general;
					item.role = static.data.role;
				})
			})

		}

		$scope.insertData();
	});

