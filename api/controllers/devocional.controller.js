import Devocional from "../models/devocional.model.js"
import { upload, getFileURL } from '../aws/s3.js'

// Obtener devocionales
export const devocionales = async (req, res) => {
    const devocionales = await Devocional.find().sort({ fecha: -1 })
    if (devocionales.length === 0) return res.status(400).send('Aun no hay devocionales')
    return res.status(200).send(devocionales)
}

export const devocionalesPagination = async (req, res) => {
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
}

// Obtener devocional de hoy
export const devocionalHoy = async (req, res) => {
    const date = new Date()
    const hoy = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const devocional = await Devocional.findOne({ fecha: hoy }).sort({ fecha: -1 })
    if (!devocional) return res.status(404).send('No se encontro el devocional de hoy')
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
}

// Buscar devocional especifico
export const devocionalFound = async (req, res) => {
    const { id } = req.params
    const devocional = await Devocional.findOne({ _id: id })
    if (!devocional) return res.status(404).send('Mensaje de la API No se encontro el devocional')
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
}

// Crear devocional
export const crearDevocional = async (req, res) => {
    console.log(req.body)
    console.log(req.files)
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
                newDevocional.imagenURL = `devocionales/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate() + 1}/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate() + 1}_devocional_img.${imagen.name.split('.').pop()}`
                await upload(imagen, newDevocional.imagenURL)
            }
        }
        if (req.files.audio) {
            const audio = req.files.audio
            const today = new Date(fecha);
            newDevocional.audioURL = `devocionales/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate() + 1}/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate() + 1}_devocional_audio.mp3`
            await upload(audio, newDevocional.audioURL)
        }
        await newDevocional.save()
        res.status(200).send('Devocional creado exitosamente')
    } catch (error) {
        console.log(error);
    }
}

// Editar devocional
export const editarDevocional = async (req, res) => {
    const { id } = req.params
    const { titulo, parrafo, versiculo, fecha } = req.body
    console.log(req.body)
    console.log(req.files)
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
                updateData.imagenURL = `${fechaOriginal.getFullYear()}_${fechaOriginal.getMonth() + 1}_${fechaOriginal.getDate()}_devocional_img.${imagen.name.split('.').pop()}`
                await upload(imagen, updateData.imagenURL)
            }
            if (req.files.audio) {
                const audio = req.files.audio
                const fechaOriginal = new Date(fecha);
                updateData.audioURL = `${fechaOriginal.getFullYear()}_${fechaOriginal.getMonth() + 1}_${fechaOriginal.getDate()}_devocional_audio.mp3`
                await upload(audio, updateData.audioURL)
            }
        }
        const DevocionalFound = await Devocional.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        if (!DevocionalFound) return res.status(404).send('Devocional no encontrado')
        res.status(200).send('Devocional modificado exitosamente')
    } catch (error) {
        console.log(error)
    }
}

export const cambiarEstadoDevocional = async (req, res) => {
    const { id } = req.body
    try {
        const DevocionalFound = await Devocional.findById(id)
        if (!DevocionalFound) return res.status(404).json({
            'API: ': 'Devocional no encontrado'
        })
        const updateData = {
            estado: !DevocionalFound.estado
        }
        await Devocional.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        return res.status(200).json({
            'API: ': 'Eliminado exitosamente'
        })
    } catch (error) {
        console.log(error)
    }
}

export const test = (req, res) => {
    const today = new Date();
    const filenameImage = `Devocional_IMG_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`
    console.log(filenameImage);
}