

var init = function(){

    Openers(topOpeners(MostRecentCampaign(CAMPAIGNS).Opens))
    Clickers( topArticles( MostRecentCampaign(CAMPAIGNS).Clicks))
    dash(clicksOverTime(MostRecentCampaign(CAMPAIGNS).Clicks))
    
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

var clicksOverTime = function(Opens){
    var clicks = []
        Opens.forEach(function(curr){
                curr.raw.forEach(function(el2){
                    clicks.push({action: 'click', timestamp: clipTimeStamp(el2.timestamp), user: curr.user})
                })
        })
        var _clicks = clicks.reduce(function(prev, curr, ind, arr){
                if ( typeof prev[curr.timestamp] == 'undefined'){
                    prev[curr.timestamp]=1;
                        } else prev[curr.timestamp]++
                return prev
        }, {})
        var data = [];
        var keys = Object.keys(_clicks);
        for (key in keys){
            data.push({date:keys[key], clicks:_clicks[keys[key]]})
        }
        return data;
}

var clipTimeStamp = function(_time){
        var format = d3.time.format("%Y-%m-%d %X")
        var current = format.parse(_time).getTime()
        current -= current % (43200000/2);
        return format(new Date(current))
}




/*http://bl.ocks.org/mbostock/3883245*/



var dash = function(data){

data.sort(function(prev, curr){
        var format = d3.time.format("%Y-%m-%d %X")
        var current = format.parse(curr.date).getTime()
        var previous = format.parse(prev.date).getTime()
        return previous - current;
    })

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 610 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d %X").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.clicks); });

var svg = d3.select(".Rates").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  data.forEach(function(d) {
    d.date = parseDate(d.date);
    
    })


  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.clicks; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
    
};

