import {Router} from 'express'
import { register, login, logout, verifyToken, obtenerUsuarios, eliminarUsuario } from "../controllers/user.controller.js";
import { validateSchema } from '../middleware/validateSchema.js';
import { RegisterSchema } from '../schemas/auth.schema.js';

const router = Router()

router.get('/admin/cptln/pe/users', obtenerUsuarios)
router.post('/admin/cptln/pe/users/logout', logout)
router.post('/admin/cptln/pe/users/register', validateSchema(RegisterSchema),register)
router.post('/admin/cptln/pe/users/login', login)
router.post('/admin/cptln/pe/users/:iduser/delete', eliminarUsuario)
router.post('/verifytoken', verifyToken)

export default router