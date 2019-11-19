var agenda = require('agenda');
var dbProvider = require('../utils/dbConfig');
var newsProvider = require('../datacollection/news/newsProvider');
var courseProvider = require('../datacollection/courses/coursesProvider');
var dbString = dbProvider.getDBUrl() + 'agenda';


var agent = new agenda({db: {address: dbString}});

agent.define('Update News', async (job, done) => {
    newsProvider.run()
        .then(() => {done();})
        .catch((err) => {done(err);});
});

agent.define('Update Courses', async (job, done) => {
    courseProvider.run()
        .then(() => {done();})
        .catch((err) => {done(err);});
});

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
}