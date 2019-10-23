require('dotenv').config();
var express = require('express');
var basicAuth = require('express-basic-auth');
var cors = require('cors');

var agendash = require('agendash');
var scheduler = require('./scheduler/scheduler');

var mongoose = require('mongoose');
var dbProvider = require('./utils/dbConfig');
var dbConnectionString = dbProvider.getDBUrl() + dbProvider.getEnv();

// Main routine

// start express

var app = express()
var port = process.env.PORT

// start db
mongoose.connect(dbConnectionString, { useNewUrlParser: true });
var db = mongoose.connection;

// start scheduler

scheduler.run();

// start routes

app.use(cors);

app.use('/dashboard', basicAuth({
    users: {
        admin: process.env.PASSWORD,
    },
    challenge: true,
    realm: 'stuvbackendadmin',
}), agendash(scheduler.get()))

// init express

app.listen(port, () => {
    console.log("Backend running on port: " + port);
});