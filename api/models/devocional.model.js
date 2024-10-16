import mongoose from "mongoose";
const devocionalSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    audioURL:{
        type: String,
    },
    imagen: {
        type: String,
        required: true,
    },
    parrafo: {
        type: String,
        required: true,
    },
    fecha: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

export default mongoose.model('Devocional', devocionalSchema)