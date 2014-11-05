var request = require('google-oauth-jwt').requestWithJWT();

request({
url : ""
	,
	jwt: {
		email:'262064356985-32o14n1rrqtfie7uahoj8hoisr4p323r@developer.gserviceaccount.com',
		keyFile:'gooleapi-key.pem',
		scopes:['https://www.googleapis.com/auth/analytics.readonly']}
	}, function(err, res, body){
		console.log(err)
		console.log(JSON.parse(body))
	})

