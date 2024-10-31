import { Router } from 'express'
import { 
    programas, 
    programasPagination, 
    buscarPrograma,
    programasPorCategoria, 
    buscarProgramaPorNombre, 
    buscarProgramaConContenido,
    buscarContenidoProgramaPagination, 
    buscarContenidoEspecifoPrograma,
    crearPrograma,
    agregarContenidoPrograma,
    editarPrograma, 
    editarContenidoDePrograma, 
    borrarPrograma, 
    cambiarPosicionDelContenido
} from '../controllers/programa.controller.js'

const router = Router()

router.get('/programa',programas)
router.get('/programa/pagination',programasPagination)
router.get('/programa/:id',buscarPrograma)
router.get('/programa/contenido/pagination/:id',buscarContenidoProgramaPagination)
router.get('/programa/contenido/:idprograma/:id',buscarContenidoEspecifoPrograma)
router.post('/programa/contenido/:id',agregarContenidoPrograma)
router.post('/programa',crearPrograma)
router.post('/programa/categoria', programasPorCategoria)
router.post('/programa/delete', borrarPrograma)
router.post('/programa/editar/:id', editarPrograma)
router.post('/programa/contenido/ordenar/:id', cambiarPosicionDelContenido)
router.post('/programa/contenido/:idprograma/:id', editarContenidoDePrograma)
router.post('/programa/nombre', buscarProgramaPorNombre)
router.post('/programa/nombre/contenido', buscarProgramaConContenido)


export default router