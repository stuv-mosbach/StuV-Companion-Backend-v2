const axios = require('axios');

const mongoose = require('mongoose');
const provider = new (require('../../utils/modelProvider'));
const courses = mongoose.model('courses', provider.getCourseSchema());

const courseUrl = "http://ics.mosbach.dhbw.de/ics/calendars.list";

exports.run = () => {
    return new Promise((resolve, reject) => {
        updateCourses(courseUrl, resolve, reject)
    })
}

const updateCourses = (url, resolve, reject) => {
    axios.get(url)
        .then((res) => {
            const coursesArray = formatAndCleanUp(res.data);
            coursesArray.forEach(element => {
                updateDatabase(element, reject);
            });
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
}

const formatAndCleanUp = (data) => {
    const result = [];
    const year = (new Date()).getFullYear().toString().substr(2);
    const lines = data.split('\n');
    lines.forEach(element => {
        const entry = element.split(';');
        if ((entry[0].match(/\d+/g)) != null && (entry[0].match(/\d+/g))[0] > (year - 4)) {
            result.push({ course: entry[0], url: entry[1] });
        }
    });
    return result;
}

const updateDatabase = (element, reject) => {
    const data = { course: element["course"], url: element["url"] };
    const options = { upsert: true, new: true, useFindAndModify: false };
    const query = { course: element["course"] };

    courses.findOneAndUpdate(query, data, options)
        .then((doc) => {

        })
        .catch((err) => {
            reject(err);
        });
}
