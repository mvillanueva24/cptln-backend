import mongoose from "mongoose";
const imagenSchema = new mongoose.Schema({
    ruta: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: false
    }
});

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    color: {
        type: String
    },
    imagenes: {
        type: [imagenSchema],
        default: []
    },
},
    {
        timestamps: true
    }
)

const Categoria = mongoose.model('Categoria', categoriaSchema)
export default Categoria