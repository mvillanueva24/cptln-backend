import mongoose from "mongoose";
const devocionalSchema = new mongoose.Schema({
    titulo: {
        type: String,
    },
    parrafo: {
        type: String,
    },
    versiculo: {
        type: String,
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

const Devocional = mongoose.model('Devocional', devocionalSchema)
export default Devocional