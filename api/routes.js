"use strict";

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../utils/Winston"))(config.log).logger;


// const mongoose = require('mongoose');
// const provider = new (require('../utils/modelProvider'));


module.exports = class ApiRoutes {

  /**
   * 
   * @param {ModelProvider} ModelProvider 
   */
  constructor(ModelProvider) {
    this.router = require('express').Router();

    this.ModelProvider = ModelProvider;

    this.courses = this.ModelProvider.getCourseSchema();
    this.lecture = this.ModelProvider.getLectureSchema();
    this.event = this.ModelProvider.getEventSchema();
    this.mensa = this.ModelProvider.getMensaplanSchema();
    this.news = this.ModelProvider.getNewsSchema();

    this.router.get('/courses', (req, res) => {
      try {
        this.courses.find((err, data) => {
          if (err) res.json(err);
          const response = [];
          data.forEach(e => response.push(e.course));
          res.json(response);
        });
      } catch (e) {
        Winston.error(e);
      }
    });

    this.router.get('/lectures/:course', (req, res) => {
      try {
        this.lecture.find({ course: req.params.course.toUpperCase() }, (err, data) => {
          if (err) res.json(err);
          const response = [];
          data.forEach(e => response.push({ start: e.dtstart, end: e.dtend, lastModified: e['last-modified'], title: e.summary, description: e.description, location: e.location, course: e.course }));
          if (res == []) res.json({ error: "No course found or there are no lectures yet!" });
          else res.json(response);
        });

      } catch (e) {
        Winston.error(e);
      }
    });

    this.router.get('/futureLectures/:course', (req, res) => {
      try {
        this.lecture.find({ course: req.params.course.toUpperCase() }, (err, data) => {
          if (err) res.json(err);
          const response = [];
          data.forEach(e => {
            if ((new Date(e.dtstart)) >= (new Date())) response.push({ start: e.dtstart, end: e.dtend, lastModified: e['last-modified'], title: e.summary, description: e.description, location: e.location, course: e.course });
          });
          if (res == []) res.json({ error: "No course found or there are no lectures yet!" });
          else res.json(response);
        });
      } catch (e) {
        Winston.error(e);
      }
    });

    this.router.get('/getToday/:course', async (req, res) => {
      try {
        const response = [];
        const men = [];
        const lec = [];
        const fee = [];
        const eve = [];
        //Todays meals
        this.mensa.find((err, data) => {
          if (err) res.json(err);
          data.forEach(e => {
            if ((new Date()).getMonth() + 1 == e.validUntil.substring(3, 5) && (new Date()).toJSON().substring(8, 10) <= e.validUntil.substring(0, 2)) men.push({ validUntil: e.validUntil, montag: e.Montag, dienstag: e.Dienstag, mittwoch: e.Mittwoch, donnerstag: e.Donnerstag, freitag: e.Freitag });
          });
          //Todays lectures
          this.lecture.find({ course: req.params.course.toUpperCase() }, (err, data) => {
            if (err) res.json(err);
            data.forEach(e => {
              if ((new Date(e.dtstart)).setHours(0, 0, 0, 0) == (new Date()).setHours(0, 0, 0, 0)) lec.push({ start: e.dtstart, end: e.dtend, lastModified: e['last-modified'], title: e.summary, description: e.description, location: e.location, course: e.course });
            });
            //New news
            this.news.find((err, data) => {
              if (err) res.json(err);
              data.forEach(e => {
                if ((new Date(e.isoDate)).setHours(0, 0, 0, 0) == (new Date()).setHours(0, 0, 0, 0)) fee.push({ title: e.title, description: e['content:encoded'], url: e.link, created: new Date(e.isoDate) });
              });
              //Todays events
              this.event.find((err, data) => {
                if (err) res.json(err);
                data.forEach(e => {
                  if ((new Date(e.dtstart)).setHours(0, 0, 0, 0) == (new Date()).setHours(0, 0, 0, 0)) eve.push({ start: e.dtstart, end: e.dtend, lastModified: e['last-modified'], title: e.summary, description: e.description, location: e.location });
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
      } catch (e) {
        Winston.error(e);
      }
    });

    this.router.get('/events', (req, res) => {
      try {
        this.event.find((err, data) => {
          if (err) throw new Error(err);//res.json(err);
          const response = [];
          for (const element of data) {
            if (new Date(element.dtstart).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
              response.push({ start: element.dtstart, end: element.dtend, lastModified: element['last-modified'], title: element.summary, description: element.description, location: element.location })
            }
          }
          response.sort((a, b) => { return new Date(a.start) - new Date(b.start) });
          return res.json(response);
        });
      } catch (e) {
        Winston.error(e);
        response.status(500);
        return response.end(e.message);
      }
    });

    this.router.get('/mensaplan', (req, res) => {
      try {
        this.mensa.find((err, data) => {
          if (err) res.json(err);
          const response = [];
          data.forEach(e => {
            if ((new Date()).getMonth() + 1 == e.validUntil.substring(3, 5) && (new Date()).toJSON().substring(8, 10) <= e.validUntil.substring(0, 2)) response.push({ validUntil: e.validUntil, montag: e.Montag, dienstag: e.Dienstag, mittwoch: e.Mittwoch, donnerstag: e.Donnerstag, freitag: e.Freitag });
          });
          res.json(response);
        });
      } catch (e) {
        Winston.error(e);
      }
    });

    this.router.get('/news', (req, res) => {
      try {
        this.news.find((err, data) => {
          if (err) res.json(err);
          const response = [];
          data.forEach(e => response.push({ title: e.title, description: e['content:encoded'], url: e.link, created: new Date(e.isoDate) }));
          response.reverse();
          res.json(response);
        });
      } catch (e) {
        Winston.error(e);
      }
    });

  }
}