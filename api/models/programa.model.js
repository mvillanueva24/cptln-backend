import mongoose from "mongoose";

const imagenSchema = new mongoose.Schema({
    ruta: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: false // Por defecto, el estado es verdadero
    }
});

const programaSchema = new mongoose.Schema({
    titulo: {
        type: String
    },
    categoria: {
        type: String
    },
    link: {
        type: String,
        required: true
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