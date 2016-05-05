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
		var stat = obj.summonerChampStats.stats;
		var kda = Number(((stat.totalAssists + stat.totalChampionKills) / stat.totalDeathsPerSession).toFixed(2));

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
		var stat = obj.summonerChampStats.stats;
		var fb = (stat.totalFirstBlood / stat.totalSessionsPlayed) * 100;

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
		var stat = obj.summonerChampStats.stats;
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
		var rg = champ.recentGames;

		if(rg.wardPlaced > 40) {
			champ.badges.push({ display: 'Ward\'s OP!', tooltip: 'Averages ' + rg.wardPlaced + ' Wards per Game.' });
		}
		else if(rg.wardPlaced > 30) {
			champ.badges.push({ display: 'Ward Spammer!', tooltip: 'Averages ' + rg.wardPlaced + ' Wards per Game.' });
		}
		else if(rg.wardPlaced > 20) {
			champ.badges.push({ display: 'Ward King!', tooltip: 'Averages ' + rg.wardPlaced + ' Wards per Game.' });
		}
		else if(rg.wardPlaced > 15) {
			champ.badges.push({ display: 'Not A Bronze Warder!', tooltip: 'Averages ' + rg.wardPlaced + ' Wards per Game.' });
		}

		if(rg.wardKilled > 12) {
			champ.badges.push({ display: 'Utter Control', tooltip: 'Averages ' + rg.wardKilled + ' Wards Killed per Game.' });
		}
		else if(rg.wardKilled > 10) {
			champ.badges.push({ display: 'Master of The Map' + '!', tooltip: 'Averages ' + rg.wardKilled + ' Wards Killed per Game.' });
		}
		else if(rg.wardKilled > 8) {
			champ.badges.push({ display: 'Denied' + '!', tooltip: 'Averages ' + rg.wardKilled + ' Wards Killed per Game.' });
		}
		else if(rg.wardKilled > 5) {
			champ.badges.push({ display: 'Blind' + '!', tooltip: 'Averages ' + rg.wardKilled + ' Wards Killed per Game.' });
		}

		if(champ.summonerName === 'Jhin Main AMA') {
			champ.badges.push({ display: 'This Cheater Still Buys Wards!' + '!', tooltip: 'Averages 45749486867 Wards per Game.' });
		}
		
		if(rg.gamesWon === 10) {
			champ.badges.push({ display: 'Killionaire!', tooltip: '10 in a Row... Insane!' });
			champ.badges.push({ display: 'Invincible!', tooltip: 'Won ' + rg.gamesWon + ' of Last 10 Games!' });
		}
		else if(rg.gamesWon === 9) {
			champ.badges.push({ display: 'Killpocalypse!', tooltip: 'Won ' + rg.gamesWon + ' of Last 10 Games!' });
		}
		else if(rg.gamesWon === 8) {
			champ.badges.push({ display: 'Killtastrophe!', tooltip: 'Won ' + rg.gamesWon + ' of Last 10 Games!' });
		}
		else if(rg.gamesWon === 7) {
			champ.badges.push({ display: 'Killimanjaro!', tooltip: 'Won ' + rg.gamesWon + ' of Last 10 Games!' });
		}
		else if(rg.gamesWon === 5) {
			champ.badges.push({ display: 'Fidy/Fidy', tooltip: '5 Won, 5 Lost of Last 10!' });
		}
		else if(rg.gamesWon === 3) {
			champ.badges.push({ display: 'Rekt!', tooltip: 'Lost ' + rg.gamesLost + ' of Last 10 Games!' });
		}
		else if(rg.gamesWon === 2) {
			champ.badges.push({ display: 'Loss Streak!', tooltip: 'Lost ' + rg.gamesLost + ' of Last 10 Games!' });
		}
		else if(rg.gamesWon === 1) {
			champ.badges.push({ display: 'Abysmal!', tooltip: 'Lost ' + rg.gamesLost + ' of Last 10 Games!' });
		}
		else if(rg.gamesWon === 0) {
			champ.badges.push({ display: 'Why No Dodgerino?', tooltip: 'Lost ' + rg.gamesLost + ' of Last 10 Games!' });
		}

		if(rg.kda > 6) {
			champ.badges.push({ display: 'Perfection!', tooltip: rg.kda + ' KDA Over the Last 10 Games!' });
		}
		else if(rg.kda > 5) {
			champ.badges.push({ display: 'Hail to the King!', tooltip: rg.kda + ' KDA Over the Last 10 Games!' });
		}
		else if(rg.kda > 4) {
			champ.badges.push({ display: 'Rampage!', tooltip: rg.kda + ' KDA Over the Last 10 Games!' });
		}
		else if(rg.kda > 3) {
			champ.badges.push({ display: 'Open Season!', tooltip: rg.kda + ' KDA Over the Last 10 Games!' });
		}

		if(rg.level > 16) {
			champ.badges.push({ display: 'Level UP!', tooltip: 'Ends Most Games at Level ' + rg.level });
		}

		if(rg.firstBlood > 7) {
			champ.badges.push({ display: 'Dead Already?', tooltip: 'Got First Blood ' + rg.firstBlood + ' of the Last 10 Games' });
		}
		else if(rg.firstBlood > 6) {
			champ.badges.push({ display: 'Blood Rampage', tooltip: 'Got First Blood ' + rg.firstBlood + ' of the Last 10 Games' });
		}
		else if(rg.firstBlood > 5) {
			champ.badges.push({ display: 'Hyper Aggression', tooltip: 'Got First Blood ' + rg.firstBlood + ' of the Last 10 Games' });
		}
		else if(rg.firstBlood > 4) {
			champ.badges.push({ display: 'Blood King', tooltip: 'Got First Blood ' + rg.firstBlood + ' of the Last 10 Games' });
		}
		else if(rg.firstBlood > 3) {
			champ.badges.push({ display: 'Play Maker', tooltip: 'Got First Blood ' + rg.firstBlood + ' of the Last 10 Games' });
		}

		if(rg.barracksKilled > 9) {
			champ.badges.push({ display: 'D Gates!', tooltip: 'Destroyed ' + rg.barracksKilled + ' Inhibitors over the Last 10 Games' });
		}
		else if(rg.barracksKilled > 8) {
			champ.badges.push({ display: 'Sir HC EZ?', tooltip: 'Destroyed ' + rg.barracksKilled + ' Inhibitors over the Last 10 Games' });
		}
		else if(rg.barracksKilled > 7) {
			champ.badges.push({ display: 'Trick2g?', tooltip: 'Destroyed ' + rg.barracksKilled + ' Inhibitors over the Last 10 Games' });
		}
		else if(rg.barracksKilled > 6) {
			champ.badges.push({ display: 'BackDoorKing!', tooltip: 'Destroyed ' + rg.barracksKilled + ' Inhibitors over the Last 10 Games' });
		}
		else if(rg.barracksKilled > 5) {
			champ.badges.push({ display: 'xPeke', tooltip: 'Destroyed ' + rg.barracksKilled + ' Inhibitors over the Last 10 Games' });
		}
		else if(rg.barracksKilled > 4) {
			champ.badges.push({ display: 'Machine!', tooltip: 'Destroyed ' + rg.barracksKilled + ' Inhibitors over the Last 10 Games' });
		}
		else if(rg.barracksKilled > 3) {
			champ.badges.push({ display: 'Only the Nexus!', tooltip: 'Destroyed ' + rg.barracksKilled + ' Inhibitors over the Last 10 Games' });
		}

		if(rg.nexusKilled > 4) {
			champ.badges.push({ display: 'No Gate', tooltip: 'Ended ' + rg.nexusKilled + ' Games of the Last 10!' });
		}
		else if(rg.nexusKilled > 3) {
			champ.badges.push({ display: '+50g', tooltip: 'Ended ' + rg.nexusKilled + ' Games of the Last 10!' });
		}
		else if(rg.nexusKilled > 2) {
			champ.badges.push({ display: 'I Win', tooltip: 'Ended ' + rg.nexusKilled + ' Games of the Last 10!' });
		}

		if(rg.avgNeutralMinionsKilledEnemyJungle > 40) {
			champ.badges.push({ display: 'Wrong Jungle!', tooltip: 'Averaged ' + rg.avgNeutralMinionsKilledEnemyJungle + ' Minions Killed in Enemy Jungle over the Last 10 Games' });
		}
		else if(rg.avgNeutralMinionsKilledEnemyJungle > 30) {
			champ.badges.push({ display: 'Where\'s my Minions at Bro?, tooltip: 'Averaged ' + rg.avgNeutralMinionsKilledEnemyJungle + ' Minions Killed in Enemy Jungle over the Last 10 Games' });
		}
		else if(rg.avgNeutralMinionsKilledEnemyJungle > 20) {
			champ.badges.push({ display: 'Counter Jungle King', tooltip: 'Averaged ' + rg.avgNeutralMinionsKilledEnemyJungle + ' Minions Killed in Enemy Jungle over the Last 10 Games' });
		}
		else if(rg.avgNeutralMinionsKilledEnemyJungle > 15) {
			champ.badges.push({ display: 'King of the Jungle', tooltip: 'Averaged ' + rg.avgNeutralMinionsKilledEnemyJungle + ' Minions Killed in Enemy Jungle over the Last 10 Games' });
		}
		else if(rg.avgNeutralMinionsKilledEnemyJungle > 10) {
			champ.badges.push({ display: 'Stalker', tooltip: 'Averaged ' + rg.avgNeutralMinionsKilledEnemyJungle + ' Minions Killed in Enemy Jungle over the Last 10 Games' });
		}

		if(rg.avgGoldSpent > 20000) {
			champ.badges.push({ display: 'I\'m Rich Bitch', tooltip: 'Averages ' + rg.avgGoldSpent + ' Gold Spent Per Game!' });
		}
		if(rg.avgGoldSpent > 18000) {
			champ.badges.push({ display: 'Big Spender', tooltip: 'Averages ' + rg.avgGoldSpent + ' Gold Spent Per Game!' });
		}
		if(rg.avgGoldSpent > 16000) {
			champ.badges.push({ display: '7 Items?', tooltip: 'Averages ' + rg.avgGoldSpent + ' Gold Spent Per Game!' });
		}
		if(rg.avgGoldSpent > 15000) {
			champ.badges.push({ display: 'I Shop at Harrods', tooltip: 'Averages ' + rg.avgGoldSpent + ' Gold Spent Per Game!' });
		}
		if(rg.avgGoldSpent > 14000) {
			champ.badges.push({ display: 'Bronze Coins', tooltip: 'Averages ' + rg.avgGoldSpent + ' Gold Spent Per Game!' });
		}


	}

		return {
			createBadgeProfiles: createBadgeProfiles
		}
	})


