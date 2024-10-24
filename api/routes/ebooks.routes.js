import { Router } from "express";
import { ebooks, ebooksPagination, guardarPDF, buscarEbook, editarEbook } from "../controllers/ebooks.controller.js";

const router = Router()

router.get('/ebooks', ebooks)
router.get('/ebooks/pagination', ebooksPagination)
router.get('/ebooks/:id', buscarEbook)
router.post('/ebooks', guardarPDF)
router.post('/ebooks/:id', editarEbook)


export default router