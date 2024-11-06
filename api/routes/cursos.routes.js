import { Router } from 'express'
import { cursos, ordenarCapitulos,cursosPagination, eliminarCurso, cursosCapitulosPagination, buscarContenidoDelCurso, crearCurso, crearCapituloCurso, buscarCursos, buscarCapituloEspecifico, editarCurso, editarCapituloCurso, eliminarCapitulo } from '../controllers/cursos.controller.js'

const router = Router()

// Cliente
router.get('/cursos/', cursos)
router.get('/cursos/:idcurso', buscarCursos)
router.get('/cursos/capitulos/capitulo/:idcurso', buscarContenidoDelCurso)


// Administracion
// Cursos //
router.get('/admin/cursos/', cursos)
router.get('/admin/cursos/pagination', cursosPagination)
router.get('/admin/cursos/:idcurso', buscarCursos)
router.post('/admin/cursos', crearCurso)
router.post('/admin/cursos/delete', eliminarCurso)
router.post('/admin/cursos/:idcurso', editarCurso)

// Capitulos //
router.get('/admin/cursos/capitulos/capitulo/:idcurso', buscarContenidoDelCurso)
router.get('/admin/cursos/capitulos/pagination/:idcurso', cursosCapitulosPagination)
router.get('/admin/cursos/capitulos/:idcurso/:idcapitulo', buscarCapituloEspecifico)
router.post('/admin/cursos/capitulos/capitulo/:idcurso', crearCapituloCurso)
router.post('/admin/cursos/capitulos/ordenar/:idcurso', ordenarCapitulos)
router.post('/admin/cursos/capitulos/:idcurso/:idcapitulo', editarCapituloCurso)
router.post('/admin/cursos/capitulos/:idcurso/:idcapitulo/delete', eliminarCapitulo)

export default router