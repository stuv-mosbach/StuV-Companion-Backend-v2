
const iCalParser = require('../../utils/iCalParser');

const mongoose = require('mongoose');
const provider = require('../../utils/modelProvider');
const event = mongoose.model('events', provider.getEventSchema());

const calendarUrl = "https://calendar.google.com/calendar/ical/asta.dhbw.de_08mkcuqcrppq8cg8vlutdsgpjg%40group.calendar.google.com/public/basic.ics";

exports.run = () => {
    return new Promise((resolve, reject) => {
        updateEvents(calendarUrl, resolve, reject);
    })
}

const updateEvents = (url, resolve, reject) => {
    iCalParser.main(calendarUrl)
        .then((data) => {
            data.events.forEach(element => {
                updateDatabase(element, reject);
            });
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
}

const updateDatabase = (element, reject) => {
    const data = { dtstart: element["dtstart"], dtend: element["dtend"], dtstamp: element["dtstamp"], uid: element["uid"], created: element["created"], description: element["description"], 'last-modified': element["last-modified"], location: element["location"], sequence: element["sequence"], status: element["status"], summary: element["summary"], transp: element["transp"] };
    const options = { upsert: true, new: true, useFindAndModify: false };
    const query = { uid: element["uid"] };

    event.findOneAndUpdate(query, data, options)
        .then((doc) => {

        })
        .catch((err) => {
            reject(err);
        });
}