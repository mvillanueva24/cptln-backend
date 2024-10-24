import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema({
    titulo: {
        type: String
    },
    descripcion: {
        type: String
    },
    portada: {
        type: String  
    },
    pdf: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
)

export default mongoose.model('Ebook', ebookSchema)