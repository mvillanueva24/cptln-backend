import mongoose from "mongoose";
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author:{
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