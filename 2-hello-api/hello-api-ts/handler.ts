import { APIGatewayProxyEventV2 } from "aws-lambda";
import "source-map-support/register";

export async function hello(event: APIGatewayProxyEventV2) {
    if (!event.queryStringParameters || !event.queryStringParameters.name) {
        return { statusCode: 404, body: "not found" };
    }
    const message = `hello ${event.queryStringParameters.name}`;
    console.log(message);
    return {
        statusCode: 200,
        body: message,
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
