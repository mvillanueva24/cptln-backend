import mongoose from "mongoose";

const cursoModel = new mongoose.Schema({
    titulo: {
        type: String
    },
    portada: {
        type: String
    },
    capitulos: {
        type: [String]   
    },
    archivos: {
        type: [String]
    },

},
    {
        timestamps: true
    }
)

export default mongoose.model('Curso', cursoModel)