var iCalParser = require('../../utils/iCalParser');

var mongoose = require('mongoose');
var provider = require('../../utils/modelProvider');
var lecture = mongoose.model('lectures', provider.getLectureSchema());

exports.run = () => {
    return new Promise((resolve, reject) => {

    })
}

const updateLectures = (resolve, reject) => {
    var courses = loadCourses(reject);
    courses.forEach(element => {
        iCalParser.main(element.url)
            .then((res) => {
                res.forEach(e => {
                    e.course = element.course;
                    updateDatabase(e, reject);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

const updateDatabase = (element, reject) => {
    const data = {uid: element["uid"]};
    const options = { upsert: true, new: true, useFindAndModify: false };
    const query = { validUntil: element["validUntil"] };
    
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