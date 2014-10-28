var apikey = "282615aea4074ad6814221427b6cf222";
var async = require("async");
var express = require('express');
var app = express();
var http = require('http');
var request = require("request");
var mongoose = require("mongoose");
var CampaignSchema = require('./models/campaign').Campaign


var mongooseUrl =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/MyDatabase';

mongoose.connect(mongooseUrl);
var db = mongoose.connection;

CampaignSchema.find(function(error, objs){
		for (item in objs){
		console.log(objs[item].title)
	}
	db.close()
})