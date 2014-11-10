var dotenv = require('dotenv')


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


var updateDB = function(db) {


    Campaign.remove({}, function(err) {
        //console.log('collection removed') 
    });


    var apiKey = process.env.MC_APIKEY;
    var Fintech_Live = process.env.MC_FINTECH_LIVE
    try {
        var api = new MailChimpAPI(apiKey, {
            version: '2.0'
        });
    } catch (error) {
        // console.log(error.message);
    }

    try {
        var exportApi = new MailChimpExportAPI(apiKey, {
            version: '1.0',
            secure: false
        });
    } catch (error) {
        //console.log(error.message);
    }


    api.call('campaigns', 'list', {
        id: Fintech_Live,
        filters: {
            subject: "Curated News with Context"
        }
    }, function(error, campaigns) {
        if (error) {
            //  console.log(error.message);
        } else {
            var _series = []
            for (var i in campaigns.data) {
                var campaign = campaigns.data[i];
                var _temp = campaignSubscriberFactory(campaign)
                _series.push(_temp)

            }

            async.series(_series, function(err, results) {
                //  console.log("sync complete");

            })
        }
    });


    function campaignSubscriberFactory(camp) {
        var campaign = camp
        var temp = function(callback) {
            //console.log(campaign.title)
            // creates function to run in series for mailchimp export api...
            exportApi.campaignSubscriberActivity({
                id: campaign['id']
            }, function(error, data) {
                if (error) {
                    console.log(campaign.title + ' was not saved.')
                    callback(null, {})
                } else {
                    var JSON = data
                    cleanActions(JSON, function(err, actions) {
                        campaign.activity = actions;
                        // console.log(JSON)
                        new Campaign(campaign).save(function(err) {
                            if (err) {
                                // console.log(err)
                                callback(new Error('unable to save campaign'), null)
                            } else {
                                console.log(campaign.title + ' was saved.')
                                callback(null, campaign)
                            };
                        })
                    });
                }
            })
        }

        return temp;
    }

    function cleanActions(actions, callback) {

        if (typeof callback != 'function') {
            callback(new Error("callback needs to be a function"))
        } else if (actions.length === 0) {
            callback(new Error("actions is empty"))
        }

        var cleaned = []
        for (var user in actions) {
            var email = Object.keys(actions[user])[0]
            cleaned.push({
                user: email,
                actions: actions[user][email]
            })
        }
        callback(null, cleaned);
    }
}


exports.updateDB = updateDB