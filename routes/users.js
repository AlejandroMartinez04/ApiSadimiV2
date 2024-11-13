const express = require('express');
const router = express.Router();
const model = require('../models/users');
const bcryptjs = require('bcryptjs');

// Middleware de validación
const validateUser = (req, res, next) => {
  const { email, contrasena } = req.body;
  if (!email || !contrasena) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
  }
  next();
};

// Manejo de errores
const handleError = (res, err, message) => {
  console.error(err);
  res.status(500).json({ message });
};

router.get('/', async (req, res) => {
  try {
    const users = await model.find();
    res.json(users);
  } catch (err) {
    handleError(res, err, 'Error al leer usuarios');
  }
});

router.post('/login', validateUser, async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const user = await model.findOne({ email }).populate('direcciones').populate('direccionFavorita');
    if (!user) {
      return res.status(404).json({ message: 'Correo no registrado.' });
    }
    const isPasswordValid = await bcryptjs.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }
    res.status(200).json({ message: 'Haz iniciado sesión', user });
  } catch (err) {
    handleError(res, err, 'Error interno del servidor');
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await model.findOne({ email: id }).populate('direcciones').populate('direccionFavorita');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    handleError(res, err, 'Error al obtener usuario');
  }
});

router.post('/', async (req, res) => {
  const user = req.body;
  try {
    user.contrasena = await bcryptjs.hash(user.contrasena, 10);
    const result = await model.create(user);
    res.status(201).json({ message: 'Usuario creado con éxito', user: result });
  } catch (err) {
    handleError(res, err, 'Error al crear usuario');
  }
});

router.put('/:id', validateUser, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await model.findOne({ documento: id });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await model.updateOne({ documento: id }, { $set: { ...req.body } });
    res.json({ message: 'Usuario actualizado con éxito' });
  } catch (err) {
    handleError(res, err, 'Error al actualizar usuario');
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await model.deleteOne({ documento: id });
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (err) {
    handleError(res, err, 'Error al eliminar usuario');
  }
});

const updateUserField = async (req, res, field) => {
  const id = req.params.id;
  const data = req.body[field];
  try {
    const user = await model.findOne({ documento: id });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user[field].push(data);
    if (data.favorite) {
      user[`favorito_${field}`] = data.documento;
    }
    await user.save();
    res.json({ message: `${field} actualizado con éxito` });
  } catch (err) {
    handleError(res, err, `Error al actualizar ${field}`);
  }
};

router.post('/address/:id', (req, res) => updateUserField(req, res, 'direcciones'));
router.post('/payment/:id', (req, res) => updateUserField(req, res, 'metodoPago'));
router.post('/sell/:id', (req, res) => updateUserField(req, res, 'ventas'));

module.exports = router;
