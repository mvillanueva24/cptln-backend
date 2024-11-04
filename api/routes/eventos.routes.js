import { Router } from 'express'
import { eventos, eventosPagination, buscarEvento, crearEvento, editarEvento, eliminarEvento } from '../controllers/evento.controller.js'

const router = Router()

router.get('/eventos',eventos)
router.get('/eventos/pagination',eventosPagination)
router.get('/eventos/:id',buscarEvento)

router.post('/eventos',crearEvento)
router.post('/eventos/delete',eliminarEvento)
router.post('/eventos/:id',editarEvento)

export default router