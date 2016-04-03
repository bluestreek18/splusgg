var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Riot = require('./api/riot');
var db = require('./api/database');
var Logic = require('./api/serverlogic');

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 3005, function() {
	console.log('Server Started!');
});

app.get('/api/initialgamedata', function(req, res) {
	Logic.getGameSummoner(req.query.name).then(function(data) {
		res.send(data);
	})
	.catch(function(err) {
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
	db.getOverallChampionStats(req.query.champName).then(function(statdata) {
		res.send(statdata);
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

