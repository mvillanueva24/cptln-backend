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
    audioURL:{
        type: String,
    },
    imagen: {
        type: String,
    },
    fecha: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

export default mongoose.model('Devocional', devocionalSchema)