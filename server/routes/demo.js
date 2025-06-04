const express = require('express');
const { body, validationResult } = require('express-validator');
const DemoController = require('../controllers/demoController');
const router = express.Router();

router.post('/',
  [
    body('nombre').trim().isLength({ min: 2 }).withMessage('El nombre es obligatorio.'),
    body('email').isEmail().withMessage('Correo inválido.'),
    body('tipoNegocio').trim().notEmpty().withMessage('El tipo de negocio es obligatorio.'),
    body('volumen').isNumeric().withMessage('El volumen debe ser un número.')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    DemoController.enviarDemo(req, res);
  }
);

module.exports = router;
