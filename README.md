# FinanciaPro Pagos

Repositorio del proyecto “FinanciaPro Pagos”: sitio web informativo y corporativo para una empresa ficticia de procesamiento de pagos.

## Tecnologías utilizadas

- **Frontend**: HTML5 semántico, CSS personalizado y JavaScript (ES6+).
- **Backend**: Node.js 18+, Express 4.x.
- **Base de datos**: MongoDB (o MySQL, a elección). En este ejemplo usaremos MongoDB con Mongoose.
- **Emails**: nodemailer + servicio SMTP configurado con variables de entorno.

## Instrucciones para poner en marcha

1. Clonar el repositorio y entrar a la carpeta:
   ```bash
   git clone https://github.com/tuusuario/financiapro-pagos.git
   cd financiapro-pagos
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Asegúrate de que el archivo `public/css/styles.css` esté presente (ya está incluido en el repositorio).

4. Crear archivo .env en la raíz con las siguientes variables:
   ```ini
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/financiapro
   SMTP_HOST=smtp.ejemplo.com
   SMTP_PORT=587
   SMTP_USER=usuario_smtp
   SMTP_PASS=pass_smtp
   ```
5. Levantar el servidor Node:
   ```bash
   node server/app.js
   ```
6. Abrir en el navegador http://localhost:3000/index.html.

## Estructura del proyecto
(Explica brevemente la organización de carpetas, rutas y componentes)
