import Noticia from '../models/noticia.model.js'
import { upload, getFileURL } from '../aws/s3.js'

export const noticias = async (req, res) => {
    const noticias = await Noticia.find().sort({ fecha: -1 }).limit(6)
    if (noticias.length == 0) return res.status(400).send('API: No hay noticias aún')
    for (const noticia of noticias) {
        const date = new Date(noticia.fecha)
        const ruta = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}/${indiceAWS}/`
        const filename = noticia.portada
        noticia.portada = await getFileURL(ruta, )
    }
    res.status(200).send(noticias)
    return noticias
}

export const crearNoticias = async (req, res) => {
    const { titulo, cuerpo, fecha, categoria } = req.body
    try {
        let filenamePortada = ''
        let filenameImages = []
        let mensaje = ``
        const longitudNoticias = await Noticia.find({ fecha: fecha })
        if (req.files.imagenes) {
            const imagenes = req.files.imagenes
            imagenes.map(async (imagen, index) => {
                const imagenCurrent = imagen
                const date = new Date(fecha);
                let filenameImage = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_noticia_imagenes_${index}_img.${imagen.name.split('.').pop()}`
                filenameImages.push(filenameImage)
                const response = await upload(imagenCurrent, `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}/${longitudNoticias.length}/`, filenameImage)
                mensaje += response + " - "
            })
        }
        if (req.files.portada) {
            const portada = req.files.portada
            const date = new Date(fecha);
            filenamePortada += `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_noticia_portada.${portada.name.split('.').pop()}`
            const response = await upload(portada, `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}/${longitudNoticias.length}/`, filenamePortada)
            mensaje += response + " - "
        }
        const newNoticia = new Noticia({
            titulo: titulo,
            cuerpo: cuerpo,
            fecha: fecha,
            categoria: categoria,
            portada: filenamePortada,
            imagenes: filenameImages
        })
        await newNoticia.save()
        res.status(200).send('Noticia creada exitosamente')
    } catch (error) {
        console.log('Ocurrio el siguiente error: ' + error);
        res.status(500).send('API: Ocurrio un error')
    }
}

export const buscarNoticias = async (req, res) => {
    const { id } = req.params
    const NoticiaFound = await Noticia.findById(id)
    if (!NoticiaFound) return res.status(404).send('API: Noticia no encontrada')
    const NoticiasArray = await Noticia.find({ fecha: NoticiaFound.fecha }).sort({ createdAt: 1 })
    const indiceAWS = NoticiasArray.findIndex(n => n._id.toString() === NoticiaFound._id.toString())
    let filenameImages = []
    let filenamePortada = ''
    const { imagenes, portada } = NoticiaFound
    const date = new Date(NoticiaFound.fecha)
    const ruta = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}/${indiceAWS}/`
    if (imagenes.length > 0) {
        for (const imagen of imagenes) {
            const urlImagen = await getFileURL(ruta, imagen);
            filenameImages.push(urlImagen);
        }
    }
    if (portada) {
        let urlImagen = await getFileURL(ruta, portada)
        filenamePortada += urlImagen
    }
    return res.status(200).json({
        id: NoticiaFound._id,
        titulo: NoticiaFound.titulo,
        cuerpo: NoticiaFound.cuerpo,
        fecha: NoticiaFound.fecha,
        categoria: NoticiaFound.categoria,
        imagenes: filenameImages,
        portada: filenamePortada
    })
}

export const editarNoticias = async (req, res) => {
    // const { indexImages } = req.body
    // indexImages.map((indice, index) => {
    //     console.log(indice+' - '+ index)
    // })
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
            const filenameImage = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_noticia_imagenes_${indexImages[index]}_img.${imagen.name.split('.').pop()}`
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
        if (!NoticiaFound) return res.status(404).json({
            'API: ': 'Devocional no encontrado'
        })
        const updateData = {
            estado: !NoticiaFound.estado
        }
        await Evento.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        return res.status(200).json({
            'API: ': 'Eliminado exitosamente'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            'API: ': error
        })
    }
}