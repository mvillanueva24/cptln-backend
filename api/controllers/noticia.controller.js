import Noticia from '../models/noticia.model.js'
import { upload, getFileURL } from '../aws/s3.js'
import mongoose from 'mongoose'
import { Programa } from '../models/programa.model.js'

export const noticias = async (req, res) => {
    const { limit } = req.query
    try {
        const noticias = await Noticia.find().sort({ fecha: -1 }).limit(limit ? limit : null)
        if (noticias.length == 0) return res.status(400).send('No hay noticias aún')
        for (const noticia of noticias) {
            const tmp = noticia.portada
            noticia.portada = await getFileURL(tmp)
        }
        return res.status(200).send(noticias)
    } catch (error) {
        console.log('Error:', error)
        return res.status(500).send('Ocurrió un error')
    }
}

export const noticiasPagination = async (req, res) => {
    try {
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
    } catch (error) {
        console.log('Error:', error)
        return res.status(500).send('Ocurrió un error')
    }
}

export const crearNoticias = async (req, res) => {
    const { titulo, cuerpo, fecha, programa_id } = req.body
    try {
        const newNoticia = new Noticia({
            titulo: titulo,
            cuerpo: cuerpo,
            fecha: fecha,
            programa_id: programa_id ? programa_id : null
        })
        let filenameImages = []
        if (req.files) {
            if (req.files.imagenes) {
                const { imagenes } = req.files
                for (let index = 0; imagenes.length > index; index++) {
                    const date = new Date(fecha)
                    const ruta = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() + 1}/${newNoticia._id}/${newNoticia._id}_noticia_imagenes_${index}_img.${imagenes[index].name.split('.').pop()}`
                    await upload(imagenes[index], ruta)
                    filenameImages.push(ruta)
                }
                newNoticia.imagenes = filenameImages
            }
            if (req.files.portada) {
                const { portada } = req.files
                const date = new Date(fecha);
                const ruta = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() + 1}/${newNoticia._id}/${newNoticia._id}_noticia_portada.${portada.name.split('.').pop()}`
                await upload(portada, ruta)
                newNoticia.portada = ruta
            }
        }
        await newNoticia.save()
        res.status(200).send('Noticia creada exitosamente')
    } catch (error) {
        console.log('Error:', error)
        return res.status(500).send('Ocurrió un error')
    }
}

export const buscarNoticias = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(200).send(false);
        }
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
    } catch (error) {
        console.log('Error:', error)
        return res.status(500).send('Ocurrió un error')
    }
}


export const editarNoticias = async (req, res) => {
    const { id } = req.params
    const { titulo, cuerpo, fecha, programa_id, indexImages } = req.body
    try {
        const NoticiaFound = await Noticia.findById(id)
        if (!NoticiaFound) return res.status(404).send('API: Noticia no encontrada')
        if (req.files) {
            const { imagenes, portada } = req.files
            const date = new Date(NoticiaFound.fecha)
            if (req.files.imagenes > 0) {
                for (let index = 0; index < indexImages.length; index++) {
                    const tmp = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() + 1}/${NoticiaFound._id}/${NoticiaFound._id}_noticia_imagenes_${indexImages[index]}_img.${imagenes[index].name.split('.').pop()}`
                    await upload(imagenes[index], tmp)
                }
            }
            if (req.files.portada) {
                const tmp = `noticias/${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() + 1}/${NoticiaFound._id}/${NoticiaFound._id}_noticia_portada.${portada.name.split('.').pop()}`
                await upload(portada, tmp)
            }
        }
        const uploadData = {
            titulo: titulo,
            cuerpo: cuerpo,
            fecha: fecha,
            programa_id: programa_id ? programa_id : null
        }

        await Noticia.findByIdAndUpdate(
            id,
            uploadData,
            { new: true }
        )
        res.status(200).send('Noticia modificada exitosamente')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }

}

export const noticiasPorPrograma = async (req, res) => {
    try {
        const { programa_id } = req.query
        console.log(programa_id);
        const noticiasFound = await Noticia.find({ programa_id: programa_id })
        if (noticiasFound.length === 0) return res.status(400).send('No encontrado');
        for (const noticia of Array.isArray(noticiasFound) ? noticiasFound : [noticiasFound]) {
            if (noticia.imagenes) {
                const imagenes = noticia.imagenes
                noticia.imagenes = []
                for (const imagen of imagenes) {
                    const ruta = await getFileURL(imagen)
                    noticia.imagenes.push(ruta)
                }
            }
            if (noticia.portada) {
                const tmp = noticia.portada
                noticia.portada = await getFileURL(tmp)
            }
        }
        return res.status(200).send(noticiasFound)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }
}

export const eliminarNoticias = async (req, res) => {
    const { id } = req.query
    try {
        const noticiaFound = await Noticia.findById(id)
        if (!noticiaFound) return res.status(404).send('No encontrado');
        await Noticia.findByIdAndDelete(id)
        return res.status(200).send('Eliminado correctamente')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }
}