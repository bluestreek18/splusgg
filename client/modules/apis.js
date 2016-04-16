angular.module('splus.apis', [])
	.factory('APIs', function($http) {

		var getGameInfo = function(playerName) {
    	return $http({
        method: 'GET',
        url: '/riot/initialgamedata',
        params: { "name": playerName }
      })
  	};

  	var getSummonerChampStats = function(playerid, champid) {
    	return $http({
        method: 'GET',
        url: '/riot/summonerchampionstats',
        params: { id: playerid, champid: champid }
      })
  	};

    var getChampStaticData = function(champNames) {
      return $http({
        method: 'GET',
        url: '/api/championstaticdata',
        params: { champNames: champNames }
      })
    };

    var getSummonerLeagueData = function(summonerIds) {
      return $http({
        method: 'GET',
        url: '/riot/summonerleaguedata',
        params: { ids: summonerIds }
      })
    };

    var getChampionMatchupData = function(champname1, champname2) {
      console.log('champs ==== ', champname1, champname2)
      return $http({
        method: 'GET',
        url: '/api/champmatchupdatagg',
        params: { name1: champname1, name2: champname2 }
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