import Devocional from "../models/devocional.model.js"
import { upload, getFileURL } from '../aws/s3.js'

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
    const date = new Date()
    const hoy = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    const devocional = await Devocional.findOne({fecha: hoy}).sort({ fecha: -1 })
    if (!devocional) return res.status(404).json({
        "Mensaje de la API": 'No se encontro el devocional de hoy'
    })
    const fecha = new Date(devocional.fecha)
    const ruta = `devocionales/${fecha.getFullYear()}_${fecha.getMonth() + 1}_${fecha.getDate()}/`
    const { audioURL, imagenURL } = devocional
    let urlAudio
    let urlImagen
    if (audioURL) {
        urlAudio = await getFileURL(ruta, audioURL)
    }
    if (imagenURL) {
        urlImagen = await getFileURL(ruta, imagenURL)
    }
    console.log({
        "API:": devocional,
        'urlImagen: ': urlAudio,
        'urlAudio: ': urlImagen
    })
    return res.status(200).json({
        id: devocional._id,
        titulo: devocional.titulo,
        parrafo: devocional.parrafo,
        versiculo: devocional.versiculo,
        fecha: devocional.fecha,
        audioURL: urlAudio,
        imagenURL: urlImagen,
    })
}

// Buscar devocional especifico
export const devocionalFound = async (req, res) => {
    const { id } = req.params
    const devocional = await Devocional.findOne({ _id: id })
    if (!devocional) return res.status(404).json({
        "Mensaje de la API": 'No se encontro el devocional'
    })
    let urlAudio
    let urlImagen
    const fecha = new Date(devocional.fecha)
    const ruta = `devocionales/${fecha.getFullYear()}_${fecha.getMonth() + 1}_${fecha.getDate()}/`
    const { audioURL, imagenURL } = devocional
    if (audioURL) {
        urlAudio = await getFileURL(ruta, audioURL)
    }
    if (imagenURL) {
        urlImagen = await getFileURL(ruta, imagenURL)
    }
    console.log({
        "API:": devocional,
        'urlImagen: ': urlAudio,
        'urlAudio: ': urlImagen
    })
    return res.status(200).json({
        id: devocional._id,
        titulo: devocional.titulo,
        parrafo: devocional.parrafo,
        versiculo: devocional.versiculo,
        audioURL: urlAudio,
        imagenURL: urlImagen
    })
}

// Crear devocional
export const crearDevocional = async (req, res) => {
    console.log(req.files);
    console.log(req.body);
    const { titulo, parrafo, versiculo, fecha } = req.body
    let filenameImage = ''
    let filenameAudio = ''
    let mensaje = ``
    if (req.files.imagen) {
        const imagen = req.files.imagen
        const today = new Date();
        filenameImage += `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}_devocional_img.${imagen.name.split('.').pop()}`
        const response = await upload(imagen, `devocionales/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}/`, filenameImage)
        mensaje += response + " - "
    }
    if (req.files.audio) {
        const audio = req.files.audio
        const today = new Date();
        filenameAudio += `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}_devocional_audio.mp3`
        const response = await upload(audio, `devocionales/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}/`, filenameAudio)
        mensaje += response + " - "
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
    const { id } = req.params
    const { titulo, parrafo, versiculo, fecha } = req.body
    let filenameImage = ''
    let filenameAudio = ''
    let mensaje = ``
    try {
        if (req.files.imagen) {
            const imagen = req.files.imagen
            const fechaOriginal = new Date(fecha);
            filenameImage += `${fechaOriginal.getFullYear()}_${fechaOriginal.getMonth() + 1}_${fechaOriginal.getDate()}_devocional_img.${imagen.name.split('.').pop()}`
            const response = await upload(imagen, `devocionales/${fechaOriginal.getFullYear()}_${fechaOriginal.getMonth() + 1}_${fechaOriginal.getDate()}/`, filenameImage)
            mensaje += response + " - "
        }
        if (req.files.audio) {
            const audio = req.files.audio
            const fechaOriginal = new Date(fecha);
            filenameAudio += `${fechaOriginal.getFullYear()}_${fechaOriginal.getMonth() + 1}_${fechaOriginal.getDate()}_devocional_audio.mp3`
            const response = await upload(audio, `devocionales/${fechaOriginal.getFullYear()}_${fechaOriginal.getMonth() + 1}_${fechaOriginal.getDate()}/`, filenameAudio)
            mensaje += response + " - "
        }
        const updateData = {
            titulo: titulo,
            fecha: fecha,
            parrafo: parrafo,
            versiculo: versiculo
        };
        if (filenameAudio !== '') {
            updateData.audioURL = filenameAudio;
        }
        if (filenameImage !== '') {
            updateData.imagenURL = filenameImage;
        }

        const DevocionalFound = await Devocional.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        if (!DevocionalFound) return res.status(404).json({
            'API: ': 'Devocional no encontrado'
        })
        res.status(200).json({
            message: 'Devocional modificado exitosamente: \n' + mensaje
        })
    } catch (error) {
        res.status(500).json({
            "API - Ocurrio un error: ": error.message
        })
    }
}

export const cambiarEstadoDevocional = async (req, res) => {
    const { id } = req.body
    try {
        const DevocionlFind = await Devocional.findById(id)
        if(!DevocionlFind) return res.status(404).json({
            'API: ': 'Devocional no encontrado'
        })
        const updateData = {
            estado: !Devocional.estado
        }
        await Devocional.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        return res.status(200).json({
            'API: ':'Eliminado exitosamente'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            'API: ': error
        })
    }
}

export const test = (req, res) => {
    const today = new Date();
    const filenameImage = `Devocional_IMG_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`
    console.log(filenameImage);
}