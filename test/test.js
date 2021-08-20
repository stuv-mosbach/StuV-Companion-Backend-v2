"use strict"

describe("Running testsuite", () => {
    it("Start test cycle", async () => {
        try {

            /**
             * Module initialization
             */
            const path = require("path");
            const config = require(path.resolve(process.cwd() + '/config.json'));

            const dbAdapater = new (require('../utils/dbConfig'))(config.db.host, config.db.port, config.db.env);
            const mongoConnection = await dbAdapater.connect();

            const modelProvider = new (require("../utils/modelProvider"))(mongoConnection.dbConnection);

            const coursesProvider = new (require("../datacollection/coursesProvider"))(config.staticUrls.courses, modelProvider.getCourseSchema());
            const mocha_coursesProvider = new (require("./datacollection/MochaCoursesProvider"))(coursesProvider);

            const eventsProvider = new (require("../datacollection/eventsProvider"))(config.staticUrls.events, modelProvider.getEventSchema());
            const mocha_eventsProvider = new (require("./datacollection/MochaEventsProvider"))(eventsProvider);

            const lectureProvider = new (require("../datacollection/lecturesProvider"))(modelProvider.getCourseSchema(), modelProvider.getLectureSchema());
            const mocha_lecturesProvider = new (require("./datacollection/MochaLecturesProvider"))(lectureProvider);

            const mensaplanProvider = new (require("../datacollection/mensaplanProvider"))(config.staticUrls.mensa, modelProvider.getMensaplanSchema());
            const mocha_mensaplanProvider = new (require("./datacollection/MochaMensaplanProvider"))(mensaplanProvider);

            const newsProvider = new (require("../datacollection/newsProvider"))(config.staticUrls.news, modelProvider.getNewsSchema());
            const mocha_newsProvider = new (require("./datacollection/MochaNewsProvider"))(newsProvider);
            
            const raplaTest = new (require("../datacollection/RaplaProvider"))(config.staticUrls.rapla, coursesProvider, lectureProvider);
            const mocha_raplaTest = new (require("./datacollection/MochaRaplaTest"))(raplaTest);
            /************************************* */


            // await mocha_coursesProvider.runTest();
            // await mocha_eventsProvider.runTest();
            // await mocha_lecturesProvider.runTest();
            // await mocha_mensaplanProvider.runTest();
            // await mocha_newsProvider.runTest();            
            await mocha_raplaTest.runTest();
        } catch (error) {
            console.error(error);
        }
    });
});