import { Router } from 'express'
import { 
    actualizarDatosRadio, obtenerDatosRadio, 
    obtenerSecciones, obtenerSeccion, agregarSeccion, modificarSeccion,

} from '../controllers/radio.controller.js'

const router = Router()

// Radio
router.get('/admin/radio', obtenerDatosRadio)
router.post('/admin/radio', actualizarDatosRadio)

// Secciones
router.get('/admin/radio/secciones', obtenerSecciones)
router.post('/admin/radio/secciones', agregarSeccion)
router.get('/admin/radio/secciones/:idseccion', obtenerSeccion)
router.post('/admin/radio/secciones/:idseccion', modificarSeccion)

// Contenido

export default router