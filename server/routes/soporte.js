const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const SoporteController = require('../controllers/soporteController');
const router = express.Router();

// Configurar multer para manejo de archivos adjuntos
const upload = multer({ dest: 'uploads/' });

router.post('/', 
  upload.single('archivo'),
  [
    body('nombre').trim().isLength({ min: 2 }).withMessage('El nombre es obligatorio.'),
    body('email').isEmail().withMessage('Correo inválido.'),
    body('idCliente').trim().notEmpty().withMessage('El ID de cliente es obligatorio.'),
    body('mensaje').isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres.')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    SoporteController.enviarSoporte(req, res);
  }
);

module.exports = router;
