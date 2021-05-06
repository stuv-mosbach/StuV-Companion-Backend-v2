"use strict"

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../../utils/Winston"))(config.log).logger;

const ReaderConstructor = require('rss-parser');
const Reader = new ReaderConstructor();

// const mongoose = require('mongoose');
const provider = new (require('../../utils/modelProvider'))();
const newsSchema = provider.getNewsSchema();

// const newsUrl = 'https://stuv-mosbach.de/feed/';

module.exports = class {

    constructor(url, dbConnection) {
        this.newsUrl = url;
        this.dbConnection = dbConnection;
        this.news = dbConnection.model("news", newsSchema);
    }

    /**
     * 
     * @param {*} element 
     * @returns 
     */
    async updateDBEntrys(element) {
        try {
            const data = { creator: element["creator"], title: element["title"], link: element["link"], pubDate: element["pubDate"], 'content:encoded': element["content:encoded"], 'dc:creator': element["dc:creator"], content: element["content"], contentSnippet: element["contentSnippet"], guid: element["guid"], isoDate: element["isoDate"] };
            const options = { upsert: true, new: true, useFindAndModify: false };
            const query = { isoDate: element["isoDate"] };

            await this.news.findOneAndUpdate(query, data, options).exec();
            return { status: 1 }
        } catch (e) {
            Winston.error(e);
            return { status: -1 };
        }
    }

    /**
     * 
     * @returns 
     */
    async loadFeed() {
        try {
            const newsData = await Reader.parseURL(this.newsUrl);
            for (const element of newsData.items) {
                await this.updateDBEntrys(element);
            }
            return { status: 1 };
        } catch (e) {
            Winston.error(e);
            return { status: -1 };
        }
    }
}