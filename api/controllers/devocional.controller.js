import Devocional from "../models/devocional.model.js"
import { upload, getFileURL } from '../aws/s3.js'
import sharp from 'sharp';

// Obtener devocionales
export const devocionales = async (req, res) => {
    const devocionales = await Devocional.find()
    if (devocionales.length === 0) return res.status(400).json({
        "message": "Aun no hay devocionales"
    })
    res.status(200).json({
        "devocionales": devocionales
    });
    return devocionales
}

// Obtener devocional de hoy
export const devocionalHoy = async (req, res) => {
    const hoy = new Date()
    const devocional = await Devocional.findOne().sort({ createdAt: -1 })
    if (!devocional) return res.status(404).json({
        "Mensaje de la API": 'No se encontro el devocional de hoy'
    })
    const ruta = `devocionales/${hoy.getFullYear()}_${hoy.getMonth() + 1}_${hoy.getDate()}/`
    const {audioURL, imagenURL} = devocional
    let urlAudio
    let urlImagen
    if (audioURL) {
        urlAudio = await getFileURL(ruta,audioURL)
    }
    if (imagenURL) {
        urlImagen = await getFileURL(ruta, imagenURL)
    }
    console.log({
        "API:": devocional,
        'urlImagen: ': urlAudio ,
        'urlAudio: ': urlImagen
    })
    return res.status(200).json({
        id: devocional._id,
        titulo: devocional.titulo,
        parrafo: devocional.parrafo,
        versiculo: devocional.versiculo,
        audioURL: urlAudio,
        imagenURL: urlImagen,
    })
}

// Buscar devocional especifico
export const devocionalFound = async (req, res) => {
    const { id } = req.params
    const devocional = await Devocional.findOne({_id: id})
    if (!devocional) return res.status(404).json({
        "Mensaje de la API": 'No se encontro el devocional'
    })
    console.log({
        "API:": devocional,
    })
    return res.status(200).json({
        id: devocional._id,
        titulo: devocional.titulo,
        parrafo: devocional.parrafo,
        versiculo: devocional.versiculo,
        audioURL: devocional.audioURL,
        imagenURL: devocional.imagenURL,
    })
}

export const test = (req, res) => {
    const today = new Date();
    const filenameImage = `Devocional_IMG_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`
    console.log(filenameImage);
}

// Crear devocional
export const crearDevocional = async (req, res) => {
    console.log(req.files);
    const { titulo, parrafo, versiculo, fecha } = req.body
    let filenameImage = ''
    let filenameAudio = ''
    let mensaje = ``
    if (req.files.imagen) {
        const imagen = req.files.imagen
        const today = new Date();
        filenameImage += `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}_devocional_img.${imagen.name.split('.').pop()}`
        const response = await upload(imagen, `devocionales/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}/`, filenameImage)
        mensaje += response+" - "
    }
    if (req.files.audio) {
        const audio = req.files.audio
        const today = new Date();
        filenameAudio += `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}_devocional_audio.mp3`
        const response = await upload(audio, `devocionales/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}/`, filenameAudio)
        mensaje += response+" - "
    }
    try {
        const newDevocional = new Devocional({
            titulo: titulo,
            fecha: fecha,
            audioURL: filenameAudio,
            imagenURL: filenameImage,
            parrafo: parrafo,
            versiculo: versiculo
        })
        await newDevocional.save()
        res.status(200).json({
            message: 'Devocional creado exitosamente: \n' + mensaje
        })
    } catch (error) {
        res.status(500).json({
            "API - Ocurrio un error: ": error.message
        })
    }
}

// Editar devocional
export const editarDevocional = async (req, res) => {
    const { titulo, audioURL, imagen, parrafo, fecha, id } = req.body
    try {
        const foundDevocional = await Devocional.findByIdAndUpdate(
            id,
            {
                titulo: titulo,
                audioURL: filenameImage,
                imagenURL: filenameAudio,
                parrafo: parrafo,
                fecha: fecha
            },
            { new: true }
        )
        if (!foundDevocional) return res.status(404).json({
            message: 'Devocional no encontrado'
        })
        res.status(200).json({
            message: 'Devocional actualizado exitosamente'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

