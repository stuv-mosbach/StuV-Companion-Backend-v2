"use strict"

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../utils/Winston"))(config.log).logger;

const agenda = require('agenda').default;

module.exports = class Scheduler {

    /**
     * 
     * @param {String} dbUrl - connection string to db
     * @param {String} newsUrl 
     * @param {String} courseUrl 
     * @param {String} eventsUrl 
     * @param {String} mensaUrl 
     */
    constructor(dbUrl, dbConnection, newsUrl, courseUrl, eventsUrl, mensaUrl) {
        this.initiated = 0;

        this.dbUrl = dbUrl;
        this.dbConnection = dbConnection;
        this.newsUrl = newsUrl;
        this.courseUrl = courseUrl;
        this.eventsUrl = eventsUrl;
        this.mensaUrl = mensaUrl;
        // this.mongoConnection = mongoConnection;
        this.agent = new agenda( //{ mongo: this.mongoConnection.mongoose.connection.db });
            {
                db: { address: this.dbUrl + "/agenda" },
                collection: "agendaJobs",
                options: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    useCreateIndex: true
                }
            });

        this.courseProvider = new (require('../datacollection/courses/coursesProvider'))(this.courseUrl, this.dbConnection);
        this.eventsProvider = new (require('../datacollection/events/eventsProvider'))(this.eventsUrl, this.dbConnection);
        this.lectureProvider = new (require('../datacollection/lectures/lecturesProvider'))(this.dbConnection);
        this.mensaplanProvider = new (require('../datacollection/mensaplan/mensaplanProvider'))(this.mensaUrl, this.dbConnection);
        this.newsProvider = new (require('../datacollection/news/newsProvider'))(this.newsUrl, this.dbConnection);
    }

    /**
     * init module Scheduler
     * define all agenda actions
     */
    async init() {
        try {
            this.agent.define('Update News', async (job) => {
                try {
                    await this.newsProvider.loadFeed();
                } catch (e) {
                    Winston.error(e);
                }

            });
            this.agent.define('Update Courses', async (job) => {
                try {
                    await this.courseProvider.run();
                } catch (e) {
                    Winston.error(e);
                }
            });

            this.agent.define('Update Events', async (job) => {
                try {
                    await this.eventsProvider.updateEvents();
                } catch (e) {
                    Winston.error(e);
                }
            });

            this.agent.define('Update Mensaplan', async (job) => {
                try {
                    await this.mensaplanProvider.updateMensaplan();
                } catch (e) {
                    Winston.error(e);
                }
            });

            this.agent.define('Update Lectures', async (job) => {
                try {
                    await this.lectureProvider.updateLectures();
                } catch (e) {
                    Winston.error(e);
                }
            })

            this.agent.on('start', job => {
                try {
                    Winston.info(`Job ${job.attrs.name} starting`);
                } catch (e) {
                    Winston.error(e);
                }
            });

            this.agent.on('complete', job => {
                Winston.info(`Job ${job.attrs.name} finished`);
            });

            this.initiated = 1;
        } catch (e) {
            Winston.error(e);
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
            Winston.error(e);
        }
    }

    /**
     * run scheduler
     */
    async run() {
        try {
            if (!this.initiated) await this.init();
            await this.agent.start();
            // this.agent.now(['Update Mensaplan', 'Update Courses', 'Update Lectures', 'Update News', 'Update Events']);
            await this.mensaplanProvider.updateMensaplan();
            await this.courseProvider.updateCourses(this.courseUrl);
            // await this.lectureProvider.updateLectures();
            await this.newsProvider.loadFeed();
            await this.eventsProvider.updateEvents();

            // this.agent.every('15 minutes', ['Update News', 'Update Events']);
            // this.agent.every('1 hour', ['Update Lectures']);
            // this.agent.every('1 day', ['Update Mensaplan', 'Update Courses']);
            Winston.info("Scheduler running");
        } catch (e) {
            Winston.error(e);
        }
    }
}