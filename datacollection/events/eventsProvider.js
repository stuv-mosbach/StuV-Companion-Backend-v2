"use strict"

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../../utils/Winston"))(config.log).logger;

const iCalParser = new (require('../../utils/iCalParser'))();

// const provider = new (require('../../utils/modelProvider'))();
// const eventSchema = provider.getEventSchema();

// const calendarUrl = "https://calendar.google.com/calendar/ical/asta.dhbw.de_08mkcuqcrppq8cg8vlutdsgpjg%40group.calendar.google.com/public/basic.ics";

module.exports = class EventsProvider {
    constructor(url, event) {
        this.calendarUrl = url;
        // this.dbConnection = dbConnection;

        this.event = event; //this.dbConnection.model("event", eventSchema);

    }

    /**
     * 
     * @param {Object} element 
     * @returns {Object} {status: {Number}} - e.g. { status: -1 }
     */
    async updateDatabase(element) {
        try {
            const data = { dtstart: element["dtstart"], dtend: element["dtend"], dtstamp: element["dtstamp"], uid: element["uid"], created: element["created"], description: element["description"], 'last-modified': element["last-modified"], location: element["location"], sequence: element["sequence"], status: element["status"], summary: element["summary"], transp: element["transp"] };
            const options = { upsert: true, new: true, useFindAndModify: false };
            const query = { uid: element["uid"] };

            await this.event.findOneAndUpdate(query, data, options);
            return { status: 1 };
        } catch (e) {
            Winston.error(e);
            return { status: -1 };
        }
    }

    /**
     * 
     * @returns {Object} {status: {Number}} - e.g. { status: -1 }
     */
    async updateEvents() {
        try {
            const res = await iCalParser.main(this.calendarUrl);
            if(res.status <= 0) throw new Error(`Can't parse events`);
            for (const element of res.events) {
                await this.updateDatabase(element);
            }
            return { status: 1 };
        } catch (e) {
            Winston.error(e);
            return { status: -1 };
        }

    }
}