const agenda = require('agenda');
const dbProvider = new (require('../utils/dbConfig'));
const newsProvider = require('../datacollection/news/newsProvider');
const courseProvider = require('../datacollection/courses/coursesProvider');
const eventsProvider = require('../datacollection/events/eventsProvider');
const mensaplanProvider = require('../datacollection/mensaplan/mensaplanProvider');
const lectureProvider = require('../datacollection/lectures/lecturesProvider');
const dbString = dbProvider.getDBUrl() + '/agenda';

module.exports = class Scheduler {
    constructor() {
        this.initiated = 0;
        this.agent = new agenda({ db: { address: dbString } });
    }

    async init() {
        try {
            this.agent.define('Update News', async (job, done) => {
                newsProvider.run()
                    .then(() => { done(); })
                    .catch((err) => { done(err); });
            });
            this.agent.define('Update Courses', async (job, done) => {
                courseProvider.run()
                    .then(() => { done(); })
                    .catch((err) => { done(err); });
            });

            this.agent.define('Update Events', async (job, done) => {
                eventsProvider.run()
                    .then(() => { done(); })
                    .catch((err) => { done(err); });
            });

            this.agent.define('Update Mensaplan', async (job, done) => {
                mensaplanProvider.run()
                    .then(() => { done(); })
                    .catch((err) => { done(err); });
            });

            this.agent.define('Update Lectures', async (job, done) => {
                lectureProvider.run()
                    .then(() => { done(); })
                    .catch((err) => { done(err); });
            })

            this.agent.on('start', job => {
                console.log('Job %s starting', job.attrs.name);
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

    async get() {
        try {
            if (!this.initiated) await this.init();
            return agent;
        } catch (e) {
            console.error(e);
        }
    }
    async run() {
        try {
            if (!this.initiated) await this.init();
            await agent.start();
            await agent.every('15 minutes', ['Update News', 'Update Events']);
            await agent.every('1 hour', ['Update Lectures']);
            await agent.every('1 day', ['Update Mensaplan', 'Update Courses']);
        } catch (e) {
            console.error(e);
        }
    }
}