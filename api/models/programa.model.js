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
    estadoDetalles: {
        type: Boolean,
        default: false
    }
});

const programaSchema = new mongoose.Schema({
    titulo: {
        type: String
    },
    categoria: {
        type: String
    },
    descripcion:{
        type: String
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

export default mongoose.model('Programa', programaSchema)