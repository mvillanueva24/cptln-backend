import mongoose from "mongoose";
const eventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    cuerpo: {
        type: String,
        required: true,
    },
    ubicacion: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
    },
    hora:{
        type: String,
    },
    estado: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

export default mongoose.model('Evento', eventoSchema)