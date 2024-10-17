import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import fs from 'fs'

// Configuracion de Variables de entorno
config()
const AWS_BUCKET_REGION=process.env.AWS_BUCKET_REGION
const AWS_PUBLIC_KEY=process.env.AWS_PUBLIC_KEY
const AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME
const AWS_SECRET_KEY=process.env.AWS_SECRET_KEY

// Comenzar instancia de S3
const s3 = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})

//Subir archivo a S3
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