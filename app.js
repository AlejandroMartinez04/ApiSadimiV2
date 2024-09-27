const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const initDB = require('./db');
const port = 3000
const cors = require('cors');

//Middlewares
app.use(express.json());
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use(cors(corsOptions));

let corsOptions = {
  origin: ['http://localhost:4321'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization']
};

app.listen(port, () => {
  console.log('Server listening on port', port);
})

initDB()

module.exports = app;