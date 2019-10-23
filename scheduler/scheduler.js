var agenda = require('agenda');
var dbProvider = require('../utils/dbConfig');
var dbString = dbProvider.getDBUrl() + 'agenda';


var agent = new agenda({db: {address: dbString}});

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