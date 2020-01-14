var router = require('express').Router();
var mongoose = require('mongoose');
var provider = require('../utils/modelProvider');

var course = mongoose.model('courses', provider.getCourseSchema());
var lecture = mongoose.model('lectures', provider.getLectureSchema());
var event = mongoose.model('events', provider.getEventSchema());
var mensa = mongoose.model('mensaplans', provider.getMensaplanSchema());
var news = mongoose.model('news', provider.getNewsSchema());

router.get('/courses', (req, res) => {
  course.find((err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => response.push(e.course));
    res.json(response);
  });
});

router.get('/lectures/:course', (req, res) => {
  lecture.find({course: req.params.course.toUpperCase()}, (err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => response.push({start: e.dtstart, end: e.dtend, lastModified: e['last-modified'], title: e.summary, description: e.description, location: e.location, course: e.course}));
    if (res == []) res.json({error: "No course found or there are no lectures yet!"});
    else res.json(response);
  });
});

router.get('/futureLectures/:course', (req, res) => {
  lecture.find({course: req.params.course.toUpperCase()}, (err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => {
      if((new Date(e.dtstart)) >= (new Date())) response.push({start: e.dtstart, end: e.dtend, lastModified: e['last-modified'], title: e.summary, description: e.description, location: e.location, course: e.course});
    });
    if (res == []) res.json({error: "No course found or there are no lectures yet!"});
    else res.json(response);
  });
});

router.get('/getToday/:course', async (req, res) => {
  var response = [];
  var men = [];
  var lec = [];
  var fee = [];
  var eve = [];
  //Todays meals
  mensa.find((err, data) => {
    if (err) res.json(err);
    data.forEach(e => {
      if ((new Date()).getMonth() + 1 == e.validUntil.substring(3, 5) && (new Date()).toJSON().substring(8,10) <= e.validUntil.substring(0, 2)) men.push({validUntil: e.validUntil, montag: e.Montag, dienstag: e.Dienstag, mittwoch: e.Mittwoch, donnerstag: e.Donnerstag, freitag: e.Freitag});
    });
    //Todays lectures
    lecture.find({course: req.params.course.toUpperCase()}, (err, data) => {
      if (err) res.json(err);
      data.forEach(e => {
        if((new Date(e.dtstart)).setHours(0, 0, 0, 0) == (new Date()).setHours(0, 0, 0, 0)) lec.push({start: e.dtstart, end: e.dtend, lastModified: e['last-modified'], title: e.summary, description: e.description, location: e.location, course: e.course});
      });
      //New news
      news.find((err, data) => {
        if (err) res.json(err);
        data.forEach(e => {
          if((new Date(e.isoDate)).setHours(0, 0, 0, 0) == (new Date()).setHours(0, 0, 0, 0)) fee.push({title: e.title, description: e['content:encoded'], url: e.link, created: new Date(e.isoDate)});
        });
        //Todays events
        event.find((err, data) => {
          if (err) res.json(err);
          data.forEach(e => {
            if ((new Date(e.dtstart)).setHours(0, 0, 0, 0) == (new Date()).setHours(0, 0, 0, 0)) eve.push({start: e.dtstart, end: e.dtend, lastModified: e['last-modified'],title: e.summary, description: e.description,  location: e.location});
          });
          eve.reverse();
          response.push(men);
          response.push(lec);
          response.push(fee);
          response.push(eve);
          res.json(response);
        });
      });
    });
  });
});

router.get('/events', (req, res) => {
  event.find((err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => {
      if((new Date(e.dtstart).setHours(0,0,0,0)) >= (new Date().setHours(0,0,0,0))) response.push({start: e.dtstart, end: e.dtend, lastModified: e['last-modified'],title: e.summary, description: e.description,  location: e.location});
    });
    response.sort((a, b) => {return new Date(a.start) - new Date(b.start)});
    res.json(response);
  });
});

router.get('/mensaplan', (req, res) => {
  mensa.find((err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => {
      if ((new Date()).getMonth() + 1 == e.validUntil.substring(3, 5) && (new Date()).toJSON().substring(8,10) <= e.validUntil.substring(0, 2)) response.push({validUntil: e.validUntil, montag: e.Montag, dienstag: e.Dienstag, mittwoch: e.Mittwoch, donnerstag: e.Donnerstag, freitag: e.Freitag});
    });
    res.json(response);
  });
});

router.get('/news', (req, res) => {
  news.find((err, data) => {
    if (err) res.json(err);
    var response = [];
    data.forEach(e => response.push({title: e.title, description: e['content:encoded'], url: e.link, created: new Date(e.isoDate)}));
    response.reverse();
    res.json(response);
  });
});

module.exports = router;