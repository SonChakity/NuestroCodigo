CREATE DATABASE financiapro;
USE financiapro;

CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(50),
  tipo VARCHAR(50),
  servicio VARCHAR(100),
  idCliente VARCHAR(100),
  negocio VARCHAR(100),
  volumen INT,
  mensaje TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);
