import { Router } from 'express'
import { noticias, noticiasPagination, crearNoticias, buscarNoticias, editarNoticias, estadoNoticias } from '../controllers/noticia.controller.js'

const router = Router()

router.get('/noticias',noticias)
router.get('/noticias/pagination',noticiasPagination)
router.get('/noticias/:id',buscarNoticias)
router.post('/noticias',crearNoticias)
router.post('/noticias/delete', estadoNoticias)
router.post('/noticias/:id',editarNoticias)

export default router