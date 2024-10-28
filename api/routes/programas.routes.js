import { Router } from 'express'
import { programas, programasPagination, editarPrograma, editarContenidoDePrograma, borrarPrograma, buscarProgramaPorNombre, buscarPrograma, programasPorCategoria, crearPrograma } from '../controllers/programa.controller.js'

const router = Router()

router.get('/programa',programas)
router.get('/programa/pagination',programasPagination)
router.get('/programa/:id',buscarPrograma)
router.post('/programa',crearPrograma)
router.post('/programa/nombre', buscarProgramaPorNombre)
router.post('/programa/categoria', programasPorCategoria)
router.post('/programa/delete', borrarPrograma)
router.post('/programa/editar/:id', editarPrograma)
router.post('/programa/contenido/:id', editarContenidoDePrograma)



export default router