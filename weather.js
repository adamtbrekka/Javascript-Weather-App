const http = require('http');
const https = require('https');
const api = require('./api.json');

function printWeather(weather){
    const message = `Current temprature in ${weather.current_observation.display_location.city} is ${weather.current_observation.temp_f} Farenheit.`;
    console.log(message);
}



function printError(error){
    console.error(error.message);
}


function get(query) {
    const readableQuery = query.replace('_', ' ');
    try {
        const request = http.get(`http://api.wunderground.com/api/${api.key}/conditions/q/${readableQuery}.json`, response => {
            if (response.statusCode === 200){
                let body = "";

                response.on('data', chunk => {
                    body += chunk.toString();
                });
                response.on('end', () => {
                    try {

                        const weather = JSON.parse(body);

                        if (weather.current_observation){

                            printWeather(weather);
                        } else {
                            const querryError = new Error(`The location "${readableQuery}" was not found.`);
                            printError(querryError);
                        }
                    } catch (error) {

                        printError(error);
                    }
                });
            } else {

                const statusCodeError = new Error(`There was an error getting the message for ${readableQuery}. (${http.STATUS_CODES[response.statusCode]})`);
                printError(statusCodeError);
            }

        });

        request.on('error', printError);
    } catch (error) {

        printError(error);
    }
};

module.exports.get = get;
