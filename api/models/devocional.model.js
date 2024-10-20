import mongoose from "mongoose";
const devocionalSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    parrafo: {
        type: String,
        required: true,
    },
    versiculo: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
    },
    audioURL:{
        type: String,
    },
    imagenURL: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

export default mongoose.model('Devocional', devocionalSchema)