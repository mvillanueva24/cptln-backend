import mongoose from "mongoose";

const contenidoSeccionSchema = new mongoose.Schema({
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
    contenidos: {
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
    videoHome: {
        type: String
    },
    imagenes: {
        type: [String]
    },
    portadaIndice: {
        type: [String]
    },
    secciones: {
        type: [seccionSchema]
    }
},
    {
        timestamps: true
    }
)

const Radio = mongoose.model('Radio', radioSchema)
const SeccionRadio = mongoose.model('SeccionRadio', seccionSchema)
const ContenidoSeccionRadio = mongoose.model('ContenidoSeccionRadio', contenidoSeccionSchema)

export { Radio, SeccionRadio, ContenidoSeccionRadio }