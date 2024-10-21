import Evento from "../models/evento.model.js"

export const eventos = async (req, res) => {
    const eventos = await Evento.find().sort({ fecha: -1 })
    if (eventos.length == 0) {
        console.log(`Sin eventos aun`)
        return res.status(400).json({
            'API: ': 'Aun no hay eventos'
        })
    }
    return res.status(200).send(eventos)
}

export const buscarEvento = async (req, res) => {
    const { id } = req.params
    const eventFound = await Evento.findById(id)
    if (!eventFound) return res.status(404).send('Evento no encontrado')
    console.log(eventFound)
    res.status(200).json({
        API: eventFound
    })
    return res.status(200).send(eventFound)
}

export const crearEvento = async (req, res) => {
    const { titulo, cuerpo, fecha, hora, ubicacion } = req.body
    try {
        const newEvent = new Evento({
            titulo: titulo,
            cuerpo: cuerpo,
            fecha: fecha,
            hora: hora,
            ubicacion: ubicacion
        })
        await newEvent.save()
        return res.status(200).json({
            API: 'Evento creado exitosamente'
        })
    } catch (error) {
        console.log(`API: ` + error);
        res.status(400).send('API: No se logro crear un evento')
    }
}

export const editarEvento = async (req, res) => {
    const { id } = req.params
    const { titulo, cuerpo, fecha, hora, ubicacion } = req.body
    try {
        const EventoFound = await Evento.findByIdAndUpdate(
            id,
            { titulo, cuerpo, fecha, hora, ubicacion },
            { new: true }
        )
        if (!EventoFound) return res.status(404).send('Evento no encontrado')
        return res.status(200).send('Evento modificado exitosamente')
    } catch (error) {
        console.log('Ha ocurrido el siguiente error: ' + error)
        res.status(500).send('API: Ha ocurrido un error')
    }
}

export const estadoEvento = async (req, res) => {
    const { id } = req.body
    try {
        const EventoFound = await Evento.findById(id)
        if (!EventoFound) return res.status(404).json({
            'API: ': 'Devocional no encontrado'
        })
        const updateData = {
            estado: !EventoFound.estado
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