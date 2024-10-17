import express from 'express'
import authRoutes from './routes/auth.routes.js'
import devocionalRoutes from './routes/devocional.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

//Rutas
app.use('/api', authRoutes)
app.use('/api', devocionalRoutes)


export default app