import mongoose from "mongoose";
const oracionSchema = new mongoose.Schema({
    nombre: {
        type: String,
    },
    apellido: {
        type: String,
    },
    correo: {
        type: String,
    },
    mensaje: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

export default mongoose.model('Oracion', oracionSchema)