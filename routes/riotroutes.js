var express = require('express');
var router = express.Router();
var Logic = require('./api/middleware/serverlogic');
var ChampGG = require('./api/championgg');
var Riot = require('./api/riot');

router.get('/initialgamedata', function(req, res) {
  Logic.getSummonerGame(req.query.name).then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.send(err);
  })

});

router.get('/summonerchampionstats', function(req, res) {
  Riot.getSummonerChampionStats(req.query.id, req.query.champid).then(function(champdata) {
    res.send(champdata);
  })
  .catch(function(err) {
    res.send(err);
  })

});

router.get('/api/championstaticdata', function(req, res) {
  Logic.getStaticAll(req.query.champNames).then(function(results) {
    res.send(results);
  })
  .catch(function(err) {
    res.send(err);
  })

});

router.get('/riot/summonerleaguedata', function(req, res) {
  Riot.getSummonerLeagueData(req.query.ids).then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.send(err);
  })

});

router.get('/api/champmatchupdatagg', function(req, res) {
  ChampGG.getChampionMatchupData(req.query.name1, req.query.name2).then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.send(err);
  })

});


router.get('/riot/getsummrecentgames', function(req, res) {
  Riot.getRecentGames(req.query.id).then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.send(err);
  })

});

router.get('/riot/ddversion', function(req, res) { //Riot static data api, doesn't count toward rate limit.
  Riot.getDDVersion().then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.send(err);
  })

});

module.exports = router;