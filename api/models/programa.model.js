import mongoose from "mongoose";

const imagenSchema = new mongoose.Schema({
    ruta: {
        type: String,
        required: true
    },
    estadoHome: {
        type: Boolean,
        default: false
    },
});

const contenidoSchema = new mongoose.Schema({
    subtitulo: {
        type: String
    },
    parrafo: {
        type: String
    },
    imagen: {
        type: String,
        default: null
    }
})

const programaSchema = new mongoose.Schema({
    titulo: {
        type: String
    },
    abreviatura: {
        type: String
    },
    categoria: {
        type: String
    },
    descripcion: {
        type: String
    },
    color: {
        type: String
    },
    portada: {
        type: String
    },
    enlace: {
        type: String
    },
    contenido:{
        type: [contenidoSchema],
        default: []
    },
    imagenes: {
        type: [imagenSchema],
        default: []
    }
},
    {
        timestamps: true
    }
)


const Programa = mongoose.model('Programa', programaSchema);
const Contenido = mongoose.model('Contenido', contenidoSchema);

export { Programa, Contenido };