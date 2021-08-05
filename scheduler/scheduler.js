"use strict"

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../utils/Winston"))(config.log).logger;

const agenda = require('agenda');

module.exports = class Scheduler {

    /**
     * Instantiate Scheduler
     * 
     * @param {String} dbUrl - connection string to db
     * @param {ModelProvider} - instance of class ModelProvider
     * @param {String} newsUrl 
     * @param {String} courseUrl 
     * @param {String} eventsUrl 
     * @param {String} mensaUrl 
     */
    constructor(dbUrl, ModelProvider, newsUrl, courseUrl, eventsUrl, mensaUrl) {
        this.initiated = 0;

        this.dbUrl = dbUrl;
        this.ModelProvider = ModelProvider;
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

        this.courseProvider = new (require('../datacollection/coursesProvider'))(this.courseUrl, this.ModelProvider.getCourseSchema());
        this.eventsProvider = new (require('../datacollection/eventsProvider'))(this.eventsUrl, this.ModelProvider.getEventSchema());
        this.lectureProvider = new (require('../datacollection/lecturesProvider'))(this.ModelProvider.getLectureSchema());
        this.mensaplanProvider = new (require('../datacollection/mensaplanProvider'))(this.mensaUrl, this.ModelProvider.getMensaplanSchema());
        this.newsProvider = new (require('../datacollection/newsProvider'))(this.newsUrl, this.ModelProvider.getNewsSchema());
    }

    /**
     * init module Scheduler
     * define all agenda actions
     * @returns {Promise} {status: Number}
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
                    await this.courseProvider.updateCourses();
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
            return { status: 1 }
        } catch (e) {
            Winston.error(e);
            this.initiated = 0;
            return { status: -1 }
        }
    }

    /**
     * 
     * @returns agent
     */
    async getAgent() {
        try {
            if (!this.initiated) await this.init();
            return { status: 1, agent: this.agent }
        } catch (e) {
            Winston.error(e);
            return { status: -1 }
        }
    }

    /**
     * run scheduler
     * returns {Promise} {status: Number}
     */
    async run() {
        try {
            if (!this.initiated) await this.init();
            await this.agent.start();
            // await this.agent.now('Update Courses');

            /*
             * Trigger all jobs one time at server start
             * Courses must be loaded, before lecture job is started
             **/
            await this.courseProvider.updateCourses(this.courseUrl);
            // this.agent. now(['Update Mensaplan', 'Update Lectures', 'Update News', 'Update Events']);

            /**
             * Scheduling jobs permanent 
             */
            this.agent.every('16 minutes', ['Update News', 'Update Events']);
            this.agent.every('1 hour', ['Update Lectures']);
            this.agent.every('1 day', ['Update Mensaplan', 'Update Courses']);
            Winston.info("Scheduler running");

            return { status: 1 }
        } catch (e) {
            Winston.error(e);
            return { status: -1 }
        }
    }
}