import express from 'express'
import authRoutes from './routes/auth.routes.js'
import devocionalRoutes from './routes/devocional.routes.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: ['https://felipe.josedev.net.pe','http://localhost:5173'],
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp'
}))
app.use(express.json())
app.use(cookieParser())

//Rutas
app.use('/api', authRoutes)
app.use('/api', devocionalRoutes)


export default app