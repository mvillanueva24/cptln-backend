import { Router } from 'express'
import { categorias, categoriasPagination, buscarCategoriaPorNombre, crearCategoria, buscarCategoria, editarCategoria, eliminarCategoria } from '../controllers/categoria.controller.js'

const router = Router()

router.get('/categorias', categorias)
router.get('/categorias/pagination', categoriasPagination)
router.get('/categorias/:id', buscarCategoria)
router.post('/categorias', crearCategoria)
router.post('/categorias/nombre', buscarCategoriaPorNombre)
router.post('/categorias/delete', eliminarCategoria)
router.post('/categorias/:id', editarCategoria)

export default router