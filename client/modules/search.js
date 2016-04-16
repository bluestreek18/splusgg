angular.module('splus.search', [])
	.controller('SearchController', function($scope, APIs, $state, $rootScope, DataHandler) {
		$rootScope.bgid = 'mainbg';
		$scope.text = '';
		$scope.error = '';

		$scope.submit = function() {
		if($scope.text !== undefined && typeof $scope.text === 'string') {
			var noSpaces = $scope.text;
			noSpaces = noSpaces.replace(/\s+/g, '');

			APIs.getGameInfo(noSpaces).then(function(resp) {
				if(!resp.data.hasOwnProperty('participants')) {
					if(typeof resp.data === 'string') { $scope.error = resp.data; }
				}
				else {
					DataHandler.primaryPlayer.name = $scope.text;
					DataHandler.gameData = Object.assign({}, resp);
					console.log(DataHandler.gameData)
					$state.go('teamstate');
				}
			}).catch(function(err) {
				$scope.error = 'Summoner Not in Game!';
			})

		}
	}
})