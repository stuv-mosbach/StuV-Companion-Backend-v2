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