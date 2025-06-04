const transporter = require('../utils/mailer');
const Lead = require('mongoose').model('Lead');
const fs = require('fs');
const path = require('path');

exports.enviarSoporte = async (req, res) => {
  try {
    // Guardar en base de datos
    const nuevoSoporte = new Lead({
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono || '',
      tipo: 'soporte',
      idCliente: req.body.idCliente,
      mensaje: req.body.mensaje
    });
    await nuevoSoporte.save();

    // Preparar adjunto si existe
    let attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        path: req.file.path
      });
    }

    // Enviar correo de soporte
    await transporter.sendMail({
      from: `"Soporte FinanciaPro" <soporte@financiapro.com>`,
      to: 'soporte@financiapro.com',
      subject: `Nueva petición de soporte de ${nuevoSoporte.nombre}`,
      text: `
        Nombre: ${nuevoSoporte.nombre}
        Email: ${nuevoSoporte.email}
        Teléfono: ${nuevoSoporte.telefono}
        ID Cliente: ${nuevoSoporte.idCliente}
        Mensaje: ${nuevoSoporte.mensaje}
      `,
      attachments
    });

    // Si hay archivo, elimínalo del servidor tras enviarlo
    if (req.file) {
      fs.unlink(path.join(__dirname, '../', req.file.path), (err) => {
        if (err) console.error('Error al eliminar archivo:', err);
      });
    }

    res.status(200).json({ mensaje: 'Tu solicitud de soporte ha sido enviada.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar tu solicitud de soporte.' });
  }
};
