const express = require('express');
const { body, validationResult } = require('express-validator');
const PlanesController = require('../controllers/planesController');
const router = express.Router();

router.post('/',
  [
    body('plan').trim().notEmpty().withMessage('El plan seleccionado es obligatorio.'),
    body('nombre').trim().isLength({ min: 2 }).withMessage('El nombre es obligatorio.'),
    body('email').isEmail().withMessage('Correo inválido.')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    PlanesController.solicitarPlan(req, res);
  }
);

module.exports = router;
