var apiKey = "c81c75dd03cb0188beed09690c0dabfa-us3";
var async = require("async");
var express = require('express');
var app = express();
var http = require('http');
var request = require("request");
var mongoose = require("mongoose");
var util = require("util");
var fs = require("fs");

var mongooseUrl =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/MyDatabase';


mongoose.connect(mongooseUrl);
var db = mongoose.connection;
db.close()
API();
//listMembers({apikey: apikey, id:Fintech_Live});
var ids = [];
var Fintech_Live = 'f8ecf5625a'

var MailChimpAPI = require('mailchimp').MailChimpAPI
//listLists({apikey:apiKey, id:Fintech_Live});

/*
api.call('lists', 'activity', {id:Fintech_Live, start: 0, limit: 25 }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(data); // Do something with your data!
});*/


function API(){
    request({
      uri: 'https://us3.api.mailchimp.com/2.0/lists/list',
      method: "POST",

      body:JSON.stringify({apikey:apiKey}),

      },
        function(error, response, body){
      if (!error) {
        var objs = JSON.parse(body)
     for (obj in  objs.data){
      ids.push(objs.data[obj]['id'])

     }
      console.log(objs)
      //CampaignSubscriberActivity({'id':ids[0]})
      } else console.error(error);
        db.close();
    })
}

function listLists(args){

  var options = {
      uri:  'https://us3.api.mailchimp.com/2.0/list/lists/',
      method: "POST",
      body: JSON.stringify({
                             apikey:args.apikey,
                             id:args.id
                            })
      }

      var req = http.request(options, function(res) {
          console.log('STATUS: ' + res.statusCode);
          console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            });
      });


      var data = '';
      req.on('data', function(chunk){
        data += chunk;
      });
      req.on('end', function(){
        var obj = JSON.parse(data);
        console.log(obj);
      });

}
function listActivity(args){

      request({
      uri: 'https://us3.api.mailchimp.com/2.0/list/activity',
      method: "POST",

      body:JSON.stringify({apikey:apikey,
                          id: args.id
                        }),

      },
        function(error, response, body){
      if (!error) {
        console.log('no error')
        var objs = JSON.parse(body.data)
        console.log(objs);
    }
      else
        console.log(error);
    })

}

function listMembers(args){
     request({
      uri:  'https://us3.api.mailchimp.com/export/1.0/list/',
      method: "POST",
      body: JSON.stringify({
                             apikey:args.apikey,
                             id:args.id
                            })
      },
        function(error, response, body){
      if (!error ) {
        var members = body.split('\n')
          for ( i = 0; i < members.length ; i++){
            console.log(JSON.parse(members[i]));
          }
      }else console.error(error);

    })
}

function CampaignSubscriberActivity(args){

    request({
      uri:  'https://us3.api.mailchimp.com/export/1.0/campaignSubscriberActivity/',
      method: "POST",
      body: JSON.stringify({
                             apikey:apikey,
                             id:args.id
                            })
      },
        function(error, response, body){
      if (!error && response.statusCode == 200) {
        var actions = body.split('\n')

          for ( i = 0; i < actions.length ; i++){
            console.log(JSON.parse(actions[i]));
          }
      }else  console.error(error);

    })

}

/*
function SaveCompanies(data){
  Company.find(function(err, objs){

      var names = {};
        for (item in objs){
          names[objs[item]['name']] = true;
        }
            var filtered = data.filter(function(d){
              return (d['fields']['1021'] == true & names[d.name] != true)
                        || (d['fields']['1027'] == 9001 && names[d.name] != true)
                        ||  (d['fields']['1026'] == 9001 && names[d.name] != true);
            })

    async.each(filtered,
      // 2nd param is the function that each item is passed to
      function(datum, callback){
        // Call an asynchronous function, often a save() to DB
          var name = datum.name;
          var busDescription = datum['fields']['1005'];
          var founders = datum['fields']['1013'];
          var companyLocation = datum['fields']['1008'];
          var sector;
          var likes = 0;
          var dislikes = 0;
          var pipeline = "";
          var open_for_investment = false;
          var Portfolio = false;
          var WatchList = false;
                if (datum['fields']['1026'] == 9001){
                      Portfolio = true;
                  }
                if (datum['fields']['1027'] == 9001){
                      open_for_investment = true;
                  }
                 if (datum['fields']['1021'] == true){
                    WatchList = true;
                } else pipeline = "";


                if (datum['fields']["1022"] == "9001") {
                       sector = "Wealth Management";
                    }else if (datum['fields']["1022"] == "9002"){
                       sector = "Security and Identity";
                    }else if (datum.fields["1022"] == "9003"){
                       sector = "Insurance";
                    }else if (datum.fields["1022"] == "9004"){
                       sector = "Payments and Commerce";
                    }else if (datum.fields["1022"] == "9005"){
                       sector = "Banking";
                    }else if (datum.fields["1022"] == "9006"){
                        sector = "Capital Markets";
                    }else if (datum.fields["1022"] == "9007"){
                       sector = "Lending";
                    }else sector ="";
                    var temp = new Company({ name :name ,
                                 busDescription : busDescription ,
                                 founders : founders ,
                                 companyLocation: companyLocation ,
                                 sector: sector ,
                                 founders: founders,
                                 pipeline: pipeline,
                                 dislikes: 0,
                                 likes: 0,
                                 logoURL: CompanyLogoUrlsMap[name],
                                 open_for_investment: open_for_investment,
                                 portfolio: Portfolio,
                                 watchlist: WatchList });
                    temp.save(function(err, objs){
                         callback();
                    });
            },
      // 3rd param is the function to call when everything's done
      function(err){
        // All tasks are done now
        db.close();
      }
    );
  })
}
*/