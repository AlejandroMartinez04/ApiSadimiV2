const mongoose = require('mongoose');

const direccionsSchema = new mongoose.Schema({
  departamento: { type: String, required: true },
  ciudad: { type: String, required: true },
  direccion: { type: String, required: true }
});

const paymentSchema = new mongoose.Schema({
  numberCard: { type: Number, required: true},
  dateExp: { type: String, required: true},
  cvv: { type: Number, required: true},
  favorite: { type: Boolean, default: false }
});

const sellSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  product: [],
  payment: { type: String, required: true},
  total: { type: Number, required: true }  
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
    direccionFavorita: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    metodoPago: [paymentSchema],
    pagoFavorito: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    ventas: [sellSchema]
  });

module.exports = mongoose.model('users', userSchema);

