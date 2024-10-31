import { Router } from 'express'
import { cursos, cursosPagination, cursosCapitulosPagination, buscarContenidoDelCurso, crearCurso, crearCapituloCurso, buscarCursos, buscarCapituloEspecifico, editarCurso, editarCapituloCurso } from '../controllers/cursos.controller.js'

const router = Router()

router.get('/cursos/', cursos)
router.get('/cursos/pagination', cursosPagination)
router.get('/cursos/capitulos/pagination/:idcurso', cursosCapitulosPagination)
router.get('/cursos/:id', buscarCursos)
router.post('/cursos/:id', editarCurso)
router.post('/cursos/', crearCurso)
router.get('/cursos/capitulos/capitulo/:id', buscarContenidoDelCurso)
router.post('/cursos/capitulos/capitulo/:id', crearCapituloCurso)
router.get('/cursos/capitulos/:idcurso/:id', buscarCapituloEspecifico)
router.post('/cursos/capitulos/:idcurso/:id', editarCapituloCurso)


export default router