var dotenv = require('dotenv');
var async = require('async')
dotenv.load()
var util = require('util')

/*
 ** Need Error Handling for each pyublic Call
 
 */

var request = require('google-oauth-jwt').requestWithJWT();

var Analytics = (function() {
    //private variables
    var email = process.env.GA_SERVER_EMAIL
    var keyFile = process.env.GA_PEMKEY_PATH
    var scopes = process.env.GA_SCOPES

    var publicCall = function(query_url, _callback) {
        request({
            url: query_url,
            jwt: {
                email: email,
                keyFile: keyFile,
                scopes: [scopes]
            }
        }, function(err, res, body) {
            return _callback(err, res, body);
        })
    }

    var sessionsByRegion = function(callback) {
        return publicCall("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A82842165&dimensions=ga%3Acountry%2Cga%3Aregion&metrics=ga%3Asessions&sort=-ga%3Asessions&start-date=2014-10-21&end-date=2014-11-04&max-results=50",
            callback)

    }

    var sessionsNewVersusReturning = function(callback) {
        return publicCall("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A82842165&dimensions=ga%3AuserType&metrics=ga%3Asessions&start-date=2014-10-21&end-date=2014-11-04&max-results=50",
            callback
        )
    }
    var sessionsNewVersusReturningOT = function(callback) {
        return publicCall("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A82842165&dimensions=ga%3Adate&metrics=ga%3AnewUsers%2Cga%3Asessions&start-date=2014-01-24&end-date=2014-11-07&max-results=5000",
            callback
        )

        //[date, new, total sessiosn]
    }
    var pagesPerSession = function(callback) {
        return publicCall('https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A82842165&dimensions=ga%3Adate&metrics=ga%3Asessions%2Cga%3Apageviews&start-date=2014-03-24&end-date=2014-11-11&max-results=1000',
            callback)
    }

    var getData = function(callback) {
        return async.parallel([

                function(cb) {
                    pagesPerSession(function(err, res, body) {
                        var data = JSON.parse(body).rows
                        var _data = [];
                        for (var row in data) {
                            console.log(data[row])
                            var pagespersession = 0;
                            if (data[row][1] != 0) {
                                pagespersession = (parseInt(data[row][2]) / parseInt(data[row][1]))
                            }
                            _data.push({
                                timestamp: data[row][0],
                                total: pagespersession
                            })
                        }
                        cb(null, {
                            'pagesPerSession': _data
                        });

                    })
                },

                function(cb) {
                    sessionsNewVersusReturningOT(function(err, res, body) {
                        var data = JSON.parse(body).rows
                        var _data = []
                        for (row in data) {
                            _data.push({
                                timestamp: data[row][0],
                                total: data[row][1]
                            })
                        }
                        cb(null, {
                            'sessionsOverTime': _data
                        });
                    })
                }
            ],
            function(err, results) {
                //console.log(results)
                //console.log(util.inspect(results))
                var _results = {};
                for (var dict in results) {
                    var key = Object.keys(results[dict])[0]
                    _results[key] = results[dict][key]
                }
                //console.log(_results)
                try {
                    callback(err, JSON.parse(_results))
                } catch (e) {
                    callback(new Error('JSON received was not parseable'), _results)
                }

            })


    }

    return {
        makeCall: publicCall,
        sessionsByRegion: sessionsByRegion,
        sessionsNewVersusReturning: sessionsNewVersusReturning,
        sessionsNewVersusReturningOT: sessionsNewVersusReturningOT,
        getData: getData,
        pagesPerSession: pagesPerSession
    };


})();


exports.analytics = Analytics