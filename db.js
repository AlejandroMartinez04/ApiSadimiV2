// db.js
const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://Admin:Admin123.@clustersadimi.xqcd4.mongodb.net/';

module.exports = () => {

  async function connectToDatabase() {
    try {
      await mongoose.connect(DB_URI, {
      });
      console.log('Conectado a la base de datos');
    } catch (err) {
      console.error('Error al conectar a la base de datos:', err);
    }
  }
  
  connectToDatabase();

}