import { Router } from 'express'
import { eventos, buscarEvento, crearEvento, editarEvento, estadoEvento } from '../controllers/evento.controller.js'

const router = Router()

router.get('/eventos',eventos)
router.get('/eventos/:id',buscarEvento)

router.post('/eventos',crearEvento)
router.post('/eventos/delete',estadoEvento)
router.post('/eventos/:id',editarEvento)

export default router