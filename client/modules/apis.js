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

    var getChampStaticData = function(champNames) {
      return $http({
        method: 'GET',
        url: '/api/championstaticdata',
        params: { champNames: champNames }
      })
      .then(function(resp) {
        return resp;
      })
    };

    var getSummonerLeagueData = function(summonerIds) {
      return $http({
        method: 'GET',
        url: '/api/summonerleaguedata',
        params: { ids: summonerIds }
      })
      .then(function(resp) {
        return resp;
      })
    };

    var getChampionMatchupData = function(champname1, champname2) {
      console.log('champs ==== ', champname1, champname2)
      return $http({
        method: 'GET',
        url: '/api/champmatchupdatagg',
        params: { name1: champname1, name2: champname2 }
      })
      .then(function(resp) {
        return resp;
      })
    };

  return {
  	getGameInfo: getGameInfo,
  	getSummonerChampStats: getSummonerChampStats,
    getChampStaticData: getChampStaticData,
    getSummonerLeagueData: getSummonerLeagueData,
    getChampionMatchupData: getChampionMatchupData
  }

})