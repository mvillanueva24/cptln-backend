import { Router } from 'express'
import { devocionales, devocionalHoy, crearDevocional, editarDevocional } from '../controllers/devocional.controller.js'

const router = Router()

router.get('/devocionales',devocionales)
router.get('/devocionales',devocionalHoy)
router.post('/devocionales',crearDevocional)
router.post('/devocionales',editarDevocional)

export default router