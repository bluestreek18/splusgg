var db = require('./database');
var imgRef = require('./staticdata').imgRef;
var sRef = require('./staticdata').sRef;


exports.addImageData = function(obj) {
  obj.idArray = [];

	obj.participants.forEach(function(val, index) {
    var champId = val.championId;
    var summ1 = val.spell1Id;
    var summ2 = val.spell2Id;

    obj.idArray.push(val.summonerId);
    val.imageUrl = imgRef.data[champId].key;
    val.championName = imgRef.data[champId].name;
    val.summonerOneUrl = sRef.data[summ1].key;
    val.summonerTwoUrl = sRef.data[summ2].key;
  })

  obj.bannedChampions.forEach(function(val, index) {
    val.championUrl = imgRef.data[val.championId].key;
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

        item.name = imgRef.data[item.id].key;
        item.fullName = imgRef.data[item.id].name;
        item.stats.winRate = (item.stats.totalSessionsWon / item.stats.totalSessionsPlayed * 100).toFixed(2);
      }
    }

    db.insertPlayerChampionStats(obj).then(function(data) {
      //console.log('champ data insert success!', data);
    })
    .catch(function(err) {
      console.log('champ data insert failed', err);
    })

    resolve(res);
  })
}

exports.sortParticipantsByRole = function(par) {  //This function starts on successful data of cur game stats
  return setRoles(par).then(function(roles) {
    roles = roles.map(function(val, ind) {
      return val.map(function(val) {
        return val.role;
      });
    })

console.log('ROLES', roles);
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

    console.log('roles & etc: ', sortedblue, sortedred)


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
  var limit = 0;

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
  
  var findJungler = function() {
    debugger
    ++limit;
    for(var j = team.length - 1; i > 0; --j) {
      if(team[j].summonerOneUrl === 'SummonerSmite' || team[j].summonerTwoUrl === 'SummonerSmite') {
        sorted[rolePos.indexOf('Jungle')] = team[j];
        team.splice(j, 1);
        roles.splice(roles.indexOf('Jungle'), 1);
        i = i - 1;
        return true;
      }
    }
  }

  for(var i = team.length - 1; i > 0; --i) {
    if(limit < 20 && roles.indexOf('Jungle') !== -1) {
      findJungler();
    }
    if(limit < 20 && roles.indexOf('ADC') !== -1) {
      team.forEach(function() {
        var bool = testRole('ADC', 'SummonerHeal');
        if(bool) {
          i = i - 1;
        }
      })
    }

      if(testRole('Support', 'SummonerExhaust'));
      else if(testRole('Top', 'SummonerTeleport'));
      else if(team[i].roles.length === 1 && sorted[rolePos.indexOf(team[i].roles[0])] === undefined) {
        sorted[rolePos.indexOf(team[i].roles[0])] = team[i];
        roles.splice(roles.indexOf(team[i].roles[0]), 1);
        team.splice(i, 1);
      }

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


