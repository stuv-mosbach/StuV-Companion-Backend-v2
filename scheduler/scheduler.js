var agenda = require('agenda');
var dbProvider = require('../utils/dbConfig');
var newsProvider = require('../datacollection/news/newsProvider');
var courseProvider = require('../datacollection/courses/coursesProvider');
var eventsProvider = require('../datacollection/events/eventsProvider');
var mensaplanProvider = require('../datacollection/mensaplan/mensaplanProvider');
var lectureProvider = require('../datacollection/lectures/lecturesProvider');
var dbString = dbProvider.getDBUrl() + '/agenda';


var agent = new agenda({ db: { address: dbString } });

agent.define('Update News', async (job, done) => {
    newsProvider.run()
        .then(() => { done(); })
        .catch((err) => { done(err); });
});

agent.define('Update Courses', async (job, done) => {
    courseProvider.run()
        .then(() => { done(); })
        .catch((err) => { done(err); });
});

agent.define('Update Events', async (job, done) => {
    eventsProvider.run()
        .then(() => { done(); })
        .catch((err) => { done(err); });
});

agent.define('Update Mensaplan', async (job, done) => {
    mensaplanProvider.run()
        .then(() => { done(); })
        .catch((err) => { done(err); });
});

agent.define('Update Lectures', async (job, done) => {
    lectureProvider.run()
        .then(() => { done(); })
        .catch((err) => { done(err); });
})

agent.on('start', job => {
    console.log('Job %s starting', job.attrs.name);
});

agent.on('complete', job => {
    console.log(`Job ${job.attrs.name} finished`);
});

exports.get = () => {
    return agent;
};

exports.run = async () => {
    await agent.start();
    await agent.every('15 minutes', ['Update News', 'Update Events']);
    await agent.every('1 hour', ['Update Lectures']);
    await agent.every('1 day', ['Update Mensaplan', 'Update Courses']);
}