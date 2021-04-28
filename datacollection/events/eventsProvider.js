
const iCalParser = new (require('../../utils/iCalParser'))();

const mongoose = require('mongoose');
const provider = new (require('../../utils/modelProvider'))();
const event = mongoose.model('events', provider.getEventSchema());

// const calendarUrl = "https://calendar.google.com/calendar/ical/asta.dhbw.de_08mkcuqcrppq8cg8vlutdsgpjg%40group.calendar.google.com/public/basic.ics";

module.exports = class EventsProvider {
    constructor(url) {
        this.calendarUrl = url;
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

            await event.findOneAndUpdate(query, data, options);
            return { status: 1 };
        } catch (e) {
            console.error(e);
            return { status: -1 };
        }
    }

    /**
     * 
     * @returns {Object} {status: {Number}} - e.g. { status: -1 }
     */
    async updateEvents() {
        try {
            const data = await iCalParser.main(this.calendarUrl)
            for (const element of data) {
                await this.updateDatabasetabase(element);
            }
            return { status: 1 };
        } catch (e) {
            console.error(e);
            return { status: -1 };
        }

    }
}