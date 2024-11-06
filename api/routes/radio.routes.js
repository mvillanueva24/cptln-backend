import { Router } from 'express'
import { 
    actualizarDatosRadio, obtenerDatosRadio, 
    obtenerSecciones, obtenerSeccion, agregarSeccion, modificarSeccion,
    obtenerContenidos, obtenerContenido, agregarContenido, modificarContenido,
    todasLasSeccionesDeRadio, obtenerSeccionCliente
} from '../controllers/radio.controller.js'

const router = Router()

// Client
router.get('/client/radio', obtenerDatosRadio)
router.get('/client/radio', todasLasSeccionesDeRadio)
router.get('/client/radio/seccion/:idseccion', obtenerSeccionCliente)


// Administrador

// Radio //
router.get('/admin/radio', obtenerDatosRadio)
router.post('/admin/radio', actualizarDatosRadio)

// Secciones //
router.get('/admin/radio/secciones', obtenerSecciones)
router.get('/admin/radio/secciones/:idseccion', obtenerSeccion)
router.post('/admin/radio/secciones', agregarSeccion)
router.post('/admin/radio/secciones/:idseccion', modificarSeccion)

// Contenido //
router.get('/admin/radio/secciones/:idseccion/contenido', obtenerContenidos)
router.get('/admin/radio/secciones/:idseccion/contenido/:idcontenido', obtenerContenido)
router.post('/admin/radio/secciones/:idseccion/contenido', agregarContenido)
router.post('/admin/radio/secciones/:idseccion/contenido/:idcontenido', modificarContenido)

export default router