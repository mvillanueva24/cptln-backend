import { Router } from 'express'
import { devocionales, devocionalesPagination, devocionalHoy, crearDevocional, editarDevocional, devocionalFound, cambiarEstadoDevocional } from '../controllers/devocional.controller.js'

const router = Router()

router.get('/devocionales',devocionales)
router.get('/devocionales/pagination',devocionalesPagination)
router.get('/devocionales/hoy',devocionalHoy)
router.get('/devocionales/:id',devocionalFound)

router.post('/devocionales',crearDevocional)
router.post('/devocionales/delete', cambiarEstadoDevocional)
router.post('/devocionales/:id',editarDevocional)

export default router