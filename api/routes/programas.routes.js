import { Router } from 'express'
import { programas, programasPagination, borrarPrograma, buscarPrograma, programasPorCategoria, crearPrograma } from '../controllers/programa.controller.js'

const router = Router()

router.get('/programa',programas)
router.get('/programa/pagination',programasPagination)
router.get('/programa/:id',buscarPrograma)
router.post('/programa/nombre', programasPorCategoria)
router.post('/programa',crearPrograma)
router.post('/programa/delete', borrarPrograma)


export default router