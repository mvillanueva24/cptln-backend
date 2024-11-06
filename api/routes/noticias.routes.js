import { Router } from 'express'
import { noticias, noticiasPagination, crearNoticias, buscarNoticias, editarNoticias, eliminarNoticias, noticiasPorPrograma } from '../controllers/noticia.controller.js'

const router = Router()

// Cliente
router.get('/noticias',noticias)
router.get('/noticias/pagination',noticiasPagination)
router.get('/noticias/programa',noticiasPorPrograma)
router.get('/noticias/:id',buscarNoticias)


// Administracion
router.get('/admin/noticias',noticias)
router.get('/admin/noticias/pagination',noticiasPagination)
router.get('/admin/noticias/programa',noticiasPorPrograma)
router.get('/admin/noticias/:id',buscarNoticias)
router.post('/admin/noticias',crearNoticias)
router.post('/admin/noticias/delete', eliminarNoticias)
router.post('/admin/noticias/:id',editarNoticias)

export default router