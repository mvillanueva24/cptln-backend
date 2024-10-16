import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { AWS_BUCKET_REGION, AWS_BUCKET_NAME, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from './config.js'
import fs from 'fs'

const s3 = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})

export async function upload(file) {
    const stream = fs.createReadStream(file.tempFilePath)
    const UploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    }
    const command = new PutObjectCommand(UploadParams)
    const result = await s3.send(command)
    console.log(result);
}

export async function getItems() {
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    })
    const result = await s3.send(command)
    console.log(result)
}

export async function getItem(filename) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    return await s3.send(command)
}

// export async function getItem(filename) {
//     const command = new GetObjectCommand({
//         Bucket: AWS_BUCKET_NAME,
//         Key: filename
//     })
//     const result = await s3.send(command)
//     result.Body.pipe(fs.createWriteStream(`./images/${filename}.jpg`))
// }