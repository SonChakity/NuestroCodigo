const express = require('express');
const { body, validationResult } = require('express-validator');
const ContactoController = require('../controllers/contactoController');

const router = express.Router();

// Validaciones básicas para formulario de contacto
router.post('/',
  [
    body('nombre').trim().isLength({ min: 2 }).withMessage('El nombre es obligatorio.'),
    body('email').isEmail().withMessage('Correo inválido.'),
    body('mensaje').isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres.')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    ContactoController.enviarLead(req, res);
  }
);

module.exports = router;
