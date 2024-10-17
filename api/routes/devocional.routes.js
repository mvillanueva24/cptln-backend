import { Router } from 'express'
import { devocionales, devocionalHoy, crearDevocional, editarDevocional } from '../controllers/devocional.controller.js'

const router = Router()

router.get('/devocionales',devocionales)
router.get('/devocionales/hoy',devocionalHoy)
router.post('/devocionales',crearDevocional)
router.post('/devocionales/:id',editarDevocional)

export default router