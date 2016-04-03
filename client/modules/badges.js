angular.module('splus.badges', [])
	.factory('Badges', function() {
		var createBadgeProfiles = function(champ) {
			if(champ.summonerChampStats) {
				champ.badges = [];
				testGamesPlayed(champ);
				testMultiKills(champ);
				testLeagueData(champ);
			} else {
				return;
			}
		}

		var testGamesPlayed = function(obj) {
			var played = obj.summonerChampStats.stats.totalSessionsPlayed;
			var pString = played + ' Games Played!';
			if(played === 0) {
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
				obj.badges.push({ display: obj.championName + ' Begginner!', tooltip: 'Don\'t Quit your Day Job... ' + pString });
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
	}

	var testLeagueData =  function(obj) {
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

			if(target - 1 === wins) {
				obj.badges.push({ display: 'One Victory from Promotion' , tooltip: progress });
			}
			else {
				obj.badges.push({ display: 'Player in Series!' , tooltip: progress });
			}
		}
		else if(100 - lstats < 16) {
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


		return {
			createBadgeProfiles: createBadgeProfiles
		}
	})