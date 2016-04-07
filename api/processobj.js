var db = require('./database');

exports.addImageData = function(obj) {
  obj.idArray = [];

	obj.participants.forEach(function(val, index) {
    var champId = val.championId;
    var summ1 = val.spell1Id;
    var summ2 = val.spell2Id;

    obj.idArray.push(val.summonerId);
    val.imageUrl = imgReference.data[champId].key;
    val.championName = imgReference.data[champId].name;
    val.summonerOneUrl = summonerReference.data[summ1].key;
    val.summonerTwoUrl = summonerReference.data[summ2].key;
  })

  obj.bannedChampions.forEach(function(val, index) {
    val.championUrl = imgReference.data[val.championId].key;
  })

}

exports.processSummonerChampionData = function(obj, champid) {
  return new Promise(function(resolve, reject) {
    if(!obj) {
      reject(obj);
    }

    var res = {};
    for(var i = 0; i < obj.champions.length; ++i) {
      var item = obj.champions[i];

      if(item.id !== 0) {
        if(champid == item.id) {
          res = item;
        }
        item.name = imgReference.data[item.id].key;
        item.fullName = imgReference.data[item.id].name;
        item.stats.winRate = (item.stats.totalSessionsWon / item.stats.totalSessionsPlayed * 100).toFixed(2);
      }
    }

    db.insertPlayerChampionStats(obj).then(function(data) {
      console.log('champ data insert success!');
    })
    .catch(function(err) {
      console.log('champ data insert failed', err);
    })

    resolve(res);
  })
}

exports.sortParticipantsByRole = function(par) {  //This function starts on successful data of cur game stats
  var makearry = {data: par};
  console.log('participants = ', makearry)
  return setRoles(par).then(function(roles) {
    roles = roles.map(function(val, ind) {
      return val.map(function(val) {
        return val.role;
      });
    })

    var sortedblue = [];
    var sortedred = [];

    roles.forEach(function(val, ind) {
      par[ind].roles = roles[ind];
      if(par[ind].teamId === 200) {
        sortedred.push(par[ind]);
      }
      else {
        sortedblue.push(par[ind]);
      }
    })

    sortedblue = checkTeam(sortedblue.slice());
    sortedred = checkTeam(sortedred.slice());
    ptsd = sortedblue.concat(sortedred);

    return ptsd;
  })
}

var setRoles = function(par) {
  return Promise.all(par.map(function(val) {
    return db.getRoles(val.championName);
  }))
}

// Sorts teams by role for matchup comparison champ gg
var checkTeam = function(team) {
  var roles = ['Top', 'Middle', 'Support', 'ADC', 'Jungle'];
  var rolePos = ['Jungle', 'ADC', 'Top', 'Support', 'Middle'];
  var sorted = [];
  var testRole = function(role, summoner) {
    if(team[i].roles.indexOf(role) !== -1 && (team[i].summonerOneUrl === summoner || team[i].summonerTwoUrl === summoner) && roles.indexOf(role) !== -1) {
      sorted[rolePos.indexOf(role)] = team[i];
      team.splice(i, 1);
      roles.splice(roles.indexOf(role), 1);
      return true
    }
    else {
      return false;
    }
  }

  for(var i = team.length - 1; i > 0; --i) {

      if(testRole('Jungle', 'SummonerSmite'));
      else if(team[i].roles.length === 1) {
        sorted[rolePos.indexOf(team[i].roles[0])] = team[i];
        roles.splice(roles.indexOf(team[i].roles[0]), 1);
        team.splice(i, 1);
      }
      else if(testRole('ADC', 'SummonerHeal'));
      else if(testRole('Top', 'SummonerTeleport'));
      else if(testRole('Support', 'SummonerExhaust'));
      else if(testRole('Middle', 'SummonerDot'));
      else if(testRole('Middle', 'SummonerBarrier'));
  }
  
  
  for(var j = 0; j < 4; ++j) {
    if(roles.length !== 0) {
      var last = roles.shift();
      if(sorted[rolePos.indexOf(last)] === undefined) {
        sorted[rolePos.indexOf(last)] = team.pop();
      }
    }
    if(!sorted[j] && team.length > 0) {
      sorted[j] = team.shift();
    }
  }


  return sorted;
}



var imgReference = { "data" : { "1" : { "id" : 1,
          "image" : { "full" : "Annie.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Annie",
          "name" : "Annie",
          "title" : "the Dark Child"
        },
      "10" : { "id" : 10,
          "image" : { "full" : "Kayle.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Kayle",
          "name" : "Kayle",
          "title" : "The Judicator"
        },
      "101" : { "id" : 101,
          "image" : { "full" : "Xerath.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Xerath",
          "name" : "Xerath",
          "title" : "the Magus Ascendant"
        },
      "102" : { "id" : 102,
          "image" : { "full" : "Shyvana.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Shyvana",
          "name" : "Shyvana",
          "title" : "the Half-Dragon"
        },
      "103" : { "id" : 103,
          "image" : { "full" : "Ahri.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Ahri",
          "name" : "Ahri",
          "title" : "the Nine-Tailed Fox"
        },
      "104" : { "id" : 104,
          "image" : { "full" : "Graves.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Graves",
          "name" : "Graves",
          "title" : "the Outlaw"
        },
      "105" : { "id" : 105,
          "image" : { "full" : "Fizz.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Fizz",
          "name" : "Fizz",
          "title" : "the Tidal Trickster"
        },
      "106" : { "id" : 106,
          "image" : { "full" : "Volibear.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Volibear",
          "name" : "Volibear",
          "title" : "the Thunder's Roar"
        },
      "107" : { "id" : 107,
          "image" : { "full" : "Rengar.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Rengar",
          "name" : "Rengar",
          "title" : "the Pridestalker"
        },
      "11" : { "id" : 11,
          "image" : { "full" : "MasterYi.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "MasterYi",
          "name" : "Master Yi",
          "title" : "the Wuju Bladesman"
        },
      "110" : { "id" : 110,
          "image" : { "full" : "Varus.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Varus",
          "name" : "Varus",
          "title" : "the Arrow of Retribution"
        },
      "111" : { "id" : 111,
          "image" : { "full" : "Nautilus.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Nautilus",
          "name" : "Nautilus",
          "title" : "the Titan of the Depths"
        },
      "112" : { "id" : 112,
          "image" : { "full" : "Viktor.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Viktor",
          "name" : "Viktor",
          "title" : "the Machine Herald"
        },
      "113" : { "id" : 113,
          "image" : { "full" : "Sejuani.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Sejuani",
          "name" : "Sejuani",
          "title" : "the Winter's Wrath"
        },
      "114" : { "id" : 114,
          "image" : { "full" : "Fiora.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Fiora",
          "name" : "Fiora",
          "title" : "the Grand Duelist"
        },
      "115" : { "id" : 115,
          "image" : { "full" : "Ziggs.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "Ziggs",
          "name" : "Ziggs",
          "title" : "the Hexplosives Expert"
        },
      "117" : { "id" : 117,
          "image" : { "full" : "Lulu.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Lulu",
          "name" : "Lulu",
          "title" : "the Fae Sorceress"
        },
      "119" : { "id" : 119,
          "image" : { "full" : "Draven.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Draven",
          "name" : "Draven",
          "title" : "the Glorious Executioner"
        },
      "12" : { "id" : 12,
          "image" : { "full" : "Alistar.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Alistar",
          "name" : "Alistar",
          "title" : "the Minotaur"
        },
      "120" : { "id" : 120,
          "image" : { "full" : "Hecarim.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Hecarim",
          "name" : "Hecarim",
          "title" : "the Shadow of War"
        },
      "121" : { "id" : 121,
          "image" : { "full" : "Khazix.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Khazix",
          "name" : "Kha'Zix",
          "title" : "the Voidreaver"
        },
      "122" : { "id" : 122,
          "image" : { "full" : "Darius.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Darius",
          "name" : "Darius",
          "title" : "the Hand of Noxus"
        },
      "126" : { "id" : 126,
          "image" : { "full" : "Jayce.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Jayce",
          "name" : "Jayce",
          "title" : "the Defender of Tomorrow"
        },
      "127" : { "id" : 127,
          "image" : { "full" : "Lissandra.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Lissandra",
          "name" : "Lissandra",
          "title" : "the Ice Witch"
        },
      "13" : { "id" : 13,
          "image" : { "full" : "Ryze.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Ryze",
          "name" : "Ryze",
          "title" : "the Rogue Mage"
        },
      "131" : { "id" : 131,
          "image" : { "full" : "Diana.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Diana",
          "name" : "Diana",
          "title" : "Scorn of the Moon"
        },
      "133" : { "id" : 133,
          "image" : { "full" : "Quinn.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Quinn",
          "name" : "Quinn",
          "title" : "Demacia's Wings"
        },
      "134" : { "id" : 134,
          "image" : { "full" : "Syndra.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Syndra",
          "name" : "Syndra",
          "title" : "the Dark Sovereign"
        },
      "136" : { "id" : 136,
          "image" : { "full" : "AurelionSol.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "AurelionSol",
          "name" : "Aurelion Sol",
          "title" : "The Star Forger"
        },
      "14" : { "id" : 14,
          "image" : { "full" : "Sion.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Sion",
          "name" : "Sion",
          "title" : "The Undead Juggernaut"
        },
      "143" : { "id" : 143,
          "image" : { "full" : "Zyra.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "Zyra",
          "name" : "Zyra",
          "title" : "Rise of the Thorns"
        },
      "15" : { "id" : 15,
          "image" : { "full" : "Sivir.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Sivir",
          "name" : "Sivir",
          "title" : "the Battle Mistress"
        },
      "150" : { "id" : 150,
          "image" : { "full" : "Gnar.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Gnar",
          "name" : "Gnar",
          "title" : "the Missing Link"
        },
      "154" : { "id" : 154,
          "image" : { "full" : "Zac.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Zac",
          "name" : "Zac",
          "title" : "the Secret Weapon"
        },
      "157" : { "id" : 157,
          "image" : { "full" : "Yasuo.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Yasuo",
          "name" : "Yasuo",
          "title" : "the Unforgiven"
        },
      "16" : { "id" : 16,
          "image" : { "full" : "Soraka.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Soraka",
          "name" : "Soraka",
          "title" : "the Starchild"
        },
      "161" : { "id" : 161,
          "image" : { "full" : "Velkoz.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Velkoz",
          "name" : "Vel'Koz",
          "title" : "the Eye of the Void"
        },
      "17" : { "id" : 17,
          "image" : { "full" : "Teemo.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Teemo",
          "name" : "Teemo",
          "title" : "the Swift Scout"
        },
      "18" : { "id" : 18,
          "image" : { "full" : "Tristana.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Tristana",
          "name" : "Tristana",
          "title" : "the Yordle Gunner"
        },
      "19" : { "id" : 19,
          "image" : { "full" : "Warwick.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Warwick",
          "name" : "Warwick",
          "title" : "the Blood Hunter"
        },
      "2" : { "id" : 2,
          "image" : { "full" : "Olaf.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Olaf",
          "name" : "Olaf",
          "title" : "the Berserker"
        },
      "20" : { "id" : 20,
          "image" : { "full" : "Nunu.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Nunu",
          "name" : "Nunu",
          "title" : "the Yeti Rider"
        },
      "201" : { "id" : 201,
          "image" : { "full" : "Braum.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Braum",
          "name" : "Braum",
          "title" : "the Heart of the Freljord"
        },
      "202" : { "id" : 202,
          "image" : { "full" : "Jhin.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "Jhin",
          "name" : "Jhin",
          "title" : "the Virtuoso"
        },
      "203" : { "id" : 203,
          "image" : { "full" : "Kindred.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "Kindred",
          "name" : "Kindred",
          "title" : "The Eternal Hunters"
        },
      "21" : { "id" : 21,
          "image" : { "full" : "MissFortune.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "MissFortune",
          "name" : "Miss Fortune",
          "title" : "the Bounty Hunter"
        },
      "22" : { "id" : 22,
          "image" : { "full" : "Ashe.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Ashe",
          "name" : "Ashe",
          "title" : "the Frost Archer"
        },
      "222" : { "id" : 222,
          "image" : { "full" : "Jinx.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Jinx",
          "name" : "Jinx",
          "title" : "the Loose Cannon"
        },
      "223" : { "id" : 223,
          "image" : { "full" : "TahmKench.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "TahmKench",
          "name" : "Tahm Kench",
          "title" : "the River King"
        },
      "23" : { "id" : 23,
          "image" : { "full" : "Tryndamere.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Tryndamere",
          "name" : "Tryndamere",
          "title" : "the Barbarian King"
        },
      "236" : { "id" : 236,
          "image" : { "full" : "Lucian.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Lucian",
          "name" : "Lucian",
          "title" : "the Purifier"
        },
      "238" : { "id" : 238,
          "image" : { "full" : "Zed.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Zed",
          "name" : "Zed",
          "title" : "the Master of Shadows"
        },
      "24" : { "id" : 24,
          "image" : { "full" : "Jax.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Jax",
          "name" : "Jax",
          "title" : "Grandmaster at Arms"
        },
      "245" : { "id" : 245,
          "image" : { "full" : "Ekko.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "Ekko",
          "name" : "Ekko",
          "title" : "the Boy Who Shattered Time"
        },
      "25" : { "id" : 25,
          "image" : { "full" : "Morgana.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Morgana",
          "name" : "Morgana",
          "title" : "Fallen Angel"
        },
      "254" : { "id" : 254,
          "image" : { "full" : "Vi.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Vi",
          "name" : "Vi",
          "title" : "the Piltover Enforcer"
        },
      "26" : { "id" : 26,
          "image" : { "full" : "Zilean.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "Zilean",
          "name" : "Zilean",
          "title" : "the Chronokeeper"
        },
      "266" : { "id" : 266,
          "image" : { "full" : "Aatrox.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Aatrox",
          "name" : "Aatrox",
          "title" : "the Darkin Blade"
        },
      "267" : { "id" : 267,
          "image" : { "full" : "Nami.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Nami",
          "name" : "Nami",
          "title" : "the Tidecaller"
        },
      "268" : { "id" : 268,
          "image" : { "full" : "Azir.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Azir",
          "name" : "Azir",
          "title" : "the Emperor of the Sands"
        },
      "27" : { "id" : 27,
          "image" : { "full" : "Singed.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Singed",
          "name" : "Singed",
          "title" : "the Mad Chemist"
        },
      "28" : { "id" : 28,
          "image" : { "full" : "Evelynn.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Evelynn",
          "name" : "Evelynn",
          "title" : "the Widowmaker"
        },
      "29" : { "id" : 29,
          "image" : { "full" : "Twitch.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Twitch",
          "name" : "Twitch",
          "title" : "the Plague Rat"
        },
      "3" : { "id" : 3,
          "image" : { "full" : "Galio.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Galio",
          "name" : "Galio",
          "title" : "the Sentinel's Sorrow"
        },
      "30" : { "id" : 30,
          "image" : { "full" : "Karthus.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Karthus",
          "name" : "Karthus",
          "title" : "the Deathsinger"
        },
      "31" : { "id" : 31,
          "image" : { "full" : "Chogath.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Chogath",
          "name" : "Cho'Gath",
          "title" : "the Terror of the Void"
        },
      "32" : { "id" : 32,
          "image" : { "full" : "Amumu.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Amumu",
          "name" : "Amumu",
          "title" : "the Sad Mummy"
        },
      "33" : { "id" : 33,
          "image" : { "full" : "Rammus.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Rammus",
          "name" : "Rammus",
          "title" : "the Armordillo"
        },
      "34" : { "id" : 34,
          "image" : { "full" : "Anivia.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Anivia",
          "name" : "Anivia",
          "title" : "the Cryophoenix"
        },
      "35" : { "id" : 35,
          "image" : { "full" : "Shaco.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Shaco",
          "name" : "Shaco",
          "title" : "the Demon Jester"
        },
      "36" : { "id" : 36,
          "image" : { "full" : "DrMundo.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "DrMundo",
          "name" : "Dr. Mundo",
          "title" : "the Madman of Zaun"
        },
      "37" : { "id" : 37,
          "image" : { "full" : "Sona.png",
              "group" : "champion",
              "sprite" : "champion3.png",
              "x" : 0
            },
          "key" : "Sona",
          "name" : "Sona",
          "title" : "Maven of the Strings"
        },
      "38" : { "id" : 38,
          "image" : { "full" : "Kassadin.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Kassadin",
          "name" : "Kassadin",
          "title" : "the Void Walker"
        },
      "39" : { "id" : 39,
          "image" : { "full" : "Irelia.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Irelia",
          "name" : "Irelia",
          "title" : "the Will of the Blades"
        },
      "4" : { "id" : 4,
          "image" : { "full" : "TwistedFate.png",
              "group" : "champion",
              "sprite" : "champion3.png",
              "x" : 48
            },
          "key" : "TwistedFate",
          "name" : "Twisted Fate",
          "title" : "the Card Master"
        },
      "40" : { "id" : 40,
          "image" : { "full" : "Janna.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Janna",
          "name" : "Janna",
          "title" : "the Storm's Fury"
        },
      "41" : { "id" : 41,
          "image" : { "full" : "Gangplank.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Gangplank",
          "name" : "Gangplank",
          "title" : "the Saltwater Scourge"
        },
      "412" : { "id" : 412,
          "image" : { "full" : "Thresh.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Thresh",
          "name" : "Thresh",
          "title" : "the Chain Warden"
        },
      "42" : { "id" : 42,
          "image" : { "full" : "Corki.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Corki",
          "name" : "Corki",
          "title" : "the Daring Bombardier"
        },
      "420" : { "id" : 420,
          "image" : { "full" : "Illaoi.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "Illaoi",
          "name" : "Illaoi",
          "title" : "the Kraken Priestess"
        },
      "421" : { "id" : 421,
          "image" : { "full" : "RekSai.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "RekSai",
          "name" : "Rek'Sai",
          "title" : "the Void Burrower"
        },
      "429" : { "id" : 429,
          "image" : { "full" : "Kalista.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Kalista",
          "name" : "Kalista",
          "title" : "the Spear of Vengeance"
        },
      "43" : { "id" : 43,
          "image" : { "full" : "Karma.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Karma",
          "name" : "Karma",
          "title" : "the Enlightened One"
        },
      "432" : { "id" : 432,
          "image" : { "full" : "Bard.png",
              "group" : "champion",
              "sprite" : "champion4.png"
            },
          "key" : "Bard",
          "name" : "Bard",
          "title" : "the Wandering Caretaker"
        },
      "44" : { "id" : 44,
          "image" : { "full" : "Taric.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Taric",
          "name" : "Taric",
          "title" : "the Gem Knight"
        },
      "45" : { "id" : 45,
          "image" : { "full" : "Veigar.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Veigar",
          "name" : "Veigar",
          "title" : "the Tiny Master of Evil"
        },
      "48" : { "id" : 48,
          "image" : { "full" : "Trundle.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Trundle",
          "name" : "Trundle",
          "title" : "the Troll King"
        },
      "5" : { "id" : 5,
          "image" : { "full" : "XinZhao.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "XinZhao",
          "name" : "Xin Zhao",
          "title" : "the Seneschal of Demacia"
        },
      "50" : { "id" : 50,
          "image" : { "full" : "Swain.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Swain",
          "name" : "Swain",
          "title" : "the Master Tactician"
        },
      "51" : { "id" : 51,
          "image" : { "full" : "Caitlyn.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Caitlyn",
          "name" : "Caitlyn",
          "title" : "the Sheriff of Piltover"
        },
      "53" : { "id" : 53,
          "image" : { "full" : "Blitzcrank.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Blitzcrank",
          "name" : "Blitzcrank",
          "title" : "the Great Steam Golem"
        },
      "54" : { "id" : 54,
          "image" : { "full" : "Malphite.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Malphite",
          "name" : "Malphite",
          "title" : "Shard of the Monolith"
        },
      "55" : { "id" : 55,
          "image" : { "full" : "Katarina.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Katarina",
          "name" : "Katarina",
          "title" : "the Sinister Blade"
        },
      "56" : { "id" : 56,
          "image" : { "full" : "Nocturne.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Nocturne",
          "name" : "Nocturne",
          "title" : "the Eternal Nightmare"
        },
      "57" : { "id" : 57,
          "image" : { "full" : "Maokai.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Maokai",
          "name" : "Maokai",
          "title" : "the Twisted Treant"
        },
      "58" : { "id" : 58,
          "image" : { "full" : "Renekton.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Renekton",
          "name" : "Renekton",
          "title" : "the Butcher of the Sands"
        },
      "59" : { "id" : 59,
          "image" : { "full" : "JarvanIV.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "JarvanIV",
          "name" : "Jarvan IV",
          "title" : "the Exemplar of Demacia"
        },
      "6" : { "id" : 6,
          "image" : { "full" : "Urgot.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Urgot",
          "name" : "Urgot",
          "title" : "the Headsman's Pride"
        },
      "60" : { "id" : 60,
          "image" : { "full" : "Elise.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Elise",
          "name" : "Elise",
          "title" : "the Spider Queen"
        },
      "61" : { "id" : 61,
          "image" : { "full" : "Orianna.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Orianna",
          "name" : "Orianna",
          "title" : "the Lady of Clockwork"
        },
      "62" : { "id" : 62,
          "image" : { "full" : "MonkeyKing.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "MonkeyKing",
          "name" : "Wukong",
          "title" : "the Monkey King"
        },
      "63" : { "id" : 63,
          "image" : { "full" : "Brand.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Brand",
          "name" : "Brand",
          "title" : "the Burning Vengeance"
        },
      "64" : { "id" : 64,
          "image" : { "full" : "LeeSin.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "LeeSin",
          "name" : "Lee Sin",
          "title" : "the Blind Monk"
        },
      "67" : { "id" : 67,
          "image" : { "full" : "Vayne.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Vayne",
          "name" : "Vayne",
          "title" : "the Night Hunter"
        },
      "68" : { "id" : 68,
          "image" : { "full" : "Rumble.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Rumble",
          "name" : "Rumble",
          "title" : "the Mechanized Menace"
        },
      "69" : { "id" : 69,
          "image" : { "full" : "Cassiopeia.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Cassiopeia",
          "name" : "Cassiopeia",
          "title" : "the Serpent's Embrace"
        },
      "7" : { "id" : 7,
          "image" : { "full" : "Leblanc.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Leblanc",
          "name" : "LeBlanc",
          "title" : "the Deceiver"
        },
      "72" : { "id" : 72,
          "image" : { "full" : "Skarner.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Skarner",
          "name" : "Skarner",
          "title" : "the Crystal Vanguard"
        },
      "74" : { "id" : 74,
          "image" : { "full" : "Heimerdinger.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Heimerdinger",
          "name" : "Heimerdinger",
          "title" : "the Revered Inventor"
        },
      "75" : { "id" : 75,
          "image" : { "full" : "Nasus.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Nasus",
          "name" : "Nasus",
          "title" : "the Curator of the Sands"
        },
      "76" : { "id" : 76,
          "image" : { "full" : "Nidalee.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Nidalee",
          "name" : "Nidalee",
          "title" : "the Bestial Huntress"
        },
      "77" : { "id" : 77,
          "image" : { "full" : "Udyr.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Udyr",
          "name" : "Udyr",
          "title" : "the Spirit Walker"
        },
      "78" : { "id" : 78,
          "image" : { "full" : "Poppy.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Poppy",
          "name" : "Poppy",
          "title" : "Keeper of the Hammer"
        },
      "79" : { "id" : 79,
          "image" : { "full" : "Gragas.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Gragas",
          "name" : "Gragas",
          "title" : "the Rabble Rouser"
        },
      "8" : { "id" : 8,
          "image" : { "full" : "Vladimir.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Vladimir",
          "name" : "Vladimir",
          "title" : "the Crimson Reaper"
        },
      "80" : { "id" : 80,
          "image" : { "full" : "Pantheon.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Pantheon",
          "name" : "Pantheon",
          "title" : "the Artisan of War"
        },
      "81" : { "id" : 81,
          "image" : { "full" : "Ezreal.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Ezreal",
          "name" : "Ezreal",
          "title" : "the Prodigal Explorer"
        },
      "82" : { "id" : 82,
          "image" : { "full" : "Mordekaiser.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Mordekaiser",
          "name" : "Mordekaiser",
          "title" : "the Iron Revenant"
        },
      "83" : { "id" : 83,
          "image" : { "full" : "Yorick.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Yorick",
          "name" : "Yorick",
          "title" : "the Gravedigger"
        },
      "84" : { "id" : 84,
          "image" : { "full" : "Akali.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Akali",
          "name" : "Akali",
          "title" : "the Fist of Shadow"
        },
      "85" : { "id" : 85,
          "image" : { "full" : "Kennen.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Kennen",
          "name" : "Kennen",
          "title" : "the Heart of the Tempest"
        },
      "86" : { "id" : 86,
          "image" : { "full" : "Garen.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "Garen",
          "name" : "Garen",
          "title" : "The Might of Demacia"
        },
      "89" : { "id" : 89,
          "image" : { "full" : "Leona.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Leona",
          "name" : "Leona",
          "title" : "the Radiant Dawn"
        },
      "9" : { "id" : 9,
          "image" : { "full" : "FiddleSticks.png",
              "group" : "champion",
              "sprite" : "champion0.png"
            },
          "key" : "FiddleSticks",
          "name" : "Fiddlesticks",
          "title" : "the Harbinger of Doom"
        },
      "90" : { "id" : 90,
          "image" : { "full" : "Malzahar.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Malzahar",
          "name" : "Malzahar",
          "title" : "the Prophet of the Void"
        },
      "91" : { "id" : 91,
          "image" : { "full" : "Talon.png",
              "group" : "champion",
              "sprite" : "champion3.png"
            },
          "key" : "Talon",
          "name" : "Talon",
          "title" : "the Blade's Shadow"
        },
      "92" : { "id" : 92,
          "image" : { "full" : "Riven.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Riven",
          "name" : "Riven",
          "title" : "the Exile"
        },
      "96" : { "id" : 96,
          "image" : { "full" : "KogMaw.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "KogMaw",
          "name" : "Kog'Maw",
          "title" : "the Mouth of the Abyss"
        },
      "98" : { "id" : 98,
          "image" : { "full" : "Shen.png",
              "group" : "champion",
              "sprite" : "champion2.png"
            },
          "key" : "Shen",
          "name" : "Shen",
          "title" : "the Eye of Twilight"
        },
      "99" : { "id" : 99,
          "image" : { "full" : "Lux.png",
              "group" : "champion",
              "sprite" : "champion1.png"
            },
          "key" : "Lux",
          "name" : "Lux",
          "title" : "the Lady of Luminosity"
        }
    },
  "type" : "champion",
  "version" : "6.6.1"
}

var summonerReference = {
   "data": {
      "21": {
         "id": 21,
         "description": "Shields your champion for 115-455 (depending on champion level) for 2 seconds.",
         "name": "Barrier",
         "key": "SummonerBarrier",
         "summonerLevel": 4
      },
      "3": {
         "id": 3,
         "description": "Exhausts target enemy champion, reducing their Movement Speed and Attack Speed by 30%, their Armor and Magic Resist by 10, and their damage dealt by 40% for 2.5 seconds.",
         "name": "Exhaust",
         "key": "SummonerExhaust",
         "summonerLevel": 4
      },
      "2": {
         "id": 2,
         "description": "Reveals a small area of the map for your team for 5 seconds.",
         "name": "Clairvoyance",
         "key": "SummonerClairvoyance",
         "summonerLevel": 8
      },
      "1": {
         "id": 1,
         "description": "Removes all disables and summoner spell debuffs affecting your champion and lowers the duration of incoming disables by 65% for 3 seconds.",
         "name": "Cleanse",
         "key": "SummonerBoost",
         "summonerLevel": 6
      },
      "7": {
         "id": 7,
         "description": "Restores 90-345 Health (depending on champion level) and grants 30% Movement Speed for 1 second to you and target allied champion. This healing is halved for units recently affected by Summoner Heal.",
         "name": "Heal",
         "key": "SummonerHeal",
         "summonerLevel": 1
      },
      "30": {
         "id": 30,
         "description": "Quickly travel to the Poro King's side.",
         "name": "To the King!",
         "key": "SummonerPoroRecall",
         "summonerLevel": 1
      },
      "6": {
         "id": 6,
         "description": "Your champion can move through units and has 27% increased Movement Speed for 10 seconds.",
         "name": "Ghost",
         "key": "SummonerHaste",
         "summonerLevel": 1
      },
      "32": {
         "id": 32,
         "description": "Throw a snowball in a straight line at your enemies. If it hits an enemy, they become marked and your champion can quickly travel to the marked target as a follow up.",
         "name": "Mark",
         "key": "SummonerSnowball",
         "summonerLevel": 1
      },
      "4": {
         "id": 4,
         "description": "Teleports your champion a short distance toward your cursor's location.",
         "name": "Flash",
         "key": "SummonerFlash",
         "summonerLevel": 8
      },
      "31": {
         "id": 31,
         "description": "Toss a Poro at your enemies. If it hits, you can quickly travel to your target as a follow up.",
         "name": "Poro Toss",
         "key": "SummonerPoroThrow",
         "summonerLevel": 1
      },
      "17": {
         "id": 17,
         "description": "Allied Turret: Grants massive regeneration for 8 seconds. Enemy Turret: Reduces damage dealt by 80% for 8 seconds.",
         "name": "Garrison",
         "key": "SummonerOdinGarrison",
         "summonerLevel": 1
      },
      "13": {
         "id": 13,
         "description": "Restores 40% of your champion's maximum Mana. Also restores allies for 40% of their maximum Mana.",
         "name": "Clarity",
         "key": "SummonerMana",
         "summonerLevel": 1
      },
      "14": {
         "id": 14,
         "description": "Ignites target enemy champion, dealing 70-410 true damage (depending on champion level) over 5 seconds, grants you vision of the target, and reduces healing effects on them for the duration.",
         "name": "Ignite",
         "key": "SummonerDot",
         "summonerLevel": 10
      },
      "11": {
         "id": 11,
         "description": "Deals 390-1000 true damage (depending on champion level) to target epic or large monster or enemy minion.",
         "name": "Smite",
         "key": "SummonerSmite",
         "summonerLevel": 10
      },
      "12": {
         "id": 12,
         "description": "After channeling for 3.5 seconds, teleports your champion to target allied structure, minion, or ward.",
         "name": "Teleport",
         "key": "SummonerTeleport",
         "summonerLevel": 6
      }
   },
   "type": "summoner",
   "version": "6.6.1"
}