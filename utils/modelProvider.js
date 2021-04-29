"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = class ModelProvider {
    constructor() {
        this.newsSchema = new Schema({
            creator: String,
            title: String,
            link: String,
            pubDate: String,
            'content:encoded': String,
            'dc:creator': String,
            content: String,
            contentSnippet: String,
            guid: String,
            isoDate: String
        });

        this.courseSchema = new Schema({
            course: String,
            url: String
        });

        this.eventSchema = new Schema({
            dtstart: String,
            dtend: String,
            dtstamp: String,
            uid: String,
            created: String,
            description: String,
            'last-modified': String,
            location: String,
            sequence: Number,
            status: String,
            summary: String,
            transp: String
        });

        this.mensaplanSchema = new Schema({
            validUntil: String,
            Montag: [String],
            Dienstag: [String],
            Mittwoch: [String],
            Donnerstag: [String],
            Freitag: [String]
        });

        this.lectureSchema = new Schema({
            uid: String,
            dtstamp: String,
            dtstart: String,
            class: String,
            created: String,
            description: String,
            'last-modified': String,
            location: String,
            summary: String,
            dtend: String,
            course: String,
            lastTouched: String
        });
    }

    getNewsSchema() { return this.newsSchema };

    getCourseSchema() { return this.courseSchema };

    getEventSchema() { return this.eventSchema };

    getMensaplanSchema() { return this.mensaplanSchema };

    getLectureSchema() { return this.lectureSchema };

}