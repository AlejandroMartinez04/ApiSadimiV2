const express = require('express');
const router = express.Router();
const model =  require('../models/users');
const bcryptjs = require('bcryptjs');

router.get('/', async (req, res) => {
  try {
    const users = await model.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al leer usuarios' });
  }
});

router.post('/login', async (req, res) => {
  const {email,contrasena} = req.body;

  if (!email || !contrasena) {
      return res.status(400).json({
          status: 'Error',
          message: 'Correo y contraseña son obligatorios.',
      });
  }

  try {
      const user = await model.findOne({ email }).populate('direcciones').populate('direccionFavorita');

      if (!user) {
          return res.status(404).json({
              status: 'Error',
              message: 'Correo no registrado.',
          });
      }

      const isPasswordValid = await bcryptjs.compare(contrasena, user.contrasena);

      if (!isPasswordValid) {
          return res.status(401).json({
              status: 'Error',
              message: 'Correo o contraseña incorrectos.',
          });
      }

      res.status(200).json({
          status: 'Correcto',
          message: 'Haz iniciado sesión',
          user : user,
      });

  } catch (err) {
      console.error(err);
      res.status(500).json({
          status: 'Error',
          message: 'Error interno del servidor',
      });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await model.findOne({email: id}).populate('direcciones').populate('direccionFavorita');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

router.post('/', async (req, res) => {
  const user = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    documento: req.body.documento,
    telefono: req.body.telefono,
    email: req.body.email,
    contrasena: await bcryptjs.hash(req.body.contrasena, 10),
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

router.post('/address/:id', async (req, res) => {
  const id  = req.params.id;
  const direccion = req.body.direcciones;

  try {
    const user = await model.findOne({documento: id});
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.direcciones.push(direccion);
    if (direccion.favorite) {
      user.direccionFavorita = direccion.documento;
    }
    await user.save();

    res.json({ message: 'Direccion actualizada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }

});

router.post('/payment/:id', async (req, res) => {
  const id  = req.params.id;
  const datosPago = req.body.metodoPago;

  try {
    const user = await model.findOne({documento: id});
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.metodoPago.push(datosPago);
    if (datosPago.favorite) {
      user.pagoFavorito = datosPago.documento;
    }
    await user.save();

    res.json({ message: 'Metodo de pago actualizado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }

});


router.post('/sell/:id', async (req, res) => {
  const id  = req.params.id;
  const venta = req.body.venta;

  try {
    const user = await model.findOne({documento: id});
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user.ventas.push(venta);
    await user.save();

    res.json({ message: 'Venta realizada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al realizar la venta' });
  }

});

module.exports = router;