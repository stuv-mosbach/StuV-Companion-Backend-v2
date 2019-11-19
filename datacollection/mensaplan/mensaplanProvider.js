var lineSplitter = require('split-lines');
var crawler = require('crawler-request');

var mongoose = require('mongoose');
var provider = require('../../utils/modelProvider');

var pdfUrl = "https://www.studentenwerk.uni-heidelberg.de/sites/default/files/download/pdf/sp-mos-mensa-aktuell.pdf";

exports.run = () => {
    return new Promise((resolve, reject) => {
        updateMensaplan(pdfUrl, resolve, reject)
    })
}

const updateMensaplan = (url, resolve, reject) => {

}