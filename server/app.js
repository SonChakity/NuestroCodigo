require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const csrfProtection = csrf({ cookie: false });
const limiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

// Conexión a MongoDB (ajusta la URI en .env)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Modelos de ejemplo (esquema Lead)
const leadSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String,
  tipo: String,
  servicio: String,
  idCliente: String,
  negocio: String,
  volumen: Number,
  mensaje: String,
  fecha: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', leadSchema);

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de API
const contactoRouter = require('./routes/contacto');
const soporteRouter = require('./routes/soporte');
const demoRouter = require('./routes/demo');
const planesRouter = require('./routes/planes');

app.use('/api/contacto', csrfProtection, contactoRouter);
app.use('/api/soporte', csrfProtection, soporteRouter);
app.use('/api/demo', csrfProtection, demoRouter);
app.use('/api/planes', csrfProtection, planesRouter);

// Manejo de errores genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));
