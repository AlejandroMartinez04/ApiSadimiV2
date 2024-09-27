const mongoose = require('mongoose');

const direccionsSchema = new mongoose.Schema({
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  pais: { type: String, required: true },
  favorite: { type: Boolean, default: false }
});

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
    direcciones: [direccionsSchema],
    direccionFavorita: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
  });

module.exports = mongoose.model('users', userSchema);

