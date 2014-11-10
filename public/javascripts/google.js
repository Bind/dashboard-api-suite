var now;

var init = function() {
    console.log(DATA);
    today = new Date();
    now = today.getFullYear() + '' + today.getMonth() + '' + today.getDate()

    console.log(DATA.summary)

    //drawit(DATA.analytics['sessionsNewVersusReturningOT'])
    drawSplashPage(DATA.analytics['sessionsNewVersusReturningOT'])
}


var drawSplashPage = function(data) {

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        _width = 600,
        _height = 270;

    var svg = d3.select(".SplashPage")
        .append("svg")
        .attr("width", _width)
        .attr("height", _height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    drawit(svg, data, _width, _height, margin);


}

var consolidateData = function(array, identifier) {
    /*
    * * consolidates entries of an array * * based upon a similar array[el][identifier]
returns an array of dictionaries or arrays */

    return array.reduce(function(prev, curr, ind, arr) {
        var keys = Object.keys(curr).reduce(function(prev, curr, ind, arr) {
            if (curr != identifier) return prev.push(curr);
            else return prev
        }, {});
        if (typeof prev[curr[identifier]] == 'undefined') {

            for (keys in key) {
                prev[curr[identifier]][key] == curr[key]
            }


        } else {
            for (keys in key) {
                prev[curr[identifier]][key] += curr[key]
            }
        }
        return prev;
    }, {})
}


var clipTimeStamp = function(_time, step) {
    var format = d3.time.format("%Y%m%d")
    var current = format.parse(_time).getTime()
    current -= current % (3600000 * step);
    return format(new Date(current))
}


function drawit(svg, data, _width, _height, margin) {


    var width = _width - margin.left - margin.right,
        height = _height - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%Y%m%d").parse;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) {
            return x(d.date);
        })
        .y(function(d) {
            return y(d.close);
        });

    // Adds the svg canvas


    // Get the data

    data.forEach(function(d) {
        d.date = parseDate(d[0]);
        d.close = d[2];
    })

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function(d) {
        return parseInt(d.close);
    })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}