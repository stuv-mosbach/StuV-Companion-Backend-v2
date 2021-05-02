"use strict";

const path = require('path');
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("./utils/Winston"))(config.log);

process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.error(`child with pid=${process.pid} crashed with ${err} at`, origin);
    process.exit(-1);
});

process.on("unhandledRejection", (e, origin) => {
    console.error(`Unhandled rejection in child with pid=${process.pid}. Crashed with ${e} at`, origin);
    process.exit(-1);
});

process.on("uncaughtException", (e) => {
    console.error(`Uncaught exception in child with pid=${process.pid}: ${e}`);
    process.exit(-1);
});

process.on("exit", (code) => {
    console.error(`process exit with code ${code}`);
});

(async function () {
    try {
        require('dotenv').config();
        const express = require('express');
        const basicAuth = require('express-basic-auth');
        const cors = require('cors');

        const dbAdapater = new (require('./utils/dbConfig'))(config.db.host, config.db.port, config.db.env);
        const mongoConnection = await dbAdapater.connect();

        const agendash = require('agendash');
        const scheduler = new (require('./scheduler/scheduler'))(mongoConnection, config.staticUrls.news, config.staticUrls.courses, config.staticUrls.events, config.staticUrls.mensa);

        const apiRoutes = require('./api/routes');



        // Main routine

        /**
         * start express
         */
        const app = express();

        /**
         * start scheduler
         */
        scheduler.run();

        /**
         * start routes
         */
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
        }), agendash(await scheduler.getAgent()));

        app.use('/api', apiRoutes);

        /**
         * init express  
         * */
        app.listen(config.webserver.port, async () => {
            try {
                // dbAdapater.connect();
                Winston.log("Running")
            } catch (e) {
                console.error(e);
            }
        });
    } catch (e) {
        console.error(e);
    }
})()