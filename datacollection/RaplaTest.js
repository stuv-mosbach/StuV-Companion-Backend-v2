const axios = require("axios");
const csv = require("csv");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../../utils/Winston"))(config.log).logger;

module.exports = class RaplaTest {

    constructor(url) {
        this.url = url;
    }

    /**
     * 
     * @returns 
     */
    async fetchFromRapla() {
        try {
            return await csv.parse(await axios.get("http://rapla.dhbw.de/rapla/calendar.csv?key=2a9Bq7PTVcTMvCSNwYoQRrO0GK9bccz-i39YnTK__wfzLf7zoDljz6ez6o-rF2FsNTfqDxal3WOuRXkhkcmtBj5Q_Tj-lIMfUEmToGwicEU&salt=11988947&allocatable_id="));
        } catch (error) {
            Winston.error(error);
        }
    }

}