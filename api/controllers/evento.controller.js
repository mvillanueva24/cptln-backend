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
    console.log(``);
}

export const editarEvento = async(req, res) => {
    console.log(``);
}

export const estadoEvento = async(req, res) => {
    console.log(``);
}