import type { AWS } from "@serverless/typescript";
import resources from "./s3-cloudfront";
import dotenv from "dotenv";

dotenv.config();

const config: AWS = {
    service: "photo-optimizer-api",
    frameworkVersion: "3",
    provider: {
        environment: {
            BUCKET_NAME: process.env.BUCKET_NAME!,
            ROOT_DOMAIN: process.env.ROOT_DOMAIN!,
            SUB_DOMAIN: process.env.SUB_DOMAIN!,
        },
        iam: {
            role: {
                statements: [
                    {
                        Action: ["s3:PutObject", "s3:GetObject"],
                        Effect: "Allow",
                        Resource: `arn:aws:s3:::${process.env.BUCKET_NAME}/*`,
                    },
                ],
            },
        },
        name: "aws",
        runtime: "nodejs20.x",
        region: "ap-northeast-2",
    },
    functions: {
        optimizeAndUpload: {
            handler: "handler.optimizeAndUpload",
            events: [
                {
                    httpApi: {
                        path: "/optimizeAndUpload",
                        method: "put",
                    },
                },
            ],
        },
    },
    plugins: ["serverless-plugin-scripts", "serverless-webpack"],
    custom: {
        scripts: {
            hooks: {
                "webpack:package:packageModules": "cp jpegoptim.tar.gz .webpack/service",
            },
        },
    },
    resources,
};

export = config;
