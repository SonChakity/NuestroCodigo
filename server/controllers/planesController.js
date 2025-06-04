const transporter = require('../utils/mailer');
const Lead = require('mongoose').model('Lead');

exports.solicitarPlan = async (req, res) => {
  try {
    const nuevoPlan = new Lead({
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono || '',
      tipo: 'plan',
      servicio: req.body.plan,
      mensaje: ''
    });
    await nuevoPlan.save();

    await transporter.sendMail({
      from: `"Planes FinanciaPro" <planes@financiapro.com>`,
      to: 'ventas@financiapro.com',
      subject: `Solicitud de plan ${nuevoPlan.servicio} de ${nuevoPlan.nombre}`,
      text: `
        Plan: ${nuevoPlan.servicio}
        Nombre: ${nuevoPlan.nombre}
        Email: ${nuevoPlan.email}
        Teléfono: ${nuevoPlan.telefono}
      `
    });

    res.status(200).json({ mensaje: 'Solicitud de contratación recibida. Te contactaremos pronto.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar la contratación del plan.' });
  }
};
