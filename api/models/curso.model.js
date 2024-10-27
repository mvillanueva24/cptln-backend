import mongoose from "mongoose";

const capituloSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    pdf: {
        type: String,
    },
    idYoutube: {
        type: String
    }
});

const cursoModel = new mongoose.Schema({
    titulo: {
        type: String
    },
    descripcion: {
        type: String
    },
    capitulos: {
        type: [capituloSchema]
    }

},
    {
        timestamps: true
    }
)

export default mongoose.model('Curso', cursoModel)