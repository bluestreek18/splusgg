angular.module('splus.apis', [])
	.factory('APIs', function($http) {

		var getGameInfo = function(playerName) {
    	return $http({
        method: 'GET',
        url: '/api/initialgamedata',
        params: { "name": playerName }
      })
      .then(function(resp) {
        return resp;
      })
  	};

  	var getSummonerChampStats = function(playerid, champid) {
    	return $http({
        method: 'GET',
        url: '/api/summonerchampionstats',
        params: { id: playerid, champid: champid }
      })
      .then(function(resp) {
        return resp;
      })
  	};

    var getChampStaticData = function(champName) {
      return $http({
        method: 'GET',
        url: '/api/championstaticdata',
        params: { champName: champName }
      })
      .then(function(resp) {
        return resp;
      })
    };

  return {
  	getGameInfo: getGameInfo,
  	getSummonerChampStats: getSummonerChampStats,
    getChampStaticData: getChampStaticData
  }

})