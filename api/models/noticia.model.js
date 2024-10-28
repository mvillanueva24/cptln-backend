import mongoose from "mongoose";
const NoticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    cuerpo: {
        type: String
    },
    fecha: {
        type: String
    },
    portada: {
        type: String
    },
    programaRef: {
        type: String
    },
    imagenes:{
        type: [String]
    },
    estado: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

export default mongoose.model('Noticia', NoticiaSchema)