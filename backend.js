require('dotenv').config();
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const path = require('path');

const agendash = require('agendash');
const scheduler = require('./scheduler/scheduler');

const apiRoutes = require('./api/routes');

const mongoose = require('mongoose');
const dbProvider = require('./utils/dbConfig');
const dbConnectionString = dbProvider.getDBUrl().concat("/" , dbProvider.getEnv());

const appConfig = require(path.resolve(process.cwd() +'/config.json'));

// Main routine

// start express

const app = express()
const port = appConfig.webserver.port;

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
