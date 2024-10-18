import mongoose from "mongoose";
const NoticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    autor:{
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    stock: {
        type: String,
        required: true,
        trim: true
    },
    observation: {
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps: true
})

export default mongoose.model('Book', BookSchema)