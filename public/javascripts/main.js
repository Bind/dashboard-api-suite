
var init = function (){

var width = 420,
    barHeight = 20;

var max = CAMPAIGNS.reduce(function(prev, v){
    var curr = v['summary']['unique_opens']
        if (prev < curr) return curr;
        else return prev
},0)

for (var key in CAMPAIGNS){
var campaign = CAMPAIGNS[key];
var labels = ['users_who_clicked',
		 'unique_opens',
		 'clicks'];


//graph.style('background-color' ,'black')
var data = grab(campaign['summary'], labels)

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
        'users_who_clicked':'Users who clicked through',
        'unique_opens':'Users who opened',
        'clicks':'Total Clicks',
    }
    return dict[label];
}