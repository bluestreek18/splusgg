angular.module('splus.search', [])
	.controller('SearchController', function($scope, APIs, $state, DataHandler, $rootScope) {
		$rootScope.bgid = 'mainbg';
		$scope.text = '';
		$scope.error = '';

		$scope.submit = function() {
			if($scope.text !== undefined && typeof $scope.text === 'string') {
				APIs.getGameInfo($scope.text).then(function(resp) {

					if(!resp.data.hasOwnProperty('participants')) {
						$scope.error = resp.data;
					}
					else {
						DataHandler.primaryPlayer.name = $scope.text;
						DataHandler.gameData = Object.assign({}, resp);
						$state.go('teamstate');
					}
				})
				.catch(function(err) {
					$scope.error = 'Summoner Not in Game!';
					console.log(err);
				})
			}
		}

	});