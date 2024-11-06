import { Router } from 'express'
import { eventos, eventosPagination, buscarEvento, crearEvento, editarEvento, eliminarEvento } from '../controllers/evento.controller.js'

const router = Router()

// Cliente
router.get('/eventos',eventos)

// Administracion
router.get('/admin/eventos',eventos)
router.get('/admin/eventos/pagination',eventosPagination)
router.get('/admin/eventos/:id',buscarEvento)
router.post('/admin/eventos',crearEvento)
router.post('/admin/eventos/delete',eliminarEvento)
router.post('/admin/eventos/:id',editarEvento)

export default router