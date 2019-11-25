var iCalParser = require('../../utils/iCalParser');

var mongoose = require('mongoose');
var provider = require('../../utils/modelProvider');
var lecture = mongoose.model('lectures', provider.getLectureSchema());

exports.run = () => {
    return new Promise((resolve, reject) => {
        updateLectures(resolve, reject);
    })
}

const updateLectures = (resolve, reject) => {
    var courses = loadCourses(reject);
    var date = (new Date()).toString();
    courses.forEach(element => {
        iCalParser.main(element.url)
            .then((res) => {
                res.forEach(e => {
                    e.course = element.course;
                    updateDatabase(e, date, reject);
                });
                cleanUp(date, reject);
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

const updateDatabase = (element, date, reject) => {
    const data = {uid: element["uid"], dtstamp: element["dtstamp"], dtstart: element["dtstart"], class: element["class"], created: element["created"], description: element["description"], 'last-modified': element["last-modified"], location: element["location"], summary: element["summary"], dtend: element["dtend"], course: element["course"], lastTouched: date};
    const options = { upsert: true, new: true, useFindAndModify: false };
    const query = { uid: element["uid"] };
    lecture.findOneAndUpdate(query, data, options)
    .then((doc) => {
        resolve();
    })
    .catch((err) => {
        reject(err);
    });
}

const cleanUp = (date, reject) => {
    const query = {lastTouched: {$ne: date}};
    lecture.find(query).remove();
}

const loadCourses = (reject) => {
    lecture.find({})
        .then((res) => {
            return res;
        })
        .catch((err) => {
            reject(err);
        })
}