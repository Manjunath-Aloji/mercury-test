import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME as string;

const uploadImage = async (file_name: string, base64: string) => {
    // const buffer = Buffer.from(base64, "base64");
    const buffer = Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
    );
    const params: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: file_name,
        Body: buffer,
        ContentType: "image/jpeg",
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return `${process.env.AWS_S3_BUCKET_URL}/${file_name}`;
    } catch (error) {
        // console.error("Error uploading image:", error);
        throw new Error("Failed to upload image");
    }
};

export { uploadImage };