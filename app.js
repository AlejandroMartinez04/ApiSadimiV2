const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const initDB = require('./db');
const port = 3000

//Middlewares
app.use(express.json());
app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.listen(port, () => {
  console.log('Server funcionando en puerto', port);
})

initDB()

module.exports = app;