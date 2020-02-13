var url = process.env.DB_HOST;
var port = process.env.DB_PORT;
var env = "Prod";

exports.getDBUrl = () => {
    return url + ":" + port
}

exports.getEnv = () => {
    return "/" + env;
}