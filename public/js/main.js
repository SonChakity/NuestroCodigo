// Validaciones de formularios y funcionamiento de modales

// Función genérica para validar email
function validarCorreo(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Ejemplo: validación básica para el formulario de contacto general
const formGeneral = document.getElementById('form-general');
if (formGeneral) {
  formGeneral.addEventListener('submit', (e) => {
    const emailInput = document.getElementById('email-general');
    if (!validarCorreo(emailInput.value)) {
      e.preventDefault();
      alert('Por favor, ingresa un correo válido.');
      emailInput.focus();
    }
  });
}

// Modal de contratación en tarifas
const btnBasico = document.getElementById('btn-contratar-basico');
const btnAvanzado = document.getElementById('btn-contratar-avanzado');
const btnEmpresarial = document.getElementById('btn-contratar-empresarial');
const modal = document.getElementById('modal-contratar');
const inputPlan = document.getElementById('input-plan');
const modalTitulo = document.getElementById('modal-titulo');
const modalCerrar = document.getElementById('modal-cerrar');

function abrirModal(plan) {
  inputPlan.value = plan;
  modalTitulo.textContent = `Contratar Plan ${plan}`;
  modal.classList.remove('hidden');
}

function cerrarModal() {
  modal.classList.add('hidden');
}

if (btnBasico) btnBasico.addEventListener('click', () => abrirModal('Básico'));
if (btnAvanzado) btnAvanzado.addEventListener('click', () => abrirModal('Avanzado'));
if (btnEmpresarial) btnEmpresarial.addEventListener('click', () => abrirModal('Empresarial'));
if (modalCerrar) modalCerrar.addEventListener('click', cerrarModal);

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === modal) cerrarModal();
});
