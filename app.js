//load env vars
var dotenv = require('dotenv')
dotenv.load();


var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util')
var async = require('async')

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoose = require("mongoose");

var google = {};
google.analytics = require("./google").analytics;

//Mailchimp
var MailChimpExportAPI = require('mailchimp').MailChimpExportAPI
var MailChimpAPI = require('mailchimp').MailChimpAPI
var CampaignSchema = require('./models/campaign').Campaign


var mongooseUrl =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/MyDatabase';


var updateCampaigns = require('./generatedb').updateDB


mongoose.connect(mongooseUrl);
var db = mongoose.connection;

setInterval(updateCampaigns, 120000, db);

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth', function(req, res) {
    res.redirect(url)
})

app.get('/', function(req, res) {

    async.parallel({

            analytics: function(callback) {
                google.analytics.getData(function(err, data) {
                    callback(err, data)
                })
            },
            summary: function(callback) {
                CampaignSchema.Summary(function(err, data) {
                    callback(err, data)
                })
            }
        },
        function(err, results) {
            res.render('summary', {
                'title': "DashBoard",
                'data': results
            })
        })
})


app.get('/mailchimp', function(req, res) {

    CampaignSchema.find({}, function(error, objs) {
        var data = [];
        objs.filter(function(el, ind, arr) {
            data.push(el.serve());
        })
        res.render('mailchimp', {
            title: "DashBoard",
            data: data
        })

    })
})

app.get

app.use('/users', users);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
console.log("app listenting on port:" + app.get('port'))
app.listen(app.get('port'));