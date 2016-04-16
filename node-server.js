var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Riot = require('./api/riot');
var db = require('./api/database');
var Logic = require('./api/middleware/serverlogic');
var RateSessionCheck = require('./api/middleware/sessioncheck');
var ChampGG = require('./api/championgg');
var session = require('express-session');
var Brute = require('./api/middleware/bruteforce');
var RiotRouter = express.Router();

app.enable('trust proxy');
app.disable('x-powered-by');

var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/splusgg',
  collection: 'sessions'
});

store.on('error', function(error) {
  console.log('mstore error!', error);
});

app.use(session({
	name: 'sgg',
	secret: 'supersecretysecret45',
	cookie: { secure: 'auto' },
	store: store
}));

//Fowarding from EXPRESS <-- NGINX <-- CF <-- INTERNET

app.use(function(req, res, next) {
	req.locals = {};
	req.locals.store = store;
	next();
})

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3005, function() {
	console.log('Server Started!');
});

app.use('/riot/', RiotRouter, Brute);  //Rate limit global riot api


app.get('/riot/initialgamedata', RateSessionCheck, function(req, res) {
	Logic.getSummonerGame(req.query.name).then(function(data) {
		res.send(data);
	})
	.catch(function(err) {
		res.send(err);
	})

});

app.get('/riot/summonerchampionstats', RateSessionCheck, function(req, res) {
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

app.get('/riot/summonerleaguedata', RateSessionCheck, function(req, res) {
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

