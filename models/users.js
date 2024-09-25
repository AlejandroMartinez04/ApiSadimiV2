const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    documento: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return v !== null && v !== undefined;
        },
        message: 'El documento no puede ser nulo o vacío'
      }
    },
    telefono: { type: Number, required: true },
    email: { type: String, required: true , unique: true},
    contrasena: { type: String, required: true },
  });

module.exports = mongoose.model('users', userSchema);

