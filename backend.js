"use strict";

const path = require('path');
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("./utils/Winston"))(config.log).logger;

process.on("uncaughtExceptionMonitor", (err, origin) => {
    Winston.error(`child with pid=${process.pid} crashed with ${err} at`, origin);
    process.exit(-1);
});

process.on("unhandledRejection", (e, origin) => {
    Winston.error(`Unhandled rejection in child with pid=${process.pid}. Crashed with ${e} at`, origin);
    process.exit(-1);
});

process.on("uncaughtException", (e) => {
    Winston.error(`Uncaught exception in child with pid=${process.pid}: ${e}`);
    process.exit(-1);
});

process.on("exit", (code) => {
    Winston.error(`process exit with code ${code}`);
});

(async function () {
    try {
        require('dotenv').config();
        const express = require('express');
        const basicAuth = require('express-basic-auth');
        const cors = require('cors');
        const agendash = require('agendash');

        const dbAdapater = new (require('./utils/dbConfig'))(config.db.host, config.db.port, config.db.env);
        const mongoConnection = await dbAdapater.connect();

        const ModelProvider = new (require("./utils/modelProvider"))(mongoConnection.dbConnection);

        const scheduler = new (require('./scheduler/scheduler'))(await dbAdapater.getDBUrl(), ModelProvider, config.staticUrls.news, config.staticUrls.courses, config.staticUrls.events, config.staticUrls.mensa);
        const agent = await scheduler.getAgent();

        const apiRoutes = new (require('./api/routes'))(ModelProvider);



        // Main routine

        /**
         * start express
         */
        const app = express();

        /**
         * start scheduler
         */
        await scheduler.run();

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
        }), agendash(agent.agent));

        app.use('/api', apiRoutes.router);

        /**
         * init express  
         * */
        app.listen(config.webserver.port, async () => {
            try {
                Winston.info(`Server up and Running on port: ${config.webserver.port}`);
            } catch (e) {
                Winston.error(e);
            }
        });
    } catch (e) {
        Winston.error(e);
    }
})()