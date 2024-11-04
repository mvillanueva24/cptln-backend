import { Router } from "express";
import { ebooks, ebooksPagination, guardarPDF, buscarEbook, editarEbook, eliminarEbook } from "../controllers/ebooks.controller.js";

const router = Router()

router.get('/ebooks', ebooks)
router.get('/ebooks/pagination', ebooksPagination)
router.get('/ebooks/:id', buscarEbook)
router.post('/ebooks', guardarPDF)
router.post('/ebooks/delete', eliminarEbook)
router.post('/ebooks/:id', editarEbook)

export default router