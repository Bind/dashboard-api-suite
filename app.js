var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util')


var routes = require('./routes/index');
var users = require('./routes/users');
var mongoose = require("mongoose");

//Google Analytics
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;


var keys = {
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "client_secret": "Sg5sd8e85yHa4GuvfXWi9Yh3",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "client_email": "262064356985-5b8pfr5momtblimtvbjobgb138e67qas@developer.gserviceaccount.com",
    "redirect_uris": ["http://localhost:3000/google,"],
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/262064356985-5b8pfr5momtblimtvbjobgb138e67qas@developer.gserviceaccount.com",
    "client_id": "262064356985-5b8pfr5momtblimtvbjobgb138e67qas.apps.googleusercontent.com",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}

var CLIENT_ID = keys['client_email'];
var CLIENT_SECRET = keys['client_secret']
var REDIRECT_URL = keys['redirect_uris']

var oauth2Client = new OAuth2(CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL)

var scopes = ['https://www.googleapis.com/auth/analytics']
var url = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: scopes
})


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
updateCampaigns(db)

var app = express();
var apiKey = "c81c75dd03cb0188beed09690c0dabfa-us3";
var Fintech_Live = 'f8eef5625a'
try {
    var api = new MailChimpAPI(apiKey, {
        version: '2.0'
    });
} catch (error) {
    console.log(error.message);
}

try {
    var exportApi = new MailChimpExportAPI(apiKey, {
        version: '1.0',
        secure: false
    });
} catch (error) {
    console.log(error.message);
}

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

app.get('/google', function(req, res) {

    res.render('google', {
        'title': "DashBoard",
        data: [{
            'label': 'new',
            'value': 4574
        }, {
            'label': 'returning',
            'value': 1802
        }]
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