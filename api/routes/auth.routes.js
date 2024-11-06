import {Router} from 'express'
import { register, login, logout, verifyToken, obtenerUsuarios } from "../controllers/user.controller.js";

const router = Router()

router.get('/admin/cptln/usuarios', obtenerUsuarios)
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verifytoken', verifyToken)

export default router