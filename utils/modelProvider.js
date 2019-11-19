var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var newsSchema = new Schema({
    creator: String,
    title: String,
    link: String,
    pubDate: String,
    'content:encoded': String,
    'dc:creator': String,
    content: String,
    contentSnippet: String,
    guid: String,
    isoDate: String
});

exports.getNewsSchema = () => {return newsSchema};

var courseSchema = new Schema({
    course: String,
    url: String,
});

exports.getCourseSchema = () => {return courseSchema};

var eventSchema = new Schema({
    dtstart: String,
    dtend: String,
    dtstamp: String,
    uid: String,
    created: String,
    description: String,
    'last-modified': String,
    location: String,
    sequence: Number,
    status: String,
    summary: String,
    transp: String
  });

  exports.getEventSchema = () => {return eventSchema};