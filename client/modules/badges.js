angular.module('splus.badges', [])
	.factory('Badges', function() {
		var createBadgeProfiles = function(champ) {
			champ.badges = [];
			testGamesPlayed(champ);
			testMultiKills(champ);
			
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
				obj.badges.push({ display: obj.championName + ' Novice!', tooltip: + pString });
			}
			else if (played > 5) {
				obj.badges.push({ display: obj.championName + ' Noob!', tooltip: 'Keep telling yourself they probably wont feed... ' + pString });
			}
			else if (played > 2) {
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


		return {
			createBadgeProfiles: createBadgeProfiles
		}
	})