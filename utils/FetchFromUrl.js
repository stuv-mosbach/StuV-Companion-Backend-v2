const axios = require("axios");

module.exports = class FetchFromUrl{
    constructor(){

        this.isValidUrl = (url)=>{
            try {
                new URL(url);
                return true;
            } catch (error) {
                throw error;
            }
        }
    }

    async fetch(url){
        try {
            this.isValidUrl();
            return await axios.get(url);
        } catch (error) {
            throw error;
        }
    }
}