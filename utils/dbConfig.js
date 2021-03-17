const url = process.env.DB_HOST;
const port = process.env.DB_PORT;
const env = "Prod";

exports.getDBUrl = () => {
    return url + ":" + port
}

exports.getEnv = () => {
    return env;
}
