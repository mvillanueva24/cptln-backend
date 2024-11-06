import {Router} from 'express'
import { solicitudCursos, solicitudEbooks, solicitudOracion, solicitudContactanos, obtenerSolicitudesContactanos, obtenerSolicitudesCursos, obtenerSolicitudesOraciones, obtenerSolicitudesEbooks } from "../controllers/seguidor.controller.js";

const router = Router()

// Cliente
router.post('/solicitud-cursos', solicitudCursos)
router.post('/solicitud-ebooks', solicitudEbooks)
router.post('/solicitud-oraciones', solicitudOracion)
router.post('/solicitud-contactanos', solicitudContactanos)

// Admin
router.get('/solicitud-cursos/pagination', obtenerSolicitudesCursos)
router.get('/solicitud-ebooks/pagination', obtenerSolicitudesEbooks)
router.get('/solicitud-oraciones/pagination', obtenerSolicitudesOraciones)
router.get('/solicitud-contactanos/pagination', obtenerSolicitudesContactanos)
export default router