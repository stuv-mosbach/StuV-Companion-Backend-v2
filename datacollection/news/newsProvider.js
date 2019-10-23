var ReaderConstructor = require('rss-parser');
var Reader = new ReaderConstructor();

var mongoose = require('mongoose');
var provider = require('../../utils/modelProvider');
var news = mongoose.model('news', provider.getNewsSchema());

var newsUrl = 'https://stuv-mosbach.de/feed/';

exports.run = () => {
    return new Promise((resolve, reject) => {

    })
}

const loadFeed = async (url, resolve, reject) => {
    let newsData = await Reader.parseURL(newsUrl);
}

const updateDBEntrys = (data, resolve, reject) => {
    
}