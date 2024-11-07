import { Router } from 'express'
import { cursos, ordenarCapitulos,cursosPagination, eliminarCurso, cursosCapitulosPagination, buscarContenidoDelCurso, crearCurso, crearCapituloCurso, buscarCursos, buscarCapituloEspecifico, editarCurso, editarCapituloCurso, eliminarCapitulo } from '../controllers/cursos.controller.js'
import { authRequired } from '../middleware/validateToken.js'

const router = Router()

// Cliente
router.get('/cursos/', cursos)
router.get('/cursos/:idcurso', buscarCursos)
router.get('/cursos/capitulos/capitulo/:idcurso', buscarContenidoDelCurso)


// Administracion
// Cursos //
router.get('/admin/cursos/', authRequired, cursos)
router.get('/admin/cursos/pagination', authRequired, cursosPagination)
router.get('/admin/cursos/:idcurso', authRequired, buscarCursos)
router.post('/admin/cursos', authRequired, crearCurso)
router.post('/admin/cursos/delete', authRequired, eliminarCurso)
router.post('/admin/cursos/:idcurso', authRequired, editarCurso)

// Capitulos //
router.get('/admin/cursos/capitulos/capitulo/:idcurso', authRequired, buscarContenidoDelCurso)
router.get('/admin/cursos/capitulos/pagination/:idcurso', authRequired, cursosCapitulosPagination)
router.get('/admin/cursos/capitulos/:idcurso/:idcapitulo', authRequired, buscarCapituloEspecifico)
router.post('/admin/cursos/capitulos/capitulo/:idcurso', authRequired, crearCapituloCurso)
router.post('/admin/cursos/capitulos/ordenar/:idcurso', authRequired, ordenarCapitulos)
router.post('/admin/cursos/capitulos/:idcurso/:idcapitulo', authRequired, editarCapituloCurso)
router.post('/admin/cursos/capitulos/:idcurso/:idcapitulo/delete', authRequired, eliminarCapitulo)

export default router