import type { AWS } from "@serverless/typescript";

const config: AWS = {
    service: "hello-api-ts",
    frameworkVersion: "3",
    provider: {
        name: "aws",
        runtime: "nodejs18.x",
        region: "ap-northeast-2",
        logs: {
            httpApi: true,
        },
        httpApi: {
            metrics: true,
        },
    },
    functions: {
        hello: {
            handler: "handler.hello",
            events: [
                {
                    http: {
                        path: "/hello",
                        method: "get",
                    },
                },
            ],
        },
    },
    plugins: ["serverless-webpack"],
};

export = config;
