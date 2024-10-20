import express from 'express'
import authRoutes from './routes/auth.routes.js'
import devocionalRoutes from './routes/devocional.routes.js'
import eventosRoutes from './routes/eventos.routes.js'
import noticiasRoutes from './routes/noticias.routes.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'

const app = express()

// app.use(cors({
//     origin: 'https://felipe.josedev.net.pe',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// }))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp'
}))

// Librerias
app.use(express.json())
app.use(cookieParser())

//Rutas
app.use('/api', authRoutes)
app.use('/api', devocionalRoutes)
app.use('/api', eventosRoutes)
app.use('/api', noticiasRoutes)

export default app