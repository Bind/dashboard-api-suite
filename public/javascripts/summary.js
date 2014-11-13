var now;

var init = function() {
    formatPercent = d3.format(".0%");
    console.log(DATA);
    today = new Date();
    now = today.getFullYear() + '' + today.getMonth() + '' + today.getDate()

    //drawit(DATA.analytics['sessionsNewVersusReturningOT'])
    drawSplashPage(DATA)
    drawNewsLetter(DATA.summary)
    drawPlatform(DATA.platform)

}

var drawNewsLetter = function(data) {

    var margin = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 50
        },
        _width = 210,
        _height = 200;

    var first = d3.select(".NewsLetter")
        .append("svg")
        .attr("width", _width + margin.left + margin.right)
        .attr("height", _height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    first.append("text")
        .attr("x", (_width / 2))
        .attr('y', _height + (margin.bottom / 2))
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .text('Open Rates');

    drawLineGraph(first, data.openRates, _width, _height, margin, true);

    first.append("text")
        .attr("class", "mainStat")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr('transform', 'translate(' + (_width / 2) + ', ' + (_height / 2) + ')')
        .text(formatPercent(data.unique_opens / data.total_recipients));


    var second = d3.select(".NewsLetter")
        .append("svg")
        .attr("width", _width + margin.left + margin.right)
        .attr("height", _height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    second.append("text")
        .attr("x", (_width / 2))
        .attr('y', _height + (margin.bottom / 2))
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .text('Click Rates');

    drawLineGraph(second, data.clickRates, _width, _height, margin, true)

    second.append("text")
        .attr("class", "mainStat")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr('transform', 'translate(' + (_width / 2) + ', ' + (_height / 2) + ')')
        .text(formatPercent(data.unique_clicks / data.total_recipients));


    var third = d3.select(".NewsLetter")
        .append("svg")
        .attr("width", _width + margin.left + margin.right)
        .attr("height", _height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    third.append("text")
        .attr("x", (_width / 2))
        .attr('y', _height + (margin.bottom / 2))
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .text('Subscription Growth Rates');

    drawLineGraph(third, data.recipients, _width, _height, margin, false)

    second.append("text")
        .attr("class", "mainStat")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr('transform', 'translate(' + (_width / 2) + ', ' + (_height / 2) + ')')
        .text(formatPercent(data.unique_clicks / data.total_recipients));
}


var drawSplashPage = function(_data) {

    var data = _data.analytics;
    var ConversionRate = _data.funnels;

    var totalSessions = 0;
    data['sessionsOverTime'].forEach(function(el) {
        totalSessions += parseInt(el.total);
    })
    var formatDecimal = d3.format(".0")
    var averagePagesPerSession = 0;
    data['pagesPerSession'].forEach(function(el) {
        averagePagesPerSession += parseFloat(el.total);
    })
    averagePagesPerSession = (averagePagesPerSession / data['pagesPerSession'].length)

    var averageNewsletterConversion = 0;
    ConversionRate.forEach(function(el) {
        averageNewsletterConversion += parseFloat(el.total / 100);
    })
    averageNewsletterConversion = averageNewsletterConversion / ConversionRate.length;

    var margin = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 50
        },
        _width = 220,
        _height = 200;

    var first = d3.select(".SplashPage")
        .append("svg")
        .attr("width", _width + margin.left + margin.right)
        .attr("height", _height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    first.append("text")
        .attr("x", (_width / 2))
        .attr('y', _height + (margin.bottom / 2))
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .text('Sessions Overtime');

    drawLineGraph(first, data['sessionsOverTime'], _width, _height, margin);

    first.append("text")
        .attr("class", "mainStat")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr('transform', 'translate(' + (_width / 2) + ', ' + (_height / 2) + ')')
        .text(totalSessions);

    var second = d3.select(".SplashPage")
        .append("svg")
        .attr('width', _width + margin.right + margin.left)
        .attr('height', _height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    second.append("text")
        .attr('x', (_width / 2))
        .attr('y', _height + (margin.bottom / 2))
        .attr('dy', '.5em')
        .attr('text-anchor', 'middle')
        .text('Pages Per Session')

    drawLineGraph(second, data['pagesPerSession'], _width, _height, margin)

    second.append("text")
        .attr("class", "mainStat")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr('transform', 'translate(' + (_width / 2) + ', ' + (_height / 2) + ')')
        .text(averagePagesPerSession.toPrecision(4));


    var third = d3.select(".SplashPage")
        .append('svg')
        .attr('height', _height + margin.top + margin.bottom)
        .attr('width', _width + margin.right + margin.left)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    third.append('text')
        .attr('x', (_width / 2))
        .attr('y', _height + (margin.bottom / 2))
        .attr('dy', '.5em')
        .attr('text-anchor', 'middle')
        .text('NewsLetter Conversion Rate')

    drawLineGraph(third, ConversionRate, _width, _height, margin, true)

    third.append('text')
        .attr('class', 'mainStat')
        .attr('text-anchor', 'middle')
        .attr('x', (_width / 2))
        .attr('y', (_height / 2))
        .text(formatPercent(averageNewsletterConversion))
}

var drawPlatform = function(data) {

    var totalSessions = 0;
    data['sessionsOverTime'].forEach(function(el) {
        totalSessions += parseInt(el.total);
    })

    var margin = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 50
        },
        _width = 220,
        _height = 200;

    var first = d3.select(".Platform")
        .append("svg")
        .attr("width", _width + margin.left + margin.right)
        .attr("height", _height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    first.append("text")
        .attr("x", (_width / 2))
        .attr('y', _height + (margin.bottom / 2))
        .attr("dy", ".5em")
        .style("text-anchor", "middle")
        .text('Sessions Overtime');

    drawLineGraph(first, data['sessionsOverTime'], _width, _height, margin);

    first.append("text")
        .attr("class", "mainStat")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr('transform', 'translate(' + (_width / 2) + ', ' + (_height / 2) + ')')
        .text(totalSessions);
};


var consolidateData = function(array, identifier) {
    /*
     ** consolidates entries of an array
     ** based upon a similar array[el][identifier]
     ** returns an array of dictionaries or arrays
     */

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


function drawLineGraph(svg, data, _width, _height, margin, percentage) {

    if (typeof percentage == 'undefined') {
        percentage = false;
    }


    var width = _width
    height = _height;

    // Parse the date / time
    var parseDate = d3.time.format("%Y%m%d").parse;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(3).tickFormat(d3.time.format("%b"));

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
        d.date = parseDate(d.timestamp);
        d.close = d.total;
    })

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));

    if (percentage == true) {
        y.domain([0, 100]);
    } else {
        y.domain([0, d3.max(data, function(d) {
            return parseInt(d.close);
        })])
    }


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