import Categoria from "../models/categoria.model.js"
import { getFileURL, upload } from '../../api/aws/s3.js'
export const categorias = async (req, res) => {
    const categorias = await Categoria.find()
    for (const categoria of categorias) {
        for (const imagen of categoria.imagenes){
            const tmp = imagen.ruta
            // console.log(tmp);
            imagen.ruta = await getFileURL(tmp)
        }
    }
    if (!categorias) return res.status(400).send('Sin categorias')
    return res.status(200).send(categorias)
}

export const categoriasPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const categorias = await Categoria.find().skip((page - 1) * limit).limit(limit)
    const totalCategorias = await Categoria.countDocuments()
    if (categorias.length == 0) return res.status(400).send('Aun no hay categorias')
    return res.status(200).json({
        categorias,
        currentPage: page,
        totalPages: Math.ceil(totalCategorias / limit),
        totalCategorias
    })
}

export const crearCategoria = async (req, res) => {
    const { nombre, descripcion, color } = req.body
    const newCategoria = new Categoria({
        nombre: nombre,
        descripcion: descripcion,
        color: color
    })
    if (req.files) {
        const { imagenes } = req.files
        for (let index = 0; imagenes.length > index; index++) {
            const ruta = `categorias/${newCategoria.nombre}/${index}/${imagenes[index].name}`
            await upload(imagenes[index], ruta)
            newCategoria.imagenes.push({ruta})
        }
    }
    await newCategoria.save()
    return res.status(200).send('Categoria creada')
}

export const editarCategoria = async (req, res) => {
    console.log(req.files);
    const { id } = req.params
    const { nombre, descripcion, color } = req.body
    const categoriaFound = await Categoria.findById(id)
    categoriaFound.nombre = nombre
    categoriaFound.descripcion = descripcion
    categoriaFound.color = color
    if (!categoriaFound) return res.status(404).send('Categoria no encontrada')
    // if (portadaIndex) {
    //     for (let index = 0; categoriaFound.imagenes.length > index; index++) {
    //         if (index == portadaIndex){
    //             categoriaFound.imagenes[index].estado = true
    //         } else {
    //             categoriaFound.imagenes[index].estado = false
    //         }
    //     }
    // }
    if (req.files) {
        const { imagenes } = req.files
        categoriaFound.imagenes = []
        for (let index = 0; imagenes.length > index; index++) {
            const ruta = `categorias/${categoriaFound.nombre}/${index}/${imagenes[index].name}`
            await upload(imagenes[index], ruta)
            categoriaFound.imagenes.push({ruta})
        }
    }
    await categoriaFound.save()
    return res.status(200).send('Modificado correctamente')
}

export const buscarCategoria = async (req, res) => {
    const { id } = req.params
    const categoriaFound = await Categoria.findById(id)
    if (!categoriaFound) return res.status(404).send('Categoria no encontrada')
    if (categoriaFound.imagenes) {
        const imagenes = categoriaFound.imagenes
        categoriaFound.imagenes = []
        for (const imagen of imagenes){
            const ruta = await getFileURL(imagen.ruta)
            categoriaFound.imagenes.push({ruta: ruta , estado: imagen.estado})
        }
    }
    return res.status(200).send(categoriaFound)
}

export const buscarCategoriaPorNombre = async (req, res) => {
    const { nombre } = req.body
    console.log(nombre);
    const customNombre = nombre.replace(/-/g, ' ');
    console.log(customNombre);
    const categoriaFound = await Categoria.find({nombre: { $regex: new RegExp(`^${customNombre.toLowerCase()}$`, "i") }})
    console.log(categoriaFound);
    if (!categoriaFound) { return res.status(404).send('Categoria no encontrada') }
    return res.status(200).send(categoriaFound)
}
export const eliminarCategoria = async (req, res) => {
    const { id } = req.body
    const categoriaFound = await Categoria.findByIdAndDelete(id)
    if (!categoriaFound) return res.status(404).send('No se encontro la categoria')
    return res.status(200).send('Categoria eliminada correctamente')
}