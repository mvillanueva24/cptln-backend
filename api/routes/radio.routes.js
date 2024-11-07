import { Router } from 'express'
import {
    actualizarDatosRadio, obtenerDatosRadio,
    obtenerSecciones, obtenerSeccion, agregarSeccion, modificarSeccion,
    obtenerContenidos, obtenerContenido, agregarContenido, modificarContenido, obtenerSeccionPagination,
    todasLasSeccionesDeRadio, obtenerSeccionCliente, eliminarContenido, eliminarSeccion
} from '../controllers/radio.controller.js'
import { authRequired } from '../middleware/validateToken.js'

const router = Router()

// Client
router.get('/client/radio', obtenerDatosRadio)
router.get('/client/radio/secciones', todasLasSeccionesDeRadio)
router.get('/client/radio/seccion/:idseccion', obtenerSeccionCliente)
router.get('/client/radio/:idseccion/pagination', obtenerSeccionPagination)


// Administrador

// Radio //
router.get('/admin/radio', authRequired, obtenerDatosRadio)
router.post('/admin/radio', authRequired, actualizarDatosRadio)

// Secciones //
router.get('/admin/radio/secciones', authRequired, obtenerSecciones)
router.get('/admin/radio/secciones/:idseccion', authRequired, obtenerSeccion)
router.get('/admin/radio/secciones/:idseccion/pagination', authRequired, obtenerSeccionPagination)
router.post('/admin/radio/secciones', authRequired, agregarSeccion)
router.post('/admin/radio/secciones/delete', authRequired, eliminarSeccion)
router.post('/admin/radio/secciones/:idseccion', authRequired, modificarSeccion)


// Contenido //
router.get('/admin/radio/secciones/:idseccion/contenido', authRequired, obtenerContenidos)
router.get('/admin/radio/secciones/:idseccion/contenido/:idcontenido', authRequired, obtenerContenido)
router.post('/admin/radio/secciones/:idseccion/contenido', authRequired, agregarContenido)
router.post('/admin/radio/secciones/:idseccion/contenido/delete', authRequired, eliminarContenido)
router.post('/admin/radio/secciones/:idseccion/contenido/:idcontenido', authRequired, modificarContenido)

export default router