var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./api/database');
var session = require('express-session');
var Brute = require('./api/middleware/bruteforce');

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

//Routers
var RiotRouter = require('./routes/riotroutes.js');
var TwitchRouter = require('./routes/twitchroutes.js');

//Fowarding from EXPRESS <-- NGINX <-- CF <-- Load Balancing IP <--- INTERNET

app.use(function(req, res, next) {
	req.locals = {};
	req.locals.store = store;
	next();
})

if(process.env.ENV === 'production') {
	console.log('ENV=production, Serving from Dist Folder!');
	app.use('/', express.static('dist'));
}
else {
	app.use('/', express.static('client'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3005, function() {
	console.log('Server Started!');
});

app.use('/riot/', RiotRouter, Brute);  //Rate limit global riot api
app.use('/twitch/', TwitchRouter);
