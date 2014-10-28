var mongoose = require("mongoose");

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
  inline_css: Number,
  analytics: String,
  analytics_tag: String,
  authenticate: Boolean,
  ecomm360: Boolean,
  auto_tweet: Boolean,
  auto_footer: Boolean,
  timewarp: Boolean,
  tracking: { html_clicks: Boolean,
  			  text_clicks: Boolean,
  			  opens: Boolean },
  parent_id: String,
  is_child: Boolean,
  tests_sent: String,
  tests_remain: Number,
  segment_text: String,
  segment_opts: { match: String,
  				  conditions: [] },
  saved_segment: [],
  type_opts: [],
  comments_total: Number,
  comments_unread: Number,
  summary: { syntax_errors: Number,
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
		     industry:   {  type: String,
					        open_rate:   Number,
					        click_rate:  Number,
					        bounce_rate: Number,
					        unopen_rate: Number,
					        unsub_rate:  Number,
					        abuse_rate:  Number },
		     absplit: [],
		     timewarp: [],
		     timeseries: [] },
  activity: [] })



// NOTE: methods must be added to the schema before compiling it with mongoose.model()

campaignSchema.methods.baseStats = function baseStats(){
	return {
		id: this.id,
		date: this.send_time,
		unique_opens: this.summary.unique_opens,
		emails_sent: this.summary.emails_sent,
		unique_clicks: this.summary.unique_clicks,
		}
}

var Campaign = mongoose.model('Campaign',campaignSchema);

exports.Campaign = Campaign;

