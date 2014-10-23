var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util')

var routes = require('./routes/index');
var users = require('./routes/users');

var MailChimpExportAPI = require('mailchimp').MailChimpExportAPI
var MailChimpAPI = require('mailchimp').MailChimpAPI


var app = express();
var apiKey = "c81c75dd03cb0188beed09690c0dabfa-us3";
var Fintech_Live = 'f8eef5625a'
try {
    var api = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}

try {
    var exportApi = new MailChimpExportAPI(apiKey, { version : '1.0', secure: false });
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


app.use('/', function(req,res ){

api.call('campaigns', 'list', { list_id: Fintech_Live, start: 0, limit: 25 }, function (error, data) {
    if (error)
        console.log(error);
    else{
       // console.log(data); // Do something with your data!
       res.render('index',{title: "DashBoard", data: data.data})

       /*var campaign = data.data[0];

            exportApi.campaignSubscriberActivity({ id: campaign['id']  }, function (error, data) {
                    if (error)
                        console.log(error.message);
                    else{
                        var JSON = {}
                            for (obj in data){
                              //  console.log(data[obj])
                                var email = Object.keys(data[obj])[0]
                               // console.log(email)
                                for (action in data[obj][email]){
                                    var hash = data[obj][email][action].timestamp + '_' + email
                                    data[obj][email][action].user = email;
                                    JSON[hash] = data[obj][email][action]
                                }
                            }
                           // console.log(JSON[Object.keys(JSON)[0]])
                            console.log(util.inspect(campaign, false, null))

                            campaign.actions = JSON;
                            res.render('index',{title: "DashBoard", data: data.data})
                    }

            })//*/

        }
    });


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

app.listen(app.get('port'));
