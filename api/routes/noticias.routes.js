import { Router } from 'express'
import { devocionales, devocionalHoy, crearDevocional, editarDevocional, devocionalFound, test } from '../controllers/devocional.controller.js'

const router = Router()

router.get('/devocionales',devocionales)
router.get('/devocionales/hoy',devocionalHoy)
router.get('/devocionales/:id',devocionalFound)
router.post('/devocionales',crearDevocional)
router.post('/devocionales/:id',editarDevocional)
router.post('/test',test)

export default router