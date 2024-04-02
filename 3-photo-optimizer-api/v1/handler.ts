import * as crypto from "crypto";
import * as fs from "fs";
import * as tar from "tar";
import * as childProcess from "child_process";
import * as AWS from "aws-sdk";
import dotenv from "dotenv";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

dotenv.config();

const s3 = new AWS.S3();

async function s3Exists(bucketName: string, key: string): Promise<boolean> {
    try {
        await s3.headObject({ Bucket: bucketName, Key: key }).promise();
        return true;
    } catch (error: any) {
        console.error(error);
        if (error.code === "Forbidden") {
            return false;
        }
        throw error;
    }
}

export const optimizeAndUpload: APIGatewayProxyHandlerV2 = async (event) => {
    if (!event.body || !event.isBase64Encoded) return { statusCode: 400 };

    const buffer = Buffer.from(event.body, "base64");
    const hash = crypto.createHash("md5").update(buffer).digest("hex");
    const filePath = `/tmp/${hash}.jpg`;

    fs.writeFileSync(filePath, buffer);

    const resultKey = `${hash}.jpg`;
    const cdnURL = `https://${process.env.SUB_DOMAIN}.${process.env.ROOT_DOMAIN}/${resultKey}`;

    try {
        if (await s3Exists(process.env.BUCKET_NAME!, resultKey)) {
            return { cdnURL };
        }
        await unpackJpegoptim();

        fs.chmodSync("/tmp/bin/jpegoptim", "755");
        childProcess.execSync(`${jpegoptimPath} -o -s -m80 ${filePath}`);

        await s3
            .upload({
                Bucket: process.env.BUCKET_NAME!,
                Key: `${hash}.jpg`,
                Body: fs.createReadStream(filePath),
                ContentType: "image/jpeg",
            })
            .promise();
        return { cdnURL };
    } catch (error: any) {
        console.error(error);
        return { msg: error.message };
    } finally {
        fs.unlinkSync(filePath);
    }
};

const jpegoptimPath = "/tmp/bin/jpegoptim";
const jpegoptimPackFile = "./jpegoptim.tar.gz";

async function unpackJpegoptim(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        console.log(`Extracting jpegoptim to ${jpegoptimPath}`);
        if (fs.existsSync(jpegoptimPath)) {
            console.log("jpegoptim already exists");
            return resolve();
        } else {
            console.log("jpegoptim does not exist, unpacking...");
            fs.createReadStream(jpegoptimPackFile)
                .pipe(tar.x({ strip: 1, C: "/tmp" }).on("error", reject).on("close", resolve))
                .on("error", reject);
        }
    });
}
