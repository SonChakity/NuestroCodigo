const transporter = require('../utils/mailer');
const Lead = require('mongoose').model('Lead');

exports.enviarDemo = async (req, res) => {
  try {
    // Guardar en BD
    const nuevaDemo = new Lead({
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono || '',
      tipo: 'demo',
      negocio: req.body.tipoNegocio,
      volumen: req.body.volumen,
      mensaje: req.body.mensaje || ''
    });
    await nuevaDemo.save();

    // Enviar correo de aviso
    await transporter.sendMail({
      from: `"Demo FinanciaPro" <demo@financiapro.com>`,
      to: 'ventas@financiapro.com',
      subject: `Nueva solicitud de demo de ${nuevaDemo.nombre}`,
      text: `
        Nombre: ${nuevaDemo.nombre}
        Email: ${nuevaDemo.email}
        Teléfono: ${nuevaDemo.telefono}
        Tipo de negocio: ${nuevaDemo.negocio}
        Volumen mensual aproximado: ${nuevaDemo.volumen}
        Mensaje: ${nuevaDemo.mensaje}
      `
    });

    res.status(200).json({ mensaje: '¡Listo! Pronto te contactaremos para la demo.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar tu solicitud de demo.' });
  }
};
