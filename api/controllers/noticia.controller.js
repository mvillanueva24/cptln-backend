import Noticia from '../models/noticia.model.js'
import { upload, getFileURL } from '../aws/s3.js'

export const noticias = async (req, res) => {
    const noticias = await Noticia.find().sort({ fecha: -1 })
    if (noticias.length == 0) return res.status(400).send('No hay noticias aún')
    for (const noticia of noticias) {
        const tmp = noticia.portada
        noticia.portada = await getFileURL(tmp)
    }
    return res.status(200).send(noticias)
}


export const noticiasPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const noticias = await Noticia.find().sort({ fecha: -1 }).skip((page - 1) * limit).limit(limit)
    const totalNoticias = await Noticia.countDocuments()
    if (noticias.length == 0) return res.status(400).send('No hay noticias aún')
    for (const noticia of noticias) {   
        const tmp = noticia.portada
        noticia.portada = await getFileURL(tmp)
    }
    return res.status(200).json({
        noticias,
        currentPage: page,
        totalPages: Math.ceil(totalNoticias / limit),
        totalNoticias
    })
}

export const crearNoticias = async (req, res) => {
    const { titulo, cuerpo, fecha, categoria } = req.body
    console.log(req.files)
    try {
        const newNoticia = new Noticia({
            titulo: titulo,
            cuerpo: cuerpo,
            fecha: fecha,
            categoria: categoria,
        })
        let filenameImages = []
        const longitudNoticias = await Noticia.find({ fecha: fecha })
        if (req.files.imagenes) {
            const imagenes = req.files.imagenes
            for (let index = 0; imagenes.length > index; index++) {
                const date = new Date(fecha)
                const ruta = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() + 1}/${longitudNoticias.length}/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() + 1}_noticia_imagenes_${index}_img.${imagenes[index].name.split('.').pop()}`
                await upload(imagenes[index], ruta)
                filenameImages.push(ruta)
            }
            newNoticia.imagenes = filenameImages
        }
        if (req.files.portada) {
            const portada = req.files.portada
            const date = new Date(fecha);
            const ruta = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() + 1}/${longitudNoticias.length}/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() + 1}_noticia_portada.${portada.name.split('.').pop()}`
            await upload(portada, ruta)
            newNoticia.portada = ruta
        }
        await newNoticia.save()
        res.status(200).send('Noticia creada exitosamente')
    } catch (error) {
        console.log(error)
    }
}

export const buscarNoticias = async (req, res) => {
    const { id } = req.params
    const NoticiaFound = await Noticia.findById(id)
    if (!NoticiaFound) return res.status(404).send('Noticia no encontrada')
    let filenameImages = []
    const { imagenes, portada } = NoticiaFound
    if (imagenes.length > 0) {
        for (const imagen of imagenes) {
            const urlImagen = await getFileURL(imagen);
            filenameImages.push(urlImagen);
        }
        NoticiaFound.imagenes = filenameImages
    }
    if (portada) {
        const tmp = NoticiaFound.portada
        NoticiaFound.portada = await getFileURL(tmp)
    }
    return res.status(200).send(NoticiaFound)
}


export const editarNoticias = async (req, res) => {
    const { id } = req.params
    const { titulo, cuerpo, fecha, categoria, indexImages } = req.body
    const { imagenes, portada } = req.files
    const NoticiaFound = await Noticia.findById(id)
    if (!NoticiaFound) return res.status(404).send('API: Noticia no encontrada')
    const NoticiasArray = await Noticia.find({ fecha: NoticiaFound.fecha }).sort({ createdAt: 1 })
    const indiceAWS = NoticiasArray.findIndex(n => n._id.toString() === NoticiaFound._id.toString())
    const date = new Date(NoticiaFound.fecha)
    const ruta = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}/${indiceAWS}/`
    if (req.files.imagenes > 0) {
        for (let index = 0; index < indexImages.length; index++) {
            const filenameImage = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_noticia_imagenes_${indexImages[index]}_img.${imagenes[index].name.split('.').pop()}`
            await upload(imagenes[index], ruta, filenameImage)
        }
    }
    if (req.files.portada) {
        const filenamePortada = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_noticia_portada.${portada.name.split('.').pop()}`
        await upload(portada, ruta, filenamePortada)
    }
    const uploadData = {
        titulo: titulo,
        cuerpo: cuerpo,
        fecha: fecha,
        categoria: categoria
    }

    await Noticia.findByIdAndUpdate(
        id,
        uploadData,
        { new: true }
    )
    res.status(200).send('Noticia modificada exitosamente')
}

export const estadoNoticias = async (req, res) => {
    const { id } = req.body
    try {
        const NoticiaFound = await Noticia.findById(id)
        if (!NoticiaFound) return res.status(404).json('Devocional no encontrado')
        const updateData = { estado: !NoticiaFound.estado }
        await Evento.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        return res.status(200).json('Eliminado exitosamente')
    } catch (error) {
        console.log(error)
    }
}