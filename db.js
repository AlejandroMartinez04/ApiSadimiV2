const mongoose = require('mongoose');
require('dotenv').config(); 

const DB_URI = process.env.DB_URI;

module.exports = () => {
  async function connectToDatabase() {
    try {
      await mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Conectado a la base de datos');
    } catch (err) {
      console.error('Error al conectar a la base de datos:', err);
    }
  }
  connectToDatabase();
};
