import Ebook from '../models/ebooks.model.js'
import { getFileURL, upload } from "../aws/s3.js"

export const ebooks = async (req, res) => {
    const ebooks = await Ebook.find()
    if (ebooks.length == 0) { return res.status(400).send('Sin libros aun') }
    for (const ebook of ebooks) {
        let tmp = ebook.portada
        ebook.portada = await getFileURL(tmp)
        tmp = ebook.pdf
        ebook.pdf = await getFileURL(tmp)
    }
    return res.status(200).send(ebooks)
}

export const ebooksPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const ebooks = await Ebook.find().skip((page - 1) * limit).limit(limit)
    const totalEbooks = await Ebook.countDocuments()
    if (ebooks.length == 0) return res.status(400).send('Aun no hay libros')
    return res.status(200).json({
        ebooks,
        currentPage: page,
        totalPages: Math.ceil(totalEbooks / limit),
        totalEbooks
    })
}

export const guardarPDF = async (req, res) => {
    console.log(req.files)
    const { pdf, portada } = req.files
    const { titulo, descripcion } = req.body
    if (!req.files) return res.status(400).send('No se recibio un archivo')
    try {
        const newEbook = new Ebook({ 
            titulo: titulo,
            descripcion: descripcion 
        })
        newEbook.pdf = `ebooks/${newEbook._id}/${pdf.name}`
        newEbook.portada = `ebooks/${newEbook._id}/${portada.name}`
        await upload(pdf, newEbook.pdf, 'application/pdf')
        await upload(portada, newEbook.portada)
        await newEbook.save()
        res.status(200).send('Libro registrado correctamente')
    } catch (error) {
        console.error(error)
    }
}

export const buscarEbook = async(req, res) => {
    const { id } = req.params
    const ebookFound = await Ebook.findById(id)
    if (!ebookFound) return res.status(404).send('Ebook no encontrado')
    let tmp = ebookFound.portada
    ebookFound.portada = await getFileURL(tmp)
    return res.status(200).send(ebookFound)
}

export const editarEbook = async(req, res) => {
    const { id } = req.params
    const { titulo, descripcion } = req.body
    const { pdf, portada } = req.files
    const ebookFound = await Ebook.findById(id)
    ebookFound.titulo = titulo
    ebookFound.descripcion = descripcion
    if (!ebookFound) return res.status(404).send('Ebook no encontrado')
    if (pdf) {
        ebookFound.pdf = `ebooks/${newEbook._id}/${pdf.name}`
        await upload(ebookFound.pdf)
    }
    if (portada){
        ebookFound.portada = `ebooks/${newEbook._id}/${portada.name}`
        await upload(ebookFound.portada)
    }
    await ebookFound.save()
}