var apiKey = "c81c75dd03cb0188beed09690c0dabfa-us3";
var async = require("async");
var express = require('express');
var app = express();
var http = require('http');
var request = require("request");
var mongoose = require("mongoose");
var util = require("util");
var fs = require("fs");
var Campaign = require('./models/campaign').Campaign


var mongooseUrl =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/MyDatabase';

var MailChimpExportAPI = require('mailchimp').MailChimpExportAPI
var MailChimpAPI = require('mailchimp').MailChimpAPI

mongoose.connect(mongooseUrl);
var db = mongoose.connection;
db.close()

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


api.call('campaigns', 'list', {id:Fintech_Live,  }, function (error, campaigns) {
    if (error)
        console.log(error.message);
    else
      // console.log(campaigns.data[0]); // Do something with your data!

    var _series = []
      for (var i in campaigns.data){
       // console.log(util.inspect(i))
        var campaign = campaigns.data[i];

        var temp = function(callback){
            // creates function to run in series for mailchimp export api...
              exportApi.campaignSubscriberActivity({ id: campaign['id']  }, function (error, data) {
                    if (error)
                        console.log(error.message);
                    else{
                        var JSON = data
                            for (obj in data){
                               //console.log(data[obj])
                            }
                           // console.log(JSON[Object.keys(JSON)[0]])
                            //console.log(util.inspect(campaign, false, null))
                        }
                        campaign.activity = JSON
                        callback(null, campaign)
                    })
                }.bind(campaign)
            _series.push(temp)
          }

    async.series(_series,function(err, results){

        console.log(util.inspect(results[0], false , null));
        })


});
