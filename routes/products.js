// products.js
const express = require('express');
const router = express.Router();
const model =  require('../models/products');

router.get('/', async (req, res) => {
  try {
    const products = await model.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer los productos' });
  }
});

router.post('/', async (req, res) => {

  const product = {
    nombre: req.body.nombre,
    cantidad: req.body.cantidad,
    valor: req.body.valor,
    categoria: req.body.categoria,
    descripcion: req.body.descripcion,
    imagen: req.body.imagen,
  };

  try {
    const result = await model.create(product);
    res.json({ message: 'Producto creado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear un productos' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const product =  await model.findOne({nombre: id})
    if (!product) {
      return res.status(404).json({ message: 'producto no encontrado' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer el producto' });
  }
});

router.put('/:id', async (req, res) => {

  const id = req.params.id;

  try {
    const product = await model.findOne({ nombre: id });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const updates = {
      nombre: req.body.nombre,
      cantidad: req.body.cantidad,
      valor: req.body.valor,
      categoria: req.body.categoria,
      descripcion: req.body.descripcion,
      imagen: req.body.imagen,
    };

    await model.updateOne({ nombre: id }, { $set: updates });
    res.json({ message: 'Producto actualizado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el Producto' });
  }
});

router.delete('/:id', async (req, res) => {

  const id = req.params.id;

  try {
    await model.deleteOne({ nombre: id });
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar Producto' });
  }
});

module.exports = router;
