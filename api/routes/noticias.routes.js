import { Router } from 'express'
import { noticias, crearNoticias, buscarNoticias, editarNoticias, estadoNoticias } from '../controllers/noticia.controller.js'

const router = Router()

router.get('/noticias',noticias)
router.get('/noticias/:id',buscarNoticias)
router.post('/noticias',crearNoticias)
router.post('/noticias/delete', estadoNoticias)
router.post('/noticias/:id',editarNoticias)

export default router