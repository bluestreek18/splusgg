var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Riot = require('./api/riot');
var db = require('./api/database');
var Logic = require('./api/serverlogic');
var ChampGG = require('./api/championgg');
var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({ 
  uri: 'mongodb://localhost:27017/splusgg',
  collection: 'sessions'
});

store.on('error', function(error) {
  console.log('mstore error!', error);
});

//Fowarding from EXPRESS <-- NGINX <-- CF <-- INTERNET
app.enable('trust proxy');

app.use(session({
	secret: 'supersecretysecret',
	proxy: true,
	cookie: {secure:true},
	store: store
}));

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 3005, function() {
	console.log('Server Started!');
});


app.get('/api/initialgamedata', function(req, res) {


	//test
	store.get(req.sessionID + '5', function(error, sess) {
	  console.log('checking if session in store! = ', sess);
	  console.log('check if sess has error = ', error);
	})
	var ref = req.get('Referrer');
	console.log('referrer = ', ref);
	console.log('session', req.session);
	console.log('session id = ', req.sessionID);
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log('ip = ', ip);
	/////


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

