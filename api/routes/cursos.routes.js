import { Router } from 'express'
import { cursos, ordenarCapitulos,cursosPagination, cursosCapitulosPagination, buscarContenidoDelCurso, crearCurso, crearCapituloCurso, buscarCursos, buscarCapituloEspecifico, editarCurso, editarCapituloCurso } from '../controllers/cursos.controller.js'

const router = Router()

router.get('/cursos/', cursos)
router.get('/cursos/pagination', cursosPagination)
router.get('/cursos/capitulos/pagination/:idcurso', cursosCapitulosPagination)
router.get('/cursos/:idcurso', buscarCursos)
router.post('/cursos/:idcurso', editarCurso)
router.post('/cursos/', crearCurso)
router.get('/cursos/capitulos/capitulo/:idcurso', buscarContenidoDelCurso)
router.post('/cursos/capitulos/capitulo/:idcurso', crearCapituloCurso)
router.post('/cursos/capitulos/ordenar/:idcurso', ordenarCapitulos)
router.get('/cursos/capitulos/:idcurso/:idcapitulo', buscarCapituloEspecifico)
router.post('/cursos/capitulos/:idcurso/:idcapitulo', editarCapituloCurso)

export default router