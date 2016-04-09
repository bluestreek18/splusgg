var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Riot = require('./api/riot');
var db = require('./api/database');
var Logic = require('./api/serverlogic');
var ChampGG = require('./api/championgg');

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 3005, function() {
	console.log('Server Started!');
});

app.get('/api/initialgamedata', function(req, res) {
	Logic.getSummonerGame(req.query.name).then(function(data) {
		// console.log('api init data = ', data)
		res.send(data);
	})
	.catch(function(err) {
		// console.log('api/inital err! ', err)
		res.send(err);
	})

});

app.get('/api/summonerchampionstats', function(req, res) {
	Riot.getSummonerChampionStats(req.query.id, req.query.champid).then(function(champdata) {
		res.send(champdata);
	})
	.catch(function(err) {
		res.send(err);
	})

});

app.get('/api/championstaticdata', function(req, res) {
	Logic.getStaticAll(req.query.champNames).then(function(results) {
		res.send(results);
	})
	.catch(function(err) {
		res.send(err);
	})

});

app.get('/api/summonerleaguedata', function(req, res) {
	Riot.getSummonerLeagueData(req.query.ids).then(function(data) {
		res.send(data);
	})
	.catch(function(err) {
		res.send(err);
	})

});

app.get('/api/champmatchupdatagg', function(req, res) {
	ChampGG.getChampionMatchupData(req.query.name1, req.query.name2).then(function(data) {
		res.send(data);
	})
	.catch(function(err) {
		res.send(err);
	})

});

