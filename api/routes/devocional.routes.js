import { Router } from 'express'
import { devocionales, devocionalesPagination, devocionalHoy, crearDevocional, editarDevocional, devocionalFound, eliminarDevocional } from '../controllers/devocional.controller.js'
import { authRequired } from '../middleware/validateToken.js'

const router = Router()

// Cliente
router.get('/devocionales',devocionales)
router.get('/devocionales/hoy',devocionalHoy)
router.get('/devocionales/pagination',devocionalesPagination)
router.get('/devocionales/:id',devocionalFound)

// Administracion
router.get('/admin/devocionales', authRequired, devocionales)
router.get('/admin/devocionales/pagination', authRequired, devocionalesPagination)
router.get('/admin/devocionales/:id', authRequired, devocionalFound)
router.post('/admin/devocionales', authRequired, crearDevocional)
router.post('/admin/devocionales/delete', authRequired, eliminarDevocional)
router.post('/admin/devocionales/:id',authRequired, editarDevocional)

export default router