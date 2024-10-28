import { S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from 'dotenv'
import fs from 'fs'

// Configuracion de Variables de entorno
config()
const AWS_BUCKET_REGION=process.env.AWS_BUCKET_REGION
const AWS_PUBLIC_KEY=process.env.AWS_PUBLIC_KEY
const AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME
const AWS_SECRET_KEY_CPTLN=process.env.AWS_SECRET_KEY_CPTLN

// Comenzar instancia de S3
const s3 = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY_CPTLN
    }
})

//Subir archivos a S3
export async function upload(file, ruta, contentType = undefined) {
    const stream = fs.createReadStream(file.tempFilePath)
    const UploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: ruta,
        Body: stream,
        ContentType: contentType
    }
    const command = new PutObjectCommand(UploadParams)
    const result = await s3.send(command)
    fs.unlink(file.tempFilePath, (err) => {
        if (err) {
            console.error(`Error al eliminar el archivo temporal: ${err}`);
        } else {
            console.log(`Archivo temporal ${file.tempFilePath} eliminado exitosamente.`);
        }
    });
    return result
}


export const getFileURL = async (ruta) =>{
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: ruta
    })
    return await getSignedUrl(s3, command, { expiresIn: 3600})
} 


export default s3