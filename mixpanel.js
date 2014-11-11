mixpanel = require('mixpanel-node')
var dotenv = require('dotenv')
dotenv.load()

var api_key = process.env.MIX_APIKEY,
    api_secret = process.env.MIX_SECRET;

var mx = new mixpanel({
    api_key: api_key,
    api_secret: api_secret
});

mx.request(
    'segmentation', {
        'event': 'Login',
        'from_date': '2012-01-20',
        'to_date': '2014-11-01',
        'on': 'properties["last_name"]',
        'unit': 'day',
        'limit': 50
    },
    function(error, data) {
        console.dir(Object.keys(data.data.values));
    }
);