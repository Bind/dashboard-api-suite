var dotenv = require('dotenv');
var async = require('async')
dotenv.load()
var util = require('util');
var d3 = require('d3');
/*
 ** Need Error Handling for each pyublic Call
 
IF you add another site, be sure to configure permissions on Google Analytics;


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
            _callback(err, res, body);
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

    var platformSessionsOverTime = function(callback) {
        return publicCall('https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A89836167&dimensions=ga%3AsessionCount%2Cga%3Adate&metrics=ga%3Asessions&start-date=2014-03-24&end-date=2014-11-13&max-results=1000',
            callback)
    }


    var platformGetData = function(callback) {
        async.parallel([
            function(cb) {
                platformSessionsOverTime(function(err, res, body) {
                    try {
                        var data = JSON.parse(body).rows;
                        var _data = [];
                        for (var row in data) {
                            _data.push({
                                timestamp: data[row][1],
                                total: data[row][0]
                            })
                        }
                        _data.sort(function(curr, prev) {
                            var format = d3.time.format('%Y%m%d')
                            return format.parse(curr.timestamp).getTime() - format.parse(prev.timestamp).getTime()
                        })

                    } finally {
                        cb(null, {
                            'sessionsOverTime': _data
                        });
                    }
                })

            },

        ], function(err, results) {
            var _results = {};

            for (var dict in results) {
                var key = Object.keys(results[dict])[0]
                _results[key] = results[dict][key]
            }
            //console.log(_results)
            try {
                callback(err, _results)
            } catch (e) {
                callback(new Error('Platform JSON received was not parseable'), _results)
            }
        })

    }


    var splashGetData = function(callback) {
        return async.parallel([

                function(cb) {
                    pagesPerSession(function(err, res, body) {
                        var data = JSON.parse(body).rows
                        var _data = [];
                        for (var row in data) {
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
                        try {
                            var data = JSON.parse(body).rows

                            var _data = []
                            for (var row in data) {
                                _data.push({
                                    timestamp: data[row][0],
                                    total: data[row][1]
                                })
                            }

                        } finally {
                            cb(null, {
                                'sessionsOverTime': _data
                            });
                        }
                    })
                }
            ],
            function(err, results) {
                //console.log(results)
                /*console.log(util.inspect(results, {
                    showHidden: true,
                    depth: null
                }))*/
                //#This removes the encapsulating array

                var _results = {};
                for (var dict in results) {
                    var key = Object.keys(results[dict])[0]
                    _results[key] = results[dict][key]
                }
                //console.log(_results)
                callback(null, _results)


            })


    }

    return {
        makeCall: publicCall,
        sessionsByRegion: sessionsByRegion,
        sessionsNewVersusReturning: sessionsNewVersusReturning,
        sessionsNewVersusReturningOT: sessionsNewVersusReturningOT,
        splashGetData: splashGetData,
        platformGetData: platformGetData,
        pagesPerSession: pagesPerSession
    };


})();


exports.analytics = Analytics