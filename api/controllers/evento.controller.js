import Evento from "../models/evento.model.js"

export const eventos = async (req, res) => {
    const eventos = await Evento.find().sort({ fecha: -1 })
    if (eventos.length == 0) return res.status(400).send('Aun no hay eventos')
    return res.status(200).send(eventos)
}

export const eventosPagination = async(req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const eventos = await Evento.find().sort({ fecha: -1 }).skip((page - 1) * limit).limit(limit)
    const totalEventos = await Evento.countDocuments()
    if (eventos.length == 0) return res.status(400).send('Aun no hay eventos')
    return res.status(200).json({
        eventos,
        currentPage: page,
        totalPages: Math.ceil(totalEventos/limit),
        totalEventos
    })
}

export const buscarEvento = async (req, res) => {
    const { id } = req.params
    const eventFound = await Evento.findById(id)
    if (!eventFound) return res.status(404).send('Evento no encontrado')
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
        return res.status(200).send('Evento creado exitosamente')
    } catch (error) {
        console.log(error)
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
        console.log(error)
    }
}

export const estadoEvento = async (req, res) => {
    const { id } = req.body
    try {
        const EventoFound = await Evento.findById(id)
        if (!EventoFound) return res.status(404).send('Devocional no encontrado')
        const updateData = {
            estado: !EventoFound.estado
        }
        await Evento.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        return res.status(200).send('Eliminado exitosamente')
    } catch (error) {
        console.log(error)
    }
}