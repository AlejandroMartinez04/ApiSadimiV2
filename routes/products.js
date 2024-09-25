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

module.exports = router;
