// users.js
const express = require('express');
const router = express.Router();
const initDB = require('../db');
const model =  require('../models/users');

router.get('/', async (req, res) => {
  try {
    const users = await model.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer usuarios' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user =  await model.findOne({email: id})
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer usuario' });
  }
});


router.post('/', async (req, res) => {

  const user = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    documento: req.body.documento,
    telefono: req.body.telefono,
    email: req.body.email,
    contrasena: req.body.contrasena,
  };

  try {
    const result = await model.create(user);
    res.json({ message: 'Usuario creado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});



router.put('/:id', async (req, res) => {

  const id = req.params.id;

  try {
    const user = await model.findOne({ documento: id });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updates = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      documento: req.body.documento,
      telefono: req.body.telefono,
      email: req.body.email,
      contrasena: req.body.contrasena,
    };

    await model.updateOne({ documento: id }, { $set: updates });
    res.json({ message: 'Usuario actualizado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

router.delete('/:id', async (req, res) => {

  const id = req.params.id;

  try {
    await model.deleteOne({ documento: id });
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;