const lineSplitter = require('split-lines');
const crawler = require('crawler-request');

const mongoose = require('mongoose');
const provider = require('../../utils/modelProvider');
const mensa = mongoose.model('mensaplans', provider.getMensaplanSchema());

const pdfUrl = "https://www.studentenwerk.uni-heidelberg.de/sites/default/files/download/pdf/sp-mos-mensa-aktuell.pdf";

exports.run = () => {
    return new Promise((resolve, reject) => {
        updateMensaplan(pdfUrl, resolve, reject)
    })
}

const updateMensaplan = (url, resolve, reject) => {
    crawler(url)
        .then((res) => {
            createJSON(lineSplitter(res.text), resolve, reject);
        })
        .catch((err) => {
            reject(err);
        })
}

const createJSON = (data, resolve, reject) => {
    const monday = [];
    const tuesday = [];
    const wednesday = [];
    const thursday = [];
    const friday = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].match(/\s*Montag\s*/g)/*data[i] == "Montag: " || data[i] == "Montag "*/) {
            for (let j = i + 1; j < data.length; j++) {
                if (data[j] == " ") break;
                monday.push(data[j])
            }
        }
        if (data[i].match(/\s*Dienstag\s*/g)/*data[i] == "Dienstag: " || data[i] == "Dienstag "*/) {
            for (let k = i + 1; k < data.length; k++) {
                if (data[k] == " ") break;
                tuesday.push(data[k])
            }
        }
        if (data[i].match(/\s*Mittwoch\s*/g)/*data[i] == "Mittwoch: " || data[i] == "Mittwoch "*/) {
            for (let l = i + 1; l < data.length; l++) {
                if (data[l] == " ") break;
                wednesday.push(data[l])
            }
        }
        if (data[i].match(/\s*Donnerstag\s*/g)/*data[i] == "Donnerstag: " || data[i] == "Donnerstag "*/) {
            for (let m = i + 1; m < data.length; m++) {
                if (data[m] == " ") break;
                thursday.push(data[m])
            }
        }
        if (data[i].match(/\s*Freitag\s*/g)/*data[i] == "Freitag: " || data[i] == "Freitag "*/) {
            for (let n = i + 1; n < data.length; n++) {
                if (data[n] == " ") break;
                friday.push(data[n])
            }
        }
    }
    const valid = data[5].substr((data[5].length - 11), data[5].length);
    const object = {
        validUntil: valid,
        Montag: monday,
        Dienstag: tuesday,
        Mittwoch: wednesday,
        Donnerstag: thursday,
        Freitag: friday
    };
    updateDatabase(object, resolve, reject);
}

const updateDatabase = (element, resolve, reject) => {
    const data = { validUntil: element["validUntil"], Montag: element["Montag"], Dienstag: element["Dienstag"], Mittwoch: element["Mittwoch"], Donnerstag: element["Donnerstag"], Freitag: element["Freitag"] };
    const options = { upsert: true, new: true, useFindAndModify: false };
    const query = { validUntil: element["validUntil"] };
    mensa.findOneAndUpdate(query, data, options)
        .then((doc) => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
}