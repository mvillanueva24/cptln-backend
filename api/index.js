import express from 'express'
import cors from 'cors'
import { conectDB } from "./db.js"
import { getItems, upload, getItem } from './s3.js'
import fileUpload from 'express-fileupload'

const app = express()
conectDB()

// app.use(cors({
//     origin:'*'
// }))

// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: './uploads'
// }))

app.get('/', (req, res)=>{
    console.log('Respuesta en consola')
    res.json({'message':'Conectado con la API'})
})

app.post('/', (req, res)=>{
    console.log('Solicitandodatos en consola')
    res.json({'message':'Mandando datos a la API'})
})

// app.post('/files', async (req, res)=>{
//     await upload(req.files.file)
//     console.log(req.files.file)
//     res.json({'message':'welcome to s3'})
// })

// app.get('/files', async (req, res)=>{
//     await getItems()
//     res.json({'message':'welcome to s3'})
// })

// app.get('/files/:filename', async(req, res)=> {
//     console.log(req.params.filename)
//     const result = await getItem(req.params.filename)
//     res.status(200).json(result.$metadata)
//     console.log(result.$metadata)
// })

app.listen(3000)
export default app
    