var mongoose = require("mongoose");
var util = require('util');
var d3 = require('d3');

var clipTimeDay = function(_time, format, _format) {
    /*
    the date string in _time
    a string of d3.js timestamp formatting for format
    */
    var format = d3.time.format(format)
    var current = format.parse(_time).getTime()
    current -= current % (86400000);
    var newFormat = d3.time.format(_format)
    return newFormat(new Date(current))
}


var campaignSchema = mongoose.Schema({
    id: String,
    web_id: Number,
    list_id: String,
    folder_id: Number,
    template_id: Number,
    content_type: String,
    content_edited_by: String,
    title: String,
    type: String,
    create_time: String,
    send_time: String,
    content_updated_time: String,
    status: String,
    from_name: String,
    from_email: String,
    subject: String,
    to_name: String,
    archive_url: String,
    archive_url_long: String,
    emails_sent: Number,
    inline_css: Boolean,
    analytics: String,
    analytics_tag: String,
    authenticate: Boolean,
    ecomm360: Boolean,
    auto_tweet: Boolean,
    auto_footer: Boolean,
    timewarp: Boolean,
    tracking: {
        html_clicks: Boolean,
        text_clicks: Boolean,
        opens: Boolean
    },
    parent_id: String,
    is_child: Boolean,
    tests_sent: String,
    tests_remain: Number,
    segment_text: String,
    segment_opts: {
        match: String,
        conditions: []
    },
    saved_segment: [],
    type_opts: [],
    comments_total: Number,
    comments_unread: Number,
    summary: {
        syntax_errors: Number,
        hard_bounces: Number,
        soft_bounces: Number,
        unsubscribes: Number,
        abuse_reports: Number,
        forwards: Number,
        forwards_opens: Number,
        opens: Number,
        last_open: String,
        unique_opens: Number,
        clicks: Number,
        unique_clicks: Number,
        users_who_clicked: Number,
        last_click: String,
        emails_sent: Number,
        unique_likes: Number,
        recipient_likes: Number,
        facebook_likes: Number,
        industry: {
            type: String,
            open_rate: Number,
            click_rate: Number,
            bounce_rate: Number,
            unopen_rate: Number,
            unsub_rate: Number,
            abuse_rate: Number
        },
        absplit: [],
        timewarp: [],
        timeseries: []
    },
    activity: []
})


// NOTE: methods must be added to the schema before compiling it with mongoose.model()

campaignSchema.methods.baseStats = function baseStats() {
    return {
        id: this.id,
        title: this.title,
        date: this.send_time,
        unique_opens: this.summary.unique_opens,
        emails_sent: this.summary.emails_sent,
        unique_clicks: this.summary.unique_clicks,
    }
}
campaignSchema.methods.topLinks = function() {
    //returns an dictionaries with links and number of clicks
    var cleaned = {}

    this.activity.filter(function(el, ind, arr) {
        var opens = 0;
        el.actions.forEach(function(el2, ind2, arr2) {
            if (el2.action === 'click') {
                if (typeof cleaned[el2.url] == 'undefined') {
                    cleaned[el2.url] = {
                        clicks: 1,
                        raw: [{
                            'user': el.user,
                            url: el2.url,
                            timestamp: el2.timestamp
                        }]
                    };
                } else {
                    cleaned[el2.url].clicks++;
                    cleaned[el2.url].raw.push({
                        'user': el.user,
                        url: el2.url,
                        timestamp: el2.timestamp
                    })
                }
            }
        })
    })
    var _cleaned = []
    var keys = Object.keys(cleaned)
    for (var temp in keys) {
        var url = keys[temp];
        _cleaned.push({
            url: url,
            raw: cleaned[url].raw,
            clicks: cleaned[url].clicks
        })
    }
    return _cleaned;
}

campaignSchema.methods.userOpens = function() {
    var cleaned = this.activity.filter(function(el, ind, arr) {
        var opens = 0;
        el.actions.forEach(function(el2, ind2, arr2) {
            if (el2.action === 'open') opens++;
        })
        return el['opens'] = opens;
    })
    return cleaned;
}

campaignSchema.methods.trackingData = function() {
    var data = [];
    var cleaned = this.activity.filter(function(el, ind, arr) {
        el.actions.forEach(function(el2, ind2, arr2) {
            if (el2.action === 'open' || el2.action === 'click') {
                data.push({
                    action: el2.action,
                    timestamp: el2.timestamp,
                })
            }
        })
    })
    return data
}
campaignSchema.methods.opens = function() {
    var data = [];
    var cleaned = this.activity.filter(function(el, ind, arr) {
        el.actions.forEach(function(el2, ind2, arr2) {
            if (el2.action === 'open') {
                data.push({
                    timestamp: el2.timestamp,
                })
            }
        })
    })
    return data
}

campaignSchema.methods.openRate = function() {

    return {
        timestamp: clipTimeDay(this.send_time, "%Y-%m-%d %X", "%Y%m%d"),
        total: (this.summary.unique_opens / this.summary.emails_sent * 100)
    }
}
campaignSchema.methods.clicks = function() {
    var data = [];
    var cleaned = this.activity.filter(function(el, ind, arr) {
        el.actions.forEach(function(el2, ind2, arr2) {
            if (el2.action === 'click') {
                data.push({
                    timestamp: el2.timestamp,
                })
            }
        })
    })
    return data
}

campaignSchema.methods.clickRate = function() {

    return {
        timestamp: clipTimeDay(this.send_time, "%Y-%m-%d %X", "%Y%m%d"),
        total: (this.summary.unique_clicks / this.summary.emails_sent * 100)
    }
}


campaignSchema.methods.SubGrowth = function() {
    return {
        timestamp: clipTimeDay(this.send_time, "%Y-%m-%d %X", "%Y%m%d"),
        total: this.summary.emails_sent,
    }
}

campaignSchema.methods.serve = function() {
    var base = this.baseStats()
    base.Opens = this.userOpens();
    base.Clicks = this.topLinks();
    base.tracking = this.trackingData();
    return base;
}

campaignSchema.statics.Summary = function(cb) {

    var summary = {
        total_recipients: 0,
        unique_opens: 0,
        unique_clicks: 0,
        clickRates: [],
        openRates: [],
        recipients: []

    }
    Campaign.find({}, function(err, campaigns) {

        campaigns.forEach(function(campaign) {
            summary.total_recipients += campaign.summary.emails_sent;
            summary.unique_opens += campaign.summary.unique_opens;
            summary.unique_clicks += campaign.summary.unique_clicks;
            summary.clickRates.push(campaign.clickRate())
            summary.openRates.push(campaign.openRate())
            summary.recipients.push(campaign.SubGrowth())

        })

        summary.recipients.sort(function(curr, prev) {
            var format = d3.time.format('%Y%m%d')
            return format.parse(curr.timestamp).getTime() - format.parse(prev.timestamp).getTime()
        })
        summary.clickRates.sort(function(curr, prev) {
            var format = d3.time.format('%Y%m%d')
            return format.parse(curr.timestamp).getTime() - format.parse(prev.timestamp).getTime()
        })
        summary.openRates.sort(function(curr, prev) {
            var format = d3.time.format('%Y%m%d')
            return format.parse(curr.timestamp).getTime() - format.parse(prev.timestamp).getTime()
        })

        cb(null, summary)
    })
}


var Campaign = mongoose.model('Campaign', campaignSchema);

exports.Campaign = Campaign;