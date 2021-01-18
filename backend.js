require('dotenv').config();
var express = require('express');
var basicAuth = require('express-basic-auth');
var cors = require('cors');
const path = require('path');

var agendash = require('agendash');
var scheduler = require('./scheduler/scheduler');

var apiRoutes = require('./api/routes');

var mongoose = require('mongoose');
var dbProvider = require('./utils/dbConfig');
var dbConnectionString = dbProvider.getDBUrl().concat("/" , dbProvider.getEnv());

const appConfig = require(path.resolve(process.cwd() +'/config.json'));

// Main routine

// start express

var app = express()
var port = appConfig.webserver.port;

// start db
mongoose.connect(dbConnectionString, { useNewUrlParser: true });

// start scheduler

scheduler.run();

// start routes

app.use(cors());

app.get('/', (req, res) => {
    res.send("Welcome to the Backend");
});

app.use('/dashboard', basicAuth({
    users: {
        admin: process.env.PASSWORD,
    },
    challenge: true,
    realm: 'stuvbackendadmin',
}), agendash(scheduler.get()));

app.use('/api', apiRoutes);

// init express

app.listen(parseInt(port), () => {
    console.log("Backend running on port: " + port);
});
