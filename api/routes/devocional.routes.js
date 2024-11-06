import { Router } from 'express'
import { devocionales, devocionalesPagination, devocionalHoy, crearDevocional, editarDevocional, devocionalFound, eliminarDevocional } from '../controllers/devocional.controller.js'

const router = Router()

// Cliente
router.get('/devocionales',devocionales)
router.get('/devocionales/hoy',devocionalHoy)
router.get('/devocionales/pagination',devocionalesPagination)
router.get('/devocionales/:id',devocionalFound)

// Administracion
router.get('/admin/devocionales',devocionales)
router.get('/admin/devocionales/pagination',devocionalesPagination)
router.get('/admin/devocionales/:id',devocionalFound)
router.post('/admin/devocionales',crearDevocional)
router.post('/admin/devocionales/delete', eliminarDevocional)
router.post('/admin/devocionales/:id',editarDevocional)

export default router