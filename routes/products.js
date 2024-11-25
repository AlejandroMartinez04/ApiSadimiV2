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

  const value = parseFloat(req.body.valor);
  product.valor = formatearDinero(value);

  const offer = parseFloat(req.body.precio_oferta);
  product.precio_oferta = formatearDinero(offer);


  let discountPercentage = '';
  if (value > 0 && offer > 0) {
    const discount = ((value - offer) / value) * 100;
    discountPercentage = `${discount.toFixed(2)} %`; // Formato con dos decimales
  }

  product.descuento = discountPercentage; // Agregar el descuento al producto

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

// router.put('/:id', async (req, res) => {
//   try {
//     const product = await model.findOne({ id: req.params.id });
//     if (!product) {
//       return res.status(404).json({ message: 'Producto no encontrado' });
//     }
//     await model.updateOne({ id: req.params.id }, { $set: { ...req.body } });
//     res.json({ message: 'Producto actualizado con éxito' });
//   } catch (err) {
//     handleError(res, err, 'Error al actualizar el producto');
//   }
// });


router.put('/:id', async (req, res) => {
  try {
    const product = await model.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    if (req.body.valor && req.body.precio_oferta) {
      const nuevoPrecioOferta = req.body.precio_oferta;
      const nuevoValor = req.body.valor;
      const nuevoDescuento = PorcentajeDescuento(nuevoValor, nuevoPrecioOferta);

      req.body.descuento = nuevoDescuento;
      req.body.valor = formatearDinero(nuevoValor);
      req.body.precio_oferta = formatearDinero(nuevoPrecioOferta);

    } else if (req.body.valor == false && req.body.precio_oferta) {
      const nuevoPrecio = req.body.valor;
      const PrecioOferta = parseFloat(product.precio_oferta.replace(/\./g, '').replace(',', '.'));
      const nuevoDescuento = PorcentajeDescuento(nuevoPrecio, PrecioOferta);
      req.body.descuento = nuevoDescuento;
      req.body.valor = formatearDinero(nuevoPrecio);

    } else {
      const nuevoPrecioOferta = req.body.precio_oferta;
      const valor = parseFloat(product.valor.replace(/\./g, '').replace(',', '.'));
      const nuevoDescuento = PorcentajeDescuento(valor, nuevoPrecioOferta);
      req.body.descuento = nuevoDescuento;
      req.body.precio_oferta = formatearDinero(nuevoPrecioOferta);
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


function formatearDinero(monto) {
  return monto.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function PorcentajeDescuento(precio, oferta) {
  const discount = ((precio - oferta) / precio) * 100;
  discountPercentage = `${discount.toFixed(0)}%`;
  return discountPercentage;
}

module.exports = router;
