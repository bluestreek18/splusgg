angular.module('splus.apis', [])
	.factory('APIs', ['$http', function($http) {

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

    var getDataDragonVersion = function() {
      return $http({
        method: 'GET',
        url: '/api/ddversion'
      })
    };

    var getSummonerRecentGames = function(id) {
      return $http({
        method: 'GET',
        url: '/riot/getsummrecentgames',
        params: { id: id }
      })
    };

  return {
  	getGameInfo: getGameInfo,
  	getSummonerChampStats: getSummonerChampStats,
    getChampStaticData: getChampStaticData,
    getSummonerLeagueData: getSummonerLeagueData,
    getChampionMatchupData: getChampionMatchupData,
    getDataDragonVersion: getDataDragonVersion,
    getSummonerRecentGames: getSummonerRecentGames
  }

}])
angular.module('splus', [
  'angularMoment',
	'ui.bootstrap',
  'ui.router',
	'splus.apis',
	'splus.teams',
	'splus.search',
  'splus.badges',
	'splus.nav',
  'splus.datastore'
])
.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/search');

	$stateProvider.state('searchstate', {
    url: '/search',
    templateUrl: '/templates/gamesearch.html',
    controller: 'SearchController'
  })
  .state('teamstate', {
    url: '/teams',
    templateUrl: '/templates/matchview.html',
    controller: 'TeamController'
  });

}])
angular.module('splus.badges', [])
	.factory('Badges', function() {
		var createBadgeProfiles = function(champ) {
			if(champ.summonerChampStats) {
				champ.badges = [];
				testGamesPlayed(champ);
				testMultiKills(champ);
				testLeagueData(champ);
				getKDA(champ);
				firstBlood(champ);
				smallStats(champ);
				checkLastTenGames(champ);


				checkLength(champ);
			} else {
				console.log('No Data to Process for Badges!', champ);
				return;
			}
		}

		var testGamesPlayed = function(obj) {
			if(!obj.summonerChampStats.hasOwnProperty('stats')) { 
				obj.summonerChampStats.stats = {};
				obj.summonerChampStats.stats.winRate = '0';
				return;
			} //Are there stats for this player? Maybe first game?

			var played = obj.summonerChampStats.stats.totalSessionsPlayed;
			var pString = played + ' Games Played!';

			if(obj.summonerName === "Just Call Saul" || obj.summonerName === "Jhin Main AMA") {
				obj.badges.push({ display: obj.championName + ' GOD!', tooltip: 92348231656748 + ' Games Played! Insanity...' });
				obj.badges.push({ display: 'Absolute Monster ...', tooltip: ' Quit now. This player is out of Control. ' });
			}
			else if(played === 0) {
				obj.badges.push({ display: 'First Time ' + obj.championName + '!', tooltip: 'Hopefully they played a normal...'});
			}
			else if(played > 1000) {
				obj.badges.push({ display: obj.championName + ' GOD!', tooltip: played + ' Games Played! Insanity...' });
			}
			else if(played > 500) {
				obj.badges.push({ display: obj.championName + ' Monster!', tooltip: pString });
			}
			else if(played > 200) {
				obj.badges.push({ display: obj.championName + ' Beast!', tooltip: pString });
			}
			else if(played > 150) {
				obj.badges.push({ display: obj.championName + ' Veteran!', tooltip: pString });
			}
			else if(played > 100) {
				obj.badges.push({ display: obj.championName + ' Legend!', tooltip: 'They probably like this champ... ' +  pString });
			}
			else if(played > 75) {
				obj.badges.push({ display: obj.championName + ' Master!', tooltip: pString });
			}
			else if (played > 50) {
				obj.badges.push({ display: obj.championName + ' Try Hard!', tooltip: pString });
			}
			else if (played > 25) {
				obj.badges.push({ display: obj.championName + ' Disciple!', tooltip: 'Its Growing on them... ' + pString });
			}
			else if (played > 15) {
				obj.badges.push({ display: obj.championName + ' Beginner!', tooltip: 'Don\'t Quit your Day Job... ' + pString });
			}
			else if (played > 10) {
				obj.badges.push({ display: obj.championName + ' Novice!', tooltip: pString });
			}
			else if (played > 5) {
				obj.badges.push({ display: obj.championName + ' Noob!', tooltip: 'Keep telling yourself they probably wont feed... ' + pString });
			}
			else if (played >= 1 ) {
				obj.badges.push({ display: obj.championName + ' TrashCan!', tooltip: 'At least its not their first game! ' + pString });
			}
		}

	var testMultiKills = function(array) {
		var stats = array.summonerChampStats.stats;
		if(stats.totalPentaKills > 1) {
			array.badges.push({ display: stats.totalPentaKills + ' ' + array.championName + ' Penta Kills!', tooltip: 'TotalPentaKills: ' + stats.totalPentaKills });
		}
		else if(stats.totalPentaKills > 0) {
			array.badges.push({ display: array.championName + ' Penta Kill!', tooltip: 'TotalPentaKills: ' + stats.totalPentaKills });
		}

		if(stats.totalQuadraKills > 1) {
			array.badges.push({ display: array.championName + ' Quadra Kills!', tooltip: 'TotalQuadraKills: ' + stats.totalQuadraKills });
		}
		else if(stats.totalQuadraKills > 0) {
			array.badges.push({ display: array.championName + ' Quadra Kill!', tooltip: 'TotalQuadraKills: ' + stats.totalQuadraKills });
		}

		var tdk = (stats.totalDoubleKills / stats.totalSessionsPlayed).toFixed(2);
		if(tdk >= 1.75) {
			array.badges.push({ display: array.championName + ' DoubleKillGod!', tooltip: 'DKPG: ' + tdk });
		}
		else if(tdk >= 1.35) {
			array.badges.push({ display: array.championName + ' DoubleKillAssasin', tooltip: 'DKPG: ' + tdk });
		}
		else if(tdk >= 1) {
			array.badges.push({ display: array.championName + ' DoubleKillKing!', tooltip: 'DKPG: ' + tdk });
		}
		else if(tdk >= 0.75) {
			array.badges.push({ display: 'DoubleKillMaster!', tooltip: 'DKPG: ' + tdk });
		}
	}

	var testLeagueData =  function(obj) {
		if(obj.tierData) {
			var tstats = obj.tierData;
			var lstats = obj.tierData.leaguePoints;
			var rankedWinRate = ((obj.tierData.wins / (obj.tierData.losses + obj.tierData.wins)) * 100).toFixed(2);
			rankedWinRate = Number(rankedWinRate);
			obj.rankedOverallWinRate = rankedWinRate;

			if(lstats === 99) {
				obj.badges.push({ display: lstats + ' LP!' , tooltip: 'So close... ' });
			}
			else if(tstats.hasOwnProperty('miniSeries')) {
				var l = tstats.miniSeries.losses;
				var w = tstats.miniSeries.wins;
				var target = tstats.miniSeries.target;
				var series = (target === 3) ? 5 : 3;
				var progress = w + 'W' + '/' + l + 'L' + ' of ' + series;

				if(target - 1 === w) {
					obj.badges.push({ display: 'One Victory from Promotion' , tooltip: progress });
				}
				else {
					obj.badges.push({ display: 'Player in Series!' , tooltip: progress });
				}
			}
			else if(100 - lstats < 16 && (tstats.tier !== 'master' && tstats.tier !== 'challenger')) {
				obj.badges.push({ display: 'One Win for Series!' , tooltip: lstats + ' LP!' }); //implicit coercion bois!!! kyle gg
			}

			if(tstats.isHotStreak) {
				obj.badges.push({ display: 'Hot Streak' , tooltip: 'Three in a Row, Not Bad...' });
			}
			if(tstats.isFreshBlood) {
				obj.badges.push({ display: 'Fresh Blood' , tooltip: 'This player was recently Promoted' });
			}

			if(rankedWinRate > 75) {
				obj.badges.push({ display: 'Challenjour!!?!' , tooltip: 'This player has a Ranked Win Rate of ' + rankedWinRate + '%' });
			}
			else if(rankedWinRate > 70) {
				obj.badges.push({ display: 'On Another Level!' , tooltip: 'This player has a Ranked Win Rate of ' + rankedWinRate + '%' });
			}
			else if(rankedWinRate > 60) {
				obj.badges.push({ display: 'Smurf Alert!' , tooltip: 'This player has a Ranked Win Rate of ' + rankedWinRate + '%' });
			}
			else if(rankedWinRate > 55) {
				obj.badges.push({ display: 'Solid!' , tooltip: 'This player has a Ranked Win Rate of ' + rankedWinRate + '%' });
			}
		}
	}

	var getKDA = function(obj) {
		stat = obj.summonerChampStats.stats;
		kda = ((stat.totalAssists + stat.totalChampionKills) / stat.totalDeathsPerSession).toFixed(2);

		if(kda > 10) {
			obj.badges.push({ display: 'Its Over 9000!' , tooltip: kda + ' KDA' });
		}
		else if(kda > 8) {
			obj.badges.push({ display: 'Pls... Calm Down' , tooltip: kda + ' KDA' });
		}
		else if(kda > 5) {
			obj.badges.push({ display: '*%@& Smurf!' , tooltip: kda + ' KDA' });
		}
		else if(kda > 4) {
			obj.badges.push({ display: 'Legends Never Die' , tooltip: kda + ' KDA' });
		}
		else if(kda > 3) {
			obj.badges.push({ display: '3X!' , tooltip: kda + ' KDA, Obviously a Professional.' });
		}
		else if(kda > 2.5) {
			obj.badges.push({ display: 'Superb!' , tooltip: kda + ' KDA' });
		}
	}

	var firstBlood = function(obj) {
		stat = obj.summonerChampStats.stats;
		fb = (stat.totalFirstBlood / stat.totalSessionsPlayed) * 100;

		if(fb > 90) {
			obj.badges.push({ display: 'Bro Pls!!?' , tooltip: fb + '% FirstBloods!' });
		}
		else if(fb > 50) {
			obj.badges.push({ display: 'U Cray!!?' , tooltip: fb + '% FirstBloods!' });
		}
		else if(fb > 30) {
			obj.badges.push({ display: 'Lee Syndrome!' , tooltip: fb + '% FirstBloods!' });
		}
		else if(fb > 15) {
			obj.badges.push({ display: 'Level 1 Invade Bois!' , tooltip: fb + '% FirstBloods!' });
		}
		else if(fb > 10) {
			obj.badges.push({ display: 'Supremely Average!' , tooltip: fb + '% FirstBloods!' });
		}
	}

	var smallStats = function(obj) {
		stat = obj.summonerChampStats.stats;
		var minion = (stat.totalMinionKills / stat.totalSessionsPlayed).toFixed(0);
		var gold = stat.totalGoldEarned / stat.totalSessionsPlayed;

		if(minion > 400) {
			obj.badges.push({ display: 'The Flood!' , tooltip: 'Average ' + minion + 'CS per Game' });
		}
		else if(minion > 300) {
			obj.badges.push({ display: 'Enemy of the Machines!' , tooltip: 'Average ' + minion + 'CS per Game' });
		}
		else if(minion > 200) {
			obj.badges.push({ display: 'Master Minion!' , tooltip: 'Average ' + minion + 'cs per Game' });
		}

		if(gold > 15000) {
			obj.badges.push({ display: 'Fort Knox!' , tooltip: gold.toFixed(0) + ' Earned Average per Game!' });
		}
	}


	var checkLength = function(champ) {
		while(champ.badges.length > 5) {
			champ.badges.shift();
		}
		if(champ.badges.length === 0) {
			champ.badges.push({ display: 'First Game ' + champ.championName + '!', tooltip: 'GG FF 20...' });
		}
	}

	var checkLastTenGames = function(champ) {
		console.log('checkLastTenGames = ', champ.recentGames)
		debugger

		if(champ.recentGames.wardPlaced > 40) {
			champ.badges.push({ display: 'Ward\'s OP!' + '!', tooltip: 'Averages ' + champ.recentGames.wardPlaced + ' Wards per Game.' });
		}
		else if(champ.recentGames.wardPlaced > 30) {
			champ.badges.push({ display: 'Ward Spammer!' + '!', tooltip: 'Averages ' + champ.recentGames.wardPlaced + ' Wards per Game.' });
		}
		else if(champ.recentGames.wardPlaced > 20) {
			champ.badges.push({ display: 'Ward King!' + '!', tooltip: 'Averages ' + champ.recentGames.wardPlaced + ' Wards per Game.' });
		}
		else if(champ.recentGames.wardPlaced > 15) {
			champ.badges.push({ display: 'Not A Bronze Warder!' + '!', tooltip: 'Averages ' + champ.recentGames.wardPlaced + ' Wards per Game.' });
		}

		if(champ.summonerName === 'Jhin Main AMA') {
			champ.badges.push({ display: 'This Cheater Still Buys Wards!' + '!', tooltip: 'Averages 45749486867 Wards per Game.' });
		}
		
		if(champ.recentGames.gamesWon > 10) {
			champ.badges.push({ display: 'Killionaire!', tooltip: '10 in a Row... Insane!' });
			champ.badges.push({ display: 'Invincible!', tooltip: 'Won ' + champ.recentGames.gamesWon + ' of Last 10 Games!' });
		}
		else if(champ.recentGames.gamesWon > 9) {
			champ.badges.push({ display: 'Killpocalypse!', tooltip: 'Won ' + champ.recentGames.gamesWon + ' of Last 10 Games!' });
		}
		else if(champ.recentGames.gamesWon > 8) {
			champ.badges.push({ display: 'Killtastrophe!', tooltip: 'Won ' + champ.recentGames.gamesWon + ' of Last 10 Games!' });
		}
		else if(champ.recentGames.gamesWon > 7) {
			champ.badges.push({ display: 'Killimanjaro!', tooltip: 'Won ' + champ.recentGames.gamesWon + ' of Last 10 Games!' });
		}

		if(champ.recentGames.kda > 6) {
			champ.badges.push({ display: 'Perfection!', tooltip: champ.recentGames.kda + ' KDA Over the Last 10 Games!' });
		}
		else if(champ.recentGames.kda > 5) {
			champ.badges.push({ display: 'Hail to the King!', tooltip: champ.recentGames.kda + ' KDA Over the Last 10 Games!' });
		}
		else if(champ.recentGames.kda > 4) {
			champ.badges.push({ display: 'Rampage!', tooltip: champ.recentGames.kda + ' KDA Over the Last 10 Games!' });
		}
		else if(champ.recentGames.kda > 3) {
			champ.badges.push({ display: 'Open Season!', tooltip: champ.recentGames.kda + ' KDA Over the Last 10 Games!' });
		}

	}

		return {
			createBadgeProfiles: createBadgeProfiles
		}
	})



angular.module('splus.datastore', [])
	.factory('BuildData', ['DataHandler', 'APIs', function(DataHandler, APIs) {
		//Set it so the team of DataHandler.primaryPlayer is on top !!!

		var getTierData = function(resp) {
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				if(resp && resp.data[val.summonerId]) {
					var target = resp.data[val.summonerId]['0']
					val.tierData = target.entries['0'];
					val.tierData.name = target.name;
					val.tierData.queue = target.queue;
					val.tierData.tier = target.tier.toLowerCase();
					val.tierData.division = target.entries['0'].division.toLowerCase();
					if (val.summonerName.toLowerCase() === DataHandler.primaryPlayer.name.toLowerCase()) {
						DataHandler.primaryPlayer.tier = val.tierData.tier;
					}
				}
				else {
					val.tierData = {};
					val.tierData.tier = 'i';
					val.tierData.division = 'unranked';
				}
			})
		}

		var buildPlayerObjects = function() {		//The api can accept all the champs at once. Refactor this to do that.
			return Promise.all(DataHandler.gameData.data.participants.map(function(val) {
				if(val) {
					return APIs.getChampStaticData(val.imageUrl);
				}
			}));
		}

		var addBanStatic = function() { 
			var queryString = '';

			DataHandler.gameData.data.bannedChampions.forEach(function(item, ind) {
				if(item) {
					queryString += item.championUrl + ',';
				}
			})

			queryString = queryString.slice(0, -1);
			return APIs.getChampStaticData(queryString).then(function(resp) {
				if(resp) {
					resp.data.forEach(function(val, ind) {
						DataHandler.gameData.data.bannedChampions[ind].role = val.role;
						DataHandler.gameData.data.bannedChampions[ind].staticData = val.general;
						return val.general;
					})
				}
			})
		}


		var processPlayers = function(result, gameData, res) {
			result.forEach(function(val, ind) {
				if(val && res[ind]) {
					gameData.data.participants[ind].champStaticData = val.data;
					gameData.data.participants[ind].summonerChampStats = res[ind].data;
				}
				else if(val.data) {
					gameData.data.participants[ind].champStaticData = val.data;
				}
			})
			var query = gameData.data.idArray.toString();
			return APIs.getSummonerLeagueData(query);
		}

		var processMatchupData = function(matchupArray) {
			return new Promise(function(resolve, reject) {
				if(!matchupArray) {
					reject(matchupArray);
					return;
				}

				var mHold = [];
				var rolePos = ['Jungle', 'ADC', 'Top', 'Support', 'Middle'];
					for(var i = 0; i < matchupArray.length; ++i) {
						if(matchupArray[i].data['0']) {
							mHold.push(matchupArray[i].data['0']);
							mHold[i].versus = DataHandler.blueteam[i].championName + ' vs ' + DataHandler.redteam[i].championName;
							mHold[i].favors = matchupArray[i].data['0'].winRate < 50.00 ? 
							'Favors ' + DataHandler.redteam[i].championName :
							'Favors ' + DataHandler.blueteam[i].championName;
							mHold[i].games += ' Games Analyzed';
							mHold[i].winRate += ' %';
							mHold[i].role = rolePos[i];
						}
						else {
							mHold[i] = { error: 'Matchup Not Found!' };
							mHold[i].role = rolePos[i];
						}
					}

					resolve(mHold);
			})		
		}

		var getSummonerChampionStats = function() {
			var array = [];
			DataHandler.gameData.data.participants.forEach(function(val, index) {
				if(val) { // RATE LIMIT temporarily!!! also checking summoner isnt null
					array.push(APIs.getSummonerChampStats(val.summonerId, val.championId));
				}
			})
			
			return Promise.all(array);
		}

		// team here is the string 'redteam' or 'blueteam'
		var teamRecentGames = function() {
			return Promise.all(DataHandler.gameData.data.participants.map(function(val) {
				return APIs.getSummonerRecentGames(val.summonerId)
					.then(function(data) {
						console.log('data from recent games = ', data)
						val.recentGames = data.data;
					})
			}))
		}

		return { //dont need to expose this many methods.
			buildPlayerObjects: buildPlayerObjects,
			getTierData: getTierData,
			addBanStatic: addBanStatic,
			processPlayers: processPlayers,
			getSummonerChampionStats: getSummonerChampionStats,
			processMatchupData: processMatchupData,
			teamRecentGames: teamRecentGames
		}

	}])
	.service('DataHandler', function() {
		this.gameData = {};
		this.matchups = [];
		this.blueteam = [];
		this.redteam = [];
		this.bluebans = [];
		this.redbans = [];
		this.primaryPlayer = {
			name: undefined,
			tier: undefined
		};

	})
angular.module('splus.nav', [])
	.controller('NavController', ['$scope', function($scope) {

	}]);
angular.module('splus.search', [])
	.controller('SearchController', ['$scope', 'APIs', '$state', '$rootScope', 'DataHandler', function($scope, APIs, $state, $rootScope, DataHandler) {
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
				console.log('catch err! = ', err);
				$scope.error = 'Summoner Not in Game!';
			})

		}
	}
}])
angular.module('splus.teams', [])
	.controller('TeamController', ['$rootScope', '$scope', 'DataHandler', 'BuildData', 'Badges', 'APIs', function($rootScope, $scope, DataHandler, BuildData, Badges, APIs) {
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


