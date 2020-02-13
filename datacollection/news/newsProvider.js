var ReaderConstructor = require('rss-parser');
var Reader = new ReaderConstructor();

var mongoose = require('mongoose');
var provider = require('../../utils/modelProvider');
var news = mongoose.model('news', provider.getNewsSchema());

var newsUrl = 'https://stuv-mosbach.de/feed/';

exports.run = () => {
    return new Promise((resolve, reject) => {
        loadFeed(newsUrl, resolve, reject);
    })
}

const loadFeed = async (url, resolve, reject) => {
    let newsData = await Reader.parseURL(newsUrl);
    newsData.items.forEach(e => {
        updateDBEntrys(e, reject)
    });
    resolve();
}

const updateDBEntrys = (element, reject) => {
    const data = { creator: element["creator"], title: element["title"], link: element["link"], pubDate: element["pubDate"], 'content:encoded': element["content:encoded"], 'dc:creator': element["dc:creator"], content: element["content"], contentSnippet: element["contentSnippet"], guid: element["guid"], isoDate: element["isoDate"] };
    const options = { upsert: true, new: true, useFindAndModify: false };
    const query = { isoDate: element["isoDate"] };
    news.findOneAndUpdate(query, data, options)
        .then((doc) => {

        })
        .catch((err) => {
            reject(err);
        });
}