import Evento from "../models/evento.model.js"

export const eventos = async(req, res) => {
    const eventos = await Evento.find().sort({fecha: -1})
    if (eventos.length == 0) {
        console.log(`Sin eventos aun`)
        return res.status(400).json({
            'API: ':'Aun no hay eventos' 
        })
    }
    return eventos
}

export const buscarEvento = async(req, res) => {
    console.log(``);
}

export const crearEvento = async(req, res) => {
    const { titulo, cuerpo, fecha, ubicacion } = req.body
    try {
        const newEvent = new Evento({
            titulo: titulo,
            cuerpo: cuerpo,
            fecha: fecha,
            ubicacion: ubicacion
        })
        await newEvent.save()
        return res.status(200).json({
            API:'Evento creado exitosamente'
        })
    } catch (error) {
        console.log(`API: `+error);
        res.status(400).send('API: No se logro crear un evento')
    }
}

export const editarEvento = async(req, res) => {
    console.log(``);
}

export const estadoEvento = async(req, res) => {
    console.log(``);
}