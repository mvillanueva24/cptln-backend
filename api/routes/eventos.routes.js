import { Router } from 'express'
import { eventos, eventosPagination, buscarEvento, crearEvento, editarEvento, eliminarEvento } from '../controllers/evento.controller.js'
import { authRequired } from '../middleware/validateToken.js'

const router = Router()

// Cliente
router.get('/eventos',eventos)

// Administracion
router.get('/admin/eventos', authRequired, eventos)
router.get('/admin/eventos/pagination', authRequired, eventosPagination)
router.get('/admin/eventos/:id', authRequired, buscarEvento)
router.post('/admin/eventos', authRequired, crearEvento)
router.post('/admin/eventos/delete', authRequired, eliminarEvento)
router.post('/admin/eventos/:id', authRequired, editarEvento)

export default router