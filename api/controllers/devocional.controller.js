import Devocional from "../models/devocional.model.js"

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
    const inicioHoy = new Date(hoy.setHours(0, 0, 0, 0))
    const finHoy = new Date(hoy.setHours(23, 59, 59, 999))
    const devocional = await Devocional.find({
        fecha: {
            $gte: inicioHoy,
            $lt: finHoy
        }
    })
    if (!devocional) return res.status(400).json({
        message: 'No se encontro el devocional de hoy'
    })
    res.status(200).json({
        message: devocional
    })
    return devocional
}


// Crear devocional
export const crearDevocional = async (req, res) => {
    const { titulo, audioURL, imagen, parrafo, fecha } = req.body
    try {
        const newDevocional = new Devocional({
            titulo: titulo,
            audioURL: audioURL,
            imagen: imagen,
            parrafo: parrafo,
            fecha: fecha
        })
        await newDevocional.save()
        res.status(200).json({
            message: 'Devocional creado exitosamente'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
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
                audioURL: audioURL,
                imagen: imagen,
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