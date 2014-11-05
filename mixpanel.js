mixpanel = require('mixpanel-node')

var api_key = '7ba20beca90647ec9c5764221202a100',
    api_secret = '00fbdaf5b56a72b070d76c3a3e84c9ae';

var mx = new mixpanel({
    api_key: api_key,
    api_secret: api_secret
});

mx.request(
    'segmentation',
    {
        'event': 'Login',
        'from_date': '2012-01-20',
        'to_date': '2014-11-01',
        'on': 'properties["last_name"]',
        'unit': 'day',
        'limit':50
    },
    function(error, data) {
        console.dir(Object.keys(data.data.values));
    }
);
