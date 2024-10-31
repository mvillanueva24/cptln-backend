import { Radio, SeccionRadio, ContenidoSeccionRadio } from "../models/radio.model.js";

export const updateDataRadio = (req, res) =>{ 
    const {titulo, descripcion} = req.body
    if (req.files) {
        if (req.files && req.files.portada) {

        }
        if (req.files && req.files.imagenes ) {
            
        }
    }
}