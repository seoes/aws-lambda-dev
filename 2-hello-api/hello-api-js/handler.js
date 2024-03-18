"use strict";

module.exports.hello = async (event) => {
    if (!event.queryStringParameters || !event.queryStringParameters.name) {
        return { statusCode: 404, body: "not found" };
    }
    return {
        statusCode: 200,
        body: `hello ${event.queryStringParameters.name}`,
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
