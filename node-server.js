var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Riot = require('./api/riot');
var db = require('./api/database');

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 3005, function() {
	console.log('Server Started!');
});

app.get('/api/initialgamedata', function(req, res) {
	db.getPlayerId(req.query.name).then(function(summoner) {
		//console.log('should have found player in db here, summoner: ', summoner)
		return summoner;
	})
	.then(function(summoner) {
		Riot.getCurrentGame(summoner[req.query.name].id).then(function(gamedata) {
			//console.log('looked up summoner from cached name. should not say performing api blah');
			res.send(gamedata);
		})
		.catch(function(err) {
			res.send('Summoner not In Game!');
		})	
	})
	.catch(function(err) {
		//console.log('summoner was not in db!, performing api lookup!')
		Riot.getSummonerID(req.query.name)
		.then(function(idObj) {
			return idObj;
		})
		.then(function(obj) {
			return Riot.getCurrentGame(obj[req.query.name].id);
		})
		.then(function(data) {
			res.send(data);
		})
		.catch(function(err) {
			res.send('Summoner is not Currently in a Game or Summoner Name does not Exist!');
		})
	})

});

app.get('/api/summonerchampionstats', function(req, res) {
	Riot.getSummonerChampionStats(req.query.id, req.query.champid).then(function(champdata) {
		res.send(champdata);
	})
	.catch(function(err) {
		console.log('champ stats error!!!', err);
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




