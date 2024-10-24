import { Router } from 'express'
import { programas, crearPrograma } from '../controllers/programa.controller.js'

const router = Router()

router.get('/programa',programas)
// router.get('/programa/pagination',noticiasPagination)
// router.get('/programa/:id',buscarNoticias)
router.post('/programa',crearPrograma)
// router.post('/programa/delete', estadoNoticias)
// router.post('/programa/:id',editarNoticias)

export default router