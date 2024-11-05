import { Router } from 'express'
import { noticias, noticiasPagination, crearNoticias, buscarNoticias, editarNoticias, eliminarNoticias, noticiasPorPrograma } from '../controllers/noticia.controller.js'

const router = Router()

router.get('/noticias',noticias)
router.get('/noticias/pagination',noticiasPagination)
router.get('/noticias/programa',noticiasPorPrograma)
router.get('/noticias/:id',buscarNoticias)
router.post('/noticias',crearNoticias)
router.post('/noticias/delete', eliminarNoticias)
router.post('/noticias/:id',editarNoticias)

export default router