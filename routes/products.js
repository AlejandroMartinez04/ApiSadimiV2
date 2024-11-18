const express = require('express');
const router = express.Router();
const model = require('../models/products');

const validateProduct = (req, res, next) => {
  const { nombre, stock, valor, categoria, descripcion, imagen, precio_oferta, marca } = req.body;
  if (!nombre || !stock || !valor || !categoria || !descripcion || !imagen || !precio_oferta || !marca) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
  next();
};

const handleError = (res, err, message) => {
  console.error(err);
  res.status(500).json({ message });
};

router.get('/', async (req, res) => {
  try {
    const products = await model.find();
    res.json(products);
  } catch (err) {
    handleError(res, err, 'Error al leer los productos');
  }
});

router.post('/', validateProduct, async (req, res) => {
  const product = { ...req.body };
  try {
    await model.create(product);
    res.json({ message: 'Producto creado con éxito' });
  } catch (err) {
    handleError(res, err, 'Error al crear un producto');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await model.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (err) {
    handleError(res, err, 'Error al leer el producto');
  }
});

router.put('/:id', validateProduct, async (req, res) => {
  try {
    const product = await model.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await model.updateOne({ id: req.params.id }, { $set: { ...req.body } });
    res.json({ message: 'Producto actualizado con éxito' });
  } catch (err) {
    handleError(res, err, 'Error al actualizar el producto');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await model.deleteOne({ id: req.params.id });
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (err) {
    handleError(res, err, 'Error al eliminar el producto');
  }
});

module.exports = router;
