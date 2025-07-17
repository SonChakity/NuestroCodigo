# Mi Plan 50-30-20

## 📋 Descripción

"Mi Plan 50-30-20" es una aplicación web estática para gestionar tu presupuesto personal basada en la regla financiera 50-30-20:

- **50%** para **Necesidades** (gastos esenciales)
- **30%** para **Deseos** (entretenimiento y hobbies)
- **20%** para **Ahorro** (inversiones y emergencias)

## 🚀 Características

- ✅ **Interfaz intuitiva** con diseño responsive
- ✅ **Gestión de presupuesto** automática por categorías
- ✅ **Seguimiento de gastos** con historial de transacciones
- ✅ **Persistencia local** usando localStorage
- ✅ **Lógica inteligente** para manejar gastos que exceden categorías
- ✅ **Función "Mes terminado"** para reiniciar y transferir sobrantes
- ✅ **Validaciones** y mensajes de usuario
- ✅ **Sin dependencias externas** - funciona offline

## 📁 Estructura de archivos

```
Mi-Plan-50-30-20/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos de la aplicación
├── js/
│   └── app.js          # Lógica de la aplicación
└── assets/
    └── README.md       # Este archivo
```

## 🔧 Instalación y uso

1. **Descarga** todos los archivos
2. **Abre** `index.html` en tu navegador
3. **Introduce** tu salario mensual neto
4. **¡Comienza** a gestionar tu presupuesto!

## 💡 Cómo funciona

### Configuración inicial
- Al abrir la aplicación por primera vez, se te pedirá tu salario mensual
- El sistema calculará automáticamente:
  - Necesidades: 50% del salario
  - Deseos: 30% del salario
  - Ahorro: 20% del salario

### Añadir gastos
- Selecciona la categoría del gasto
- Introduce el monto
- Si el gasto excede lo disponible en la categoría, se cubrirá con el ahorro

### Fin de mes
- El botón "Mes terminado" te permite:
  - Ver un resumen de sobrantes
  - Transferir sobrantes de Necesidades y Deseos al Ahorro
  - Reiniciar las categorías para el nuevo mes
  - Limpiar el historial de transacciones

### Reiniciar plan
- Puedes borrar todos los datos y empezar de nuevo
- Útil para cambios de salario o nueva configuración

## 🎨 Personalización

El archivo `styles.css` utiliza variables CSS que puedes modificar fácilmente:

```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    /* ... más variables */
}
```

## 🔒 Privacidad

- **Todos los datos se almacenan localmente** en tu navegador
- **No se envía información** a ningún servidor
- **Funciona completamente offline**

## 💾 Almacenamiento

Los datos se guardan en `localStorage` con la estructura:

```javascript
{
    salario: 3000,
    bloques: {
        necesidades: 1500,
        deseos: 900,
        ahorro: 600
    },
    transacciones: [
        {
            fecha: "2025-01-15T10:30:00.000Z",
            categoria: "necesidades",
            monto: 800
        }
    ]
}
```

## 🛠️ Tecnologías utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **JavaScript ES6+** - Lógica de la aplicación
- **localStorage** - Persistencia de datos

## 🎯 Consejos de uso

1. **Sé realista** con tu salario neto (después de impuestos)
2. **Categoriza bien** tus gastos para un seguimiento efectivo
3. **Revisa regularmente** tu progreso durante el mes
4. **Usa "Mes terminado"** solo cuando realmente termine el mes
5. **Mantén disciplina** con la regla 50-30-20

## 📈 Beneficios de la regla 50-30-20

- **Simplicidad**: Fácil de seguir y entender
- **Flexibilidad**: Permite gastos en deseos sin culpa
- **Ahorro garantizado**: Asegura que siempre ahorres el 20%
- **Balance**: Equilibra necesidades, deseos y futuro

¡Disfruta gestionando tu presupuesto con disciplina financiera! 💰🚀