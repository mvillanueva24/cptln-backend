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
    imagenes:{
        type: [String]
    }
},{
    timestamps: true
})

export default mongoose.model('Book', BookSchema)