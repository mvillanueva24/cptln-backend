import mongoose from "mongoose";



const contenidoSeccionSchema = new mongoose.Schema({
    nombre: {
        type: String
    },
    descripcion: {
        type: String
    },
    imagenes: {
        type: [String]
    },
    videos: {
        type: [String]
    },
    audios: {
        type: [String]
    }
})

const seccionSchema = new mongoose.Schema({
    nombre: {
        type: String
    },
    contenido: {
        type: [contenidoSeccionSchema]
    }
})


const radioSchema = new mongoose.Schema({
    nombre: {
        type: String
    },
    descripcion: {
        type: String
    },
    imagenes: {
        type: [String]
    },
    portada: {
        type: [String]
    },
    secciones: {
        type: [seccionSchema]
    }
})

const Radio = mongoose.model('Radio',radioSchema)
const SeccionRadio = mongoose.model('SeccionRadio',seccionSchema)
const ContenidoSeccionRadio = mongoose.model('ContenidoSeccionRadio',contenidoSeccionSchema)

export default {Radio, SeccionRadio, ContenidoSeccionRadio}