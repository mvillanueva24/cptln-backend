import Categoria from "../models/categoria.model.js"

export const categorias = async(req, res) => {
    const categorias = await Categoria.find()
    if (!categorias.length == 0) return res.status(400).send('Sin categorias')
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
    const { nombre, objetivo } = req.body
    const newCategoria = new Categoria({
        nombre: nombre,
        objetivo: objetivo
    })
    await newCategoria.save()
    return res.status(200).send('Categoria creada')
}

export const editarCategoria = async (req, res) => {
    const { id } = req.params
    const { nombre, objetivo } = req.body
    const categoriaFound = await Categoria.findByIdAndUpdate(
        id,
        { nombre, objetivo },
        { new: true }
    )
    if (!categoriaFound) return res.status(404).send('Categoria no encontrada')
    return res.status(200).send('Modificado correctamente')
}

export const buscarCategoria = async (req, res) => {
    const { id } = req.params
    const categoriaFound = await Categoria.findById(id)
    if (!categoriaFound) return res.sFtatus(404).send('Categoria no encontrada')
    return res.status(200).send(categoriaFound)
}

export const eliminarCategoria = async(req, res) =>{
    const {id} = req.body
    const categoriaFound = await Categoria.findByIdAndDelete(id)
    if (!categoriaFound) return res.status(404).send('No se encontro la categoria')
    return res.status(200).send('Categoria eliminada correctamente')
}