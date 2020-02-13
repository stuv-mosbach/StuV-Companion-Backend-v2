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
    url: String
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

var mensaplanSchema = new Schema({
    validUntil: String,
    Montag: [String],
    Dienstag: [String],
    Mittwoch: [String],
    Donnerstag: [String],
    Freitag: [String]
});

exports.getMensaplanSchema = () => {return mensaplanSchema};

var lectureSchema = new Schema({
    uid: String,
    dtstamp: String,
    dtstart: String,
    class: String,
    created: String,
    description: String,
    'last-modified': String,
    location: String,
    summary: String,
    dtend: String,
    course: String,
    lastTouched: String
});

exports.getLectureSchema = () => {return lectureSchema};