mixpanel = require('mixpanel-node')
var dotenv = require('dotenv')
dotenv.load()


var d3 = require('d3');

var clipTimeDay = function(_time, format, _format) {
    /*
    the date string in _time
    a string of d3.js timestamp formatting for format
    */
    var format = d3.time.format(format)
    var current = format.parse(_time).getTime()
    current -= current % (86400000);
    var newFormat = d3.time.format(_format)
    return newFormat(new Date(current))
}


var util = require('util')

var Mixpanel = (function() {

    var invest = new mixpanel({
        api_key: process.env.MIX_INVEST_APIKEY,
        api_secret: process.env.MIX_INVEST_SECRET
    })
    var splash = new mixpanel({
        api_key: process.env.MIX_SPLASH_APIKEY,
        api_secret: process.env.MIX_SPLASH_SECRET
    })
    var NewsletterConversion = function(cb) {
        return splash.request('funnels', {
            funnel_id: '853743',
            from_date: '2014-01-20',
            to_date: '2014-11-01',

        }, function(error, body) {
            try {
                cb(error, body.data);
            } catch (e) {
                cb(new Error('JSON from MixPanel isnt valid'), {})
            }
        })
    };

    var SignUpRate = function(cb) {
        return NewsletterConversion(function(error, data) {
            var dates = Object.keys(data);
            var _data = []
            for (var temp in dates) {
                var date = dates[temp]

                var _total = 0;
                if (data[date].analysis.starting_amount != 0) {
                    _total = (data[date].analysis.completion / data[date].analysis.starting_amount) * 100
                }
                _data.push({
                    timestamp: clipTimeDay(date, '%Y-%m-%d', '%Y%m%d'),
                    total: _total
                })

            }

            _data.sort(function(curr, prev) {
                var format = d3.time.format('%Y%m%d')
                return format.parse(curr.timestamp).getTime() - format.parse(prev.timestamp).getTime()
            })
            cb(error, _data)


        })
    }


    return {
        NewsletterConversion: NewsletterConversion,
        SignUpRate: SignUpRate
    }
})();

exports.mixpanel = Mixpanel