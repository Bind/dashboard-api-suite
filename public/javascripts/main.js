

var init = function(){
    console.log(topArticles( MostRecentCampaign(CAMPAIGNS).Clicks))
    console.log(topOpeners(MostRecentCampaign(CAMPAIGNS).Opens))
    Openers(topOpeners(MostRecentCampaign(CAMPAIGNS).Opens))
    Clickers( topArticles( MostRecentCampaign(CAMPAIGNS).Clicks))
    console.log(opensOverTime(MostRecentCampaign(CAMPAIGNS).Clicks))
}


var Clickers = function(Articles){
    var html = ""
      for (var i = 0; i < 3; i++){
        html += "<p><a href='" + Articles[i].url + 
            "' target='_blank'>Passle</a>     " + 
            Articles[i].clicks + '</p>'
    }
    d3.select('.Links').html(html)
}

var Openers = function(Users){
        var html = ""
    for (var i = 0; i < 3; i++){
        html += "<p>" + Users[i].user + "  " + 
                Users[i].opens + '</p>'

    }
    d3.select('.Openers').html(html)
}



var topArticles = function(Clicks){
    return Clicks.sort(function(a, b){
        return b.clicks - a.clicks ;
    }) 
}

var MostRecentCampaign = function(CAMPAIGNS){
    return  CAMPAIGNS.reduce(function(prev, curr, ind, arr){
        var format = d3.time.format("%Y-%m-%d %X")
        var current = format.parse(curr.date).getTime()
        var previous = format.parse(prev.date).getTime()
        if (previous > current) return prev;
           else return curr;
    })

} 

var topOpeners = function(Opens){
    return Opens.sort(function(a, b){
            return b.opens - a.opens;
        })

}

var opensOverTime = function(Opens){
    var clicks = []
        Opens.forEach(function(curr){
        console.log(curr);
                curr.raw.forEach(function(el2){
                    clicks.push({action: 'click', timestamp: curr.timestamp, user: curr.user})
                })
        })
    return clicks;
}






/*http://bl.ocks.org/mbostock/3883245*/



function dash (){

var width = 420,
    barHeight = 20;

var max = CAMPAIGNS.reduce(function(prev, v){
    var curr = v['unique_opens']
        if (prev < curr) return curr;
        else return prev
},0)

for (var key in CAMPAIGNS){
var campaign = CAMPAIGNS[key];
var labels = ['unique_clicks',
		 'unique_opens',
		 'clicks'];


//graph.style('background-color' ,'black')
var data = grab(campaign, labels)

var x = d3.scale.linear()
    .domain([0, max])
    .range([0, width]);

var chart = d3.selectAll(".camp-"+ campaign.id )
				.attr("width",200+width)
    			.attr("height", barHeight * data.length);;


var bar = chart.selectAll("g")
    .data(data)
  	.enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d) { return x(d -2); })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .style('text-anchor', 'end')
    .text(function(d) { return d; });


bar.append('text')
    .attr('x', function(d) {return x(d + 2); })
    .attr('y', barHeight / 2)
    .attr('dy', ".35em")
    .style('text-anchor', 'start')
    .text(function(d, i) {return mapLabel(labels[i])})
    console.log(campaign)
    }

}

var grab = function(from, labels){
//from is an object, labels is an array of attributes you want returned
var data = [];
for (var i in labels){
	var key = labels[i];
	data.push(from[key]);
}
return data;
}

var mapLabel = function(label){
    var dict = {
        'unique_clicks':'Users who clicked through',
        'unique_opens':'Users who opened',
        'clicks':'Total Clicks',
    }
    return dict[label];
}