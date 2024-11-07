import { Router } from 'express'
import {
    actualizarDatosRadio, obtenerDatosRadio,
    obtenerSecciones, obtenerSeccion, agregarSeccion, modificarSeccion,
    obtenerContenidos, obtenerContenido, agregarContenido, modificarContenido, obtenerSeccionPagination,
    todasLasSeccionesDeRadio, obtenerSeccionCliente, eliminarContenido, eliminarSeccion
} from '../controllers/radio.controller.js'

const router = Router()

// Client
router.get('/client/radio', obtenerDatosRadio)
router.get('/client/radio/secciones', todasLasSeccionesDeRadio)
router.get('/client/radio/seccion/:idseccion', obtenerSeccionCliente)
router.get('/client/radio/:idseccion/pagination', obtenerSeccionPagination)


// Administrador

// Radio //
router.get('/admin/radio', obtenerDatosRadio)
router.post('/admin/radio', actualizarDatosRadio)

// Secciones //
router.get('/admin/radio/secciones', obtenerSecciones)
router.get('/admin/radio/secciones/:idseccion', obtenerSeccion)
router.get('/admin/radio/secciones/:idseccion/pagination', obtenerSeccionPagination)
router.post('/admin/radio/secciones', agregarSeccion)
router.post('/admin/radio/secciones/delete', eliminarSeccion)
router.post('/admin/radio/secciones/:idseccion', modificarSeccion)


// Contenido //
router.get('/admin/radio/secciones/:idseccion/contenido', obtenerContenidos)
router.get('/admin/radio/secciones/:idseccion/contenido/:idcontenido', obtenerContenido)
router.post('/admin/radio/secciones/:idseccion/contenido', agregarContenido)
router.post('/admin/radio/secciones/:idseccion/contenido/delete', eliminarContenido)
router.post('/admin/radio/secciones/:idseccion/contenido/:idcontenido', modificarContenido)

export default router