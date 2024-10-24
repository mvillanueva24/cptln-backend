import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    objetivo: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model('Categoria', categoriaSchema)