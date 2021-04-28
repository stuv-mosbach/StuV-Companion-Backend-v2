const agenda = require('agenda');
// const dbProvider = new (require('../utils/dbConfig'))();
const newsProvider = require('../datacollection/news/newsProvider');
// const courseProvider = require('../datacollection/courses/coursesProvider');
// const eventsProvider = new(require('../datacollection/events/eventsProvider'));
const mensaplanProvider = require('../datacollection/mensaplan/mensaplanProvider');
const lectureProvider = require('../datacollection/lectures/lecturesProvider');
// const dbString = await dbProvider.getDBUrl() + '/agenda';

module.exports = class Scheduler {
    /**
     * 
     * @param {String} dbUrl - connection string to db
     * @param {String} newsUrl 
     * @param {String} courseUrl 
     * @param {String} eventsUrl 
     * @param {String} mensaUrl 
     */
    constructor(dbUrl, newsUrl, courseUrl, eventsUrl, mensaUrl) {
        this.initiated = 0;

        this.newsUrl = newsUrl;
        this.courseUrl = courseUrl;
        this.eventsUrl = eventsUrl;
        this.mensaUrl = mensaUrl;
        this.dbUrl = dbUrl
        this.agent = new agenda({ db: { address: this.dbUrl } });

        this.courseProvider = new (require('../datacollection/courses/coursesProvider'))(this.courseUrl);
        this.eventsProvider = new (require('../datacollection/events/eventsProvider'))(this.eventsUrl);
    }

    /**
     * init module Scheduler
     * define all agenda actions
     */
    async init() {
        try {
            this.agent.define('Update News', async (job) => {
                try {
                    await newsProvider.run();
                } catch (e) {
                    console.error(e);
                }

            });
            this.agent.define('Update Courses', async (job) => {
                try {
                    await this.courseProvider.run();
                } catch (e) {
                    console.error(e);
                }
            });

            this.agent.define('Update Events', async (job) => {
                try {
                    await this.eventsProvider.updateEvents();
                } catch (e) {
                    console.error(e);
                }
            });

            this.agent.define('Update Mensaplan', async (job) => {
                try {
                    await mensaplanProvider.run();
                } catch (e) {
                    console.error(e);
                }
            });

            this.agent.define('Update Lectures', async (job) => {
                try {
                    await lectureProvider.run();
                } catch (e) {
                    console.error(e);
                }
            })

            this.agent.on('start', job => {
                try {
                    console.log('Job %s starting', job.attrs.name);
                } catch (e) {
                    console.error(e);
                }
            });

            this.agent.on('complete', job => {
                console.log(`Job ${job.attrs.name} finished`);
            });

            this.initiated = 1;
        } catch (e) {
            console.error(e);
            this.initiated = 0;
        }
    }

    /**
     * 
     * @returns agent
     */
    async getAgent() {
        try {
            if (!this.initiated) await this.init();
            return this.agent;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * run scheduler
     */
    async run() {
        try {
            if (!this.initiated) await this.init();
            await this.agent.start();
            await this.agent.every('15 minutes', ['Update News', 'Update Events']);
            await this.agent.every('1 hour', ['Update Lectures']);
            await this.agent.every('1 day', ['Update Mensaplan', 'Update Courses']);
        } catch (e) {
            console.error(e);
        }
    }
}