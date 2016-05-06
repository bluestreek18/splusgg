angular.module('splus.search', [])
	.controller('SearchController', function($scope, APIs, $state, $rootScope, DataHandler) {
		$rootScope.bgid = 'mainbg';
		$scope.text = '';
		$scope.error = '';

		// Reset this on loading back the search page.
		DataHandler.gameData = {};
		DataHandler.matchups = [];
		DataHandler.blueteam = [];
		DataHandler.redteam = [];
		DataHandler.bluebans = [];
		DataHandler.redbans = [];
		DataHandler.primaryPlayer = {
			name: undefined,
			tier: undefined
		};

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
				console.log('catch err! = ', err);
				$scope.error = 'Summoner Not in Ranked Game!';
			})
		}
	}

})