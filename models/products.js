const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    cantidad: { type: Number, required: true },
    valor: {
      type: Number,
      required: true,
      validate: {
        validator: function(v) {
          return v !== null && v !== undefined;
        },
        message: 'El valor no puede ser nulo o vacío'
      }
    },
    categoria: { type: String, required: true },
    descripcion: { type: String},
    imagen: { type: String, required: true },
    precio_oferta: { type: Number },
    colores: { type: Array },
    marca: { type: String }
  });

module.exports = mongoose.model('products', productSchema);

