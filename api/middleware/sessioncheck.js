var geoip = require('geoip-lite');


module.exports = function(req, res, next) {
	var ref = req.get('Referrer');
	if(ref) {
		ref = ref.slice(0, 16) === 'https://splus.gg';
	} else {
		ref = false;
	}

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var userAgent = req.headers['user-agent'];
	var geo = geoip.lookup(ip);

	req.locals.store.get(req.sessionID, function(error, sess) {
		console.log('referrer = ', ref);
		console.log('cookie = ', sess.cookie.secure);
		console.log('geo = ', geo);
		console.log('ip = ', ip);
		console.log('userAgent = ', userAgent);

		if(sess.cookie && sess.cookie.secure === true && ref && geo.country === 'US' && userAgent) {
			next();
		} else {
			res.status(401).send('UnAuthorized');
		}
	})
}


