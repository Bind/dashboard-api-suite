

var init = function(){


  var currentCampaign = MostRecentCampaign(CAMPAIGNS);

    Openers(topOpeners(currentCampaign.Opens))
    Clickers(topArticles(currentCampaign.Clicks))
    //opensOverTime(MostRecentCampaign(CAMPAIGNS).Opens)
    writeToSummary(currentCampaign)
    drawRates(currentCampaign, 5)
    drawRadials(currentCampaign)

}


var writeToSummary = function(campaign){
  var html = "<h2>" + campaign.title + '</h1><p>Sent: ' + campaign.date + '</p>'
  d3.select('.Summary').html(html)

        var margin = {top: 20, right: 20, bottom: 20, left: 20},
            width = 236 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom ;

        var barHeight = 40;
        var  bottom = campaign.emails_sent;
        var  top = campaign.unique_opens;



   var svg = d3.select('.Summary').append('svg').attr('class', 'stats')
                .attr("width",'100%')
                .attr("height", (barHeight*2) + margin.top + margin.bottom)
   var opensBarGraph = svg.append('g')
      .attr("transform", "translate(" + (margin.left/2) + "," + (margin.top ) + ")");

    var clicksBarGraph = svg.append('g')
       .attr("transform", "translate(" +  (margin.left/2) + "," + (margin.top + barHeight) + ")");

        drawBar(opensBarGraph,[top, bottom], barHeight, width, 'opens');
        drawBar(clicksBarGraph,[campaign.unique_clicks, bottom], barHeight, width, 'clicks')

}


var Clickers = function(Articles){
    var html = "<h3>Most Popular Articles</h3>"
      for (var i = 0; i < 3; i++){
        html += "<p><a href='" + Articles[i].url + 
            "' target='_blank'>Passle</a>     " + 
            Articles[i].clicks + '</p>'
    }
    d3.select('.Links').html(html)
}

var Openers = function(Users){
        var html = "<h3>Most Active Users</h3>"
    for (var i = 0; i < 5; i++){
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

var quantifyRateData = function(Tracking, step){
        var data = Tracking.reduce(function(prev, curr, ind, arr){
            time = clipTimeStamp(curr.timestamp, step);
            if ( typeof prev[time] == 'undefined'){
                    prev[time] = { 'click':0 , 'open':0 }
                    prev[time][curr.action]++;
                } else prev[time][curr.action]++;
                return prev;
        }, {})
        var _data = [];
        var keys = Object.keys(data);
        for (key in keys){
            _data.push({date:keys[key], opens:data[keys[key]].open, clicks:data[keys[key]].click})
        }
        return _data;
}


var clipTimeStamp = function(_time, step){
        var format = d3.time.format("%Y-%m-%d %X")
        var current = format.parse(_time).getTime()
        current -= current % (3600000 * step);
        return format(new Date(current))
}




/*http://bl.ocks.org/mbostock/3883245*/


var drawBar = function(graph, data, height, width, cl){
    var barHeight = height/3;
    var x = d3.scale.linear()
      .range([0, width])

var percentage = data[0]/data[1] * 100;
    percentage = percentage.toFixed(2); 

    graph.append('rect')
      .attr('class', 'shadow')
      .attr('height', barHeight)
      .attr('width', width)
      x.domain([0, data[1]])

    graph.append('rect')
      .attr('class', cl)
      .attr('height', barHeight)
      .attr('width', x(data[0]))

    graph.append("text")
        .attr("x", x(data[0]) - 8)
        .attr('y', barHeight/2)
        .style('font-size', '1em')
        //.style('fill', 'rgb(38, 36, 37)')
        .attr("dy", ".3em")
        .style("text-anchor", "end")
        .text(percentage + '%');

    var legend = graph.append('g')
      .attr('transform','translate(0,' + (barHeight + 10) +')')

      legend.append("text")
        .attr("x", width/2)
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .text(cl + ' ' + data[0]);
}







var drawRates = function(campaign, step){

        var barHeight = 80;
        var barSpacing = 40;

       


        data = quantifyRateData(campaign.tracking, step);
        data = data.sort(function(prev, curr){
                var format = d3.time.format("%Y-%m-%d %X")
                var current = format.parse(curr.date).getTime()
                var previous = format.parse(prev.date).getTime()
                return previous - current;
            })

        console.log(data)

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 610 - margin.left - margin.right,
            height = 320 - margin.top - margin.bottom ;



        var parseDate = d3.time.format("%Y-%m-%d %X").parse;
          data.forEach(function(d) {
            d.date = parseDate(d.date);
            })

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

        var clicks = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.clicks); });

        var opens = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.opens); });

        var svg = d3.select(".Rates").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 40 + barHeight );
        


        var lineGraph = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + (margin.top+ barHeight ) + ")");

            lineGraph.append('text')
              .attr('transform', "translate("+(width/2)+ ","+ (-barSpacing/2) +")")
              .attr('text-anchor', 'middle')
              .attr('font-size','2em')
              .text('Life Time Performance')



          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain(d3.extent(data, function(d) { return d.opens; }));

          lineGraph.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          lineGraph.append("g")
              .attr("class", "y axis")
              .call(yAxis)

          
          var clickGraph = lineGraph.append("path")
              .datum(data)
              .attr("class", "line clicks")
              .attr("d", clicks);

          var openGraph = lineGraph.append("path")
              .datum(data)
              .attr("class", "opens")
              .attr("d", opens)

          var legend = lineGraph.append('g')
                .attr('class', 'legend')
                .attr('transform','translate(0,' +(height+ 40) +')')
                

var drawlegend = function(){
          var openKey = legend.append('g');
          var clickKey  = legend.append('g').attr('transform','translate(60,0)')

         openKey.append('circle')
                .style('fill', '#d7551a')
                .attr('cy',1)//one fourth of radius
                .attr('r', 4)
          
          openKey.append("text")
                .attr("x", 8)
                .attr("dy", ".5em")
                .style("text-anchor", "start")
                .text("Opens");

         clickKey.append('circle')
                .style('fill', 'steelblue')
                .attr('cy',1)//one fourth of radius
                .attr('r', 4)
          
          clickKey.append("text")
                .attr("x", 8)
                .attr("dy", ".5em")
                .style("text-anchor", "start")
                .text("Clicks");
              }
              drawlegend()



 var transitionLineGraphFirstDay = function(campaign, step){
  lineGraph.remove()        
lineGraph = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + (margin.top+ barHeight ) + ")");

                        lineGraph.append('text')
              .attr('transform', "translate("+(width/2)+ ","+ (-barSpacing/2) +")")
              .attr('text-anchor', 'middle')
              .attr('font-size','2em')
              .text(function(){
                if (step ===1){
                    return "First Day Performance";
                } else return "Life Time Performance"
              })

  var data = quantifyRateData(campaign.tracking, step);
  if(step === 1){
      data = data.filter(function(el){
        var format = d3.time.format("%Y-%m-%d %X");
         return format.parse(el.date).getTime() < 
         (format.parse(campaign.date).getTime() + 86400000);
      })   
      }    
  data = data.sort(function(prev, curr){
                var format = d3.time.format("%Y-%m-%d %X")
                var current = format.parse(curr.date).getTime()
                var previous = format.parse(prev.date).getTime()
                return previous - current;
            }) 
  var parseDate = d3.time.format("%Y-%m-%d %X").parse;
          data.forEach(function(d) {
            d.date = parseDate(d.date);
            
            })
    console.log(data)
        var clicks = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.clicks); });

        var opens = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.opens); });

        
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain(d3.extent(data, function(d) { return d.opens; }));

            

            lineGraph.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          lineGraph.append("g")
              .attr("class", "y axis")
              .call(yAxis)
          
           clickGraph = lineGraph.append("path")
              .datum(data)
              .attr("class", "line clicks")
              .attr("d", clicks);

           openGraph = lineGraph.append("path")
              .datum(data)
              .attr("class", "opens")
              .attr("d", opens)

           legend = lineGraph.append('g')
                .attr('class', 'legend')
                .attr('transform','translate(0,' +(height+ 40) +')')
drawlegend()


  }
var temp = 1;
  document.getElementById('mostRecent').addEventListener('click',function(){
  console.log(temp);
      transitionLineGraphFirstDay(campaign, temp)
  if (temp === 5) {temp = 1}
          else temp = 5  ;
    })

 
};

var drawRadials = function(campaign){

  var  bottom = campaign.emails_sent;


var width = 500,
    height = 250,
    twoPi = 2 * Math.PI,
    progress = 0,
    total = 1308573, // must be hard-coded if server doesn't report Content-Length
    formatPercent = d3.format(".0%");

var PI = 2 * Math.PI;

var arc = d3.svg.arc()
    .startAngle(0)
    .innerRadius(60)
    .outerRadius(66);


var svg = d3.select(".circleGraphs").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")");

    var opens = svg.append("g")
          .attr("class", "open-meter");

    var clicks = svg.append("g")
          .attr("class", "click-meter")
          .attr("transform","translate(" + width/2 + ',0)')

var drawRadial = function(g, data, label ){

   var percentage = data[0]/data[1]

      g.append("path")
          .attr("class", "background")
          .datum({endAngle: PI})
          .attr("d", arc);

      var foreground = g.append("path")
          .attr("class", "foreground")
          .datum({endAngle: 0})
          .attr("d", arc)

      var text = g.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", ".35em");


      foreground
          .transition()
          .duration(750)
          .call(arcTween, (PI * percentage))

      var text = g.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", ".35em");

      var label = g.append("text")
                    .attr("text-anchor", "middle")
                    .attr("transform","translate(0,"+ (-height/3) + ")")
                    .text(data[0] +label +  data[1])




          function arcTween(transition, newAngle){
            transition.attrTween("d", function(d){
              var interpolate = d3.interpolate(d.endAngle, newAngle)
              return function (t){
                d.endAngle = interpolate(t)
                text.text(formatPercent(d.endAngle/PI))
                return arc(d)
              }
            })
          }
    }

drawRadial(opens, [ campaign.unique_opens,bottom], " users opened of ")
drawRadial(clicks, [campaign.unique_clicks, bottom], " users clicked articles of ")    
}







