import { Router } from 'express'
import { programas, programasPagination, programasPorCategoria, crearPrograma } from '../controllers/programa.controller.js'

const router = Router()

router.get('/programa',programas)
router.get('/programa/pagination',programasPagination)
router.post('/programa/nombre', programasPorCategoria)
router.post('/programa',crearPrograma)

// router.post('/programa/delete', estadoNoticias)
// router.post('/programa/:id',editarNoticias)

export default router