const transporter = require('../utils/mailer');
const Lead = require('mongoose').model('Lead');

exports.enviarLead = async (req, res) => {
  try {
    // Guardar en base de datos
    const nuevoLead = new Lead({
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono || '',
      tipo: req.body.tipo || 'general',
      servicio: req.body.servicio || '',
      mensaje: req.body.mensaje
    });
    await nuevoLead.save();

    // Enviar correo de notificación interna
    await transporter.sendMail({
      from: `"FinanciaPro" <no-reply@financiapro.com>`,
      to: 'ventas@financiapro.com',
      subject: `Nueva consulta de ${nuevoLead.nombre}`,
      text: `
        Tipo: ${nuevoLead.tipo}
        Nombre: ${nuevoLead.nombre}
        Email: ${nuevoLead.email}
        Teléfono: ${nuevoLead.telefono}
        Servicio: ${nuevoLead.servicio}
        Mensaje: ${nuevoLead.mensaje}
      `
    });

    res.status(200).json({ mensaje: '¡Gracias! Tu mensaje ha sido enviado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar tu solicitud.' });
  }
};
