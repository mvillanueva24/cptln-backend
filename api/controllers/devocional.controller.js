import Devocional from "../models/devocional.model.js"
import { upload, getFileURL } from '../aws/s3.js'

// Obtener devocionales
export const devocionales = async (req, res) => {
    const { limit } = req.query
    try {
        const devocionales = await Devocional.find().sort({ fecha: -1 }).limit(limit ? limit : null)
        if (devocionales.length === 0) return res.status(400).send('Aun no hay devocionales');
        return res.status(200).send(devocionales)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }

}

export const devocionalesPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const devocionales = await Devocional.find().sort({ fecha: -1 }).skip((page - 1) * limit).limit(limit)
        const totalDevocionales = await Devocional.countDocuments()
        if (devocionales.length == 0) return res.status(400).send('Aun no hay eventos')
        return res.status(200).json({
            devocionales,
            currentPage: page,
            totalPages: Math.ceil(totalDevocionales / limit),
            totalDevocionales
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }

}

export const devocionalHoy = async (req, res) => {
    const date = new Date()
    const hoy = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    try {
        const devocional = await Devocional.findOne({ fecha: { $lte: hoy } }).sort({ fecha: -1 })
        if (!devocional) return res.status(404).send('No se encontro el devocional de hoy');
        const { audioURL, imagenURL } = devocional
        if (audioURL) {
            const tmp = audioURL
            devocional.audioURL = await getFileURL(tmp)
        }
        if (imagenURL) {
            const tmp = imagenURL
            devocional.imagenURL = await getFileURL(tmp)
        }
        return res.status(200).send(devocional)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }

}

// Buscar devocional especifico
export const devocionalFound = async (req, res) => {
    const { id } = req.params
    const devocional = await Devocional.findOne({ _id: id })
    if (!devocional) return res.status(404).send('No se encontro el devocional');
    try {
        const { audioURL, imagenURL } = devocional
        if (audioURL) {
            const tmp = audioURL
            devocional.audioURL = await getFileURL(tmp)
        }
        if (imagenURL) {
            const tmp = imagenURL
            devocional.imagenURL = await getFileURL(tmp)
        }
        return res.status(200).send(devocional)
    } catch (error) {
        console.log(error);
        return res.status(500).send('Ocurrio un error')
    }
}

// Crear devocional
export const crearDevocional = async (req, res) => {
    const { titulo, parrafo, versiculo, fecha } = req.body
    try {
        const newDevocional = new Devocional({
            titulo: titulo,
            fecha: fecha,
            parrafo: parrafo,
            versiculo: versiculo
        })
        if (req.files) {
            if (req.files.imagen) {
                const imagen = req.files.imagen
                const today = new Date(fecha);
                newDevocional.imagenURL = `devocionales/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate() + 1}/${newDevocional._id}/${newDevocional._id}_devocional_img.${imagen.name.split('.').pop()}`
                await upload(imagen, newDevocional.imagenURL)
            }
            if (req.files.audio) {
                const audio = req.files.audio
                const today = new Date(fecha);
                newDevocional.audioURL = `devocionales/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate() + 1}/${newDevocional._id}/${newDevocional._id}_devocional_audio.mp3`
                await upload(audio, newDevocional.audioURL)
            }
        }
        await newDevocional.save()
        res.status(200).send('Devocional creado exitosamente')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Ocurrio un error')
    }
}

export const editarDevocional = async (req, res) => {
    const { id } = req.params
    const { titulo, parrafo, versiculo, fecha } = req.body
    const DevocionalFound = await Devocional.findById(id)
    if (!DevocionalFound) return res.status(404).send('Devocional no encontrado')
    try {
        const updateData = {
            titulo: titulo,
            fecha: fecha,
            parrafo: parrafo,
            versiculo: versiculo
        }
        if (req.files) {
            if (req.files.imagen) {
                const imagen = req.files.imagen
                const fechaOriginal = new Date(fecha);
                updateData.imagenURL = `devocionales/${fechaOriginal.getFullYear()}_${fechaOriginal.getMonth() + 1}_${fechaOriginal.getDate() + 1}/${DevocionalFound._id}/${DevocionalFound._id}_devocional_img.${imagen.name.split('.').pop()}`
                await upload(imagen, updateData.imagenURL)
            }
            if (req.files.audio) {
                const audio = req.files.audio
                const fechaOriginal = new Date(fecha);
                updateData.audioURL = `devocionales/${fechaOriginal.getFullYear()}_${fechaOriginal.getMonth() + 1}_${fechaOriginal.getDate() + 1}/${DevocionalFound._id}/${DevocionalFound._id}_devocional_audio.mp3`
                await upload(audio, updateData.audioURL)
            }
        }
        await Devocional.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).send('Devocional modificado exitosamente')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Ocurrio un error')
    }
}

export const eliminarDevocional = async (req, res) => {
    const { id } = req.query
    try {
        const DevocionalFound = await Devocional.findById(id)
        if (!DevocionalFound) return res.status(404).send('Devocional no encontrado')
        await Devocional.findByIdAndDelete(id)
        return res.status(200).send('Eliminado exitosamente')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Ocurrio un error')
    }
}