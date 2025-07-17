// Aplicación Mi Plan 50-30-20
class Plan502030 {
    constructor() {
        this.storageKey = 'plan502030';
        this.plan = this.loadFromStorage();
        this.init();
    }

    // Inicialización de la aplicación
    init() {
        this.bindEvents();
        
        if (!this.plan) {
            this.showSalaryModal();
        } else {
            this.renderUI();
        }
    }

    // Vinculación de eventos
    bindEvents() {
        // Formulario de salario
        document.getElementById('salary-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPlan();
        });

        // Formulario de gastos
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Botón mes terminado
        document.getElementById('end-month-btn').addEventListener('click', () => {
            this.endMonth();
        });

        // Botón reiniciar plan
        document.getElementById('reset-plan-btn').addEventListener('click', () => {
            this.resetPlan();
        });

        // Cerrar notificación
        document.getElementById('notification-close').addEventListener('click', () => {
            this.hideNotification();
        });
    }

    // Cargar datos desde localStorage
    loadFromStorage() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    // Guardar datos en localStorage
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.plan));
    }

    // Mostrar modal de salario
    showSalaryModal() {
        document.getElementById('salary-modal').classList.remove('hidden');
    }

    // Ocultar modal de salario
    hideSalaryModal() {
        document.getElementById('salary-modal').classList.add('hidden');
    }

    // Crear plan inicial
    createPlan() {
        const salaryInput = document.getElementById('salary-input');
        const salary = parseFloat(salaryInput.value);

        if (salary <= 0) {
            this.showNotification('Por favor, introduce un salario válido', 'error');
            return;
        }

        this.plan = {
            salario: salary,
            bloques: {
                necesidades: salary * 0.5,
                deseos: salary * 0.3,
                ahorro: salary * 0.2
            },
            transacciones: []
        };

        this.saveToStorage();
        this.hideSalaryModal();
        this.renderUI();
        this.showNotification('¡Plan creado con éxito! 🎉', 'success');
    }

    // Renderizar interfaz de usuario
    renderUI() {
        this.updateBudgetCards();
        this.updateTransactionsList();
    }

    // Actualizar tarjetas de presupuesto
    updateBudgetCards() {
        document.getElementById('necesidades-amount').textContent = 
            this.formatCurrency(this.plan.bloques.necesidades);
        document.getElementById('deseos-amount').textContent = 
            this.formatCurrency(this.plan.bloques.deseos);
        document.getElementById('ahorro-amount').textContent = 
            this.formatCurrency(this.plan.bloques.ahorro);
    }

    // Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    // Añadir gasto
    addExpense() {
        const categoria = document.getElementById('categoria').value;
        const monto = parseFloat(document.getElementById('monto').value);

        // Validaciones
        if (!categoria) {
            this.showNotification('Por favor, selecciona una categoría', 'error');
            return;
        }

        if (monto <= 0) {
            this.showNotification('El monto debe ser mayor que 0', 'error');
            return;
        }

        // Lógica de gastos
        if (monto > this.plan.bloques[categoria]) {
            // Si el gasto es mayor que el disponible en la categoría,
            // lo cubrimos con ahorro
            const diferencia = monto - this.plan.bloques[categoria];
            this.plan.bloques[categoria] = 0;
            this.plan.bloques.ahorro -= diferencia;

            if (this.plan.bloques.ahorro < 0) {
                this.showNotification('⚠️ Se ha consumido tu colchón de ahorro', 'warning');
            }
        } else {
            this.plan.bloques[categoria] -= monto;
        }

        // Añadir transacción
        this.plan.transacciones.push({
            fecha: new Date().toISOString(),
            categoria: categoria,
            monto: monto
        });

        this.saveToStorage();
        this.renderUI();
        this.clearExpenseForm();
        this.showNotification(`Gasto de ${this.formatCurrency(monto)} añadido a ${categoria}`, 'success');
    }

    // Limpiar formulario de gastos
    clearExpenseForm() {
        document.getElementById('categoria').value = '';
        document.getElementById('monto').value = '';
    }

    // Actualizar lista de transacciones
    updateTransactionsList() {
        const container = document.getElementById('transactions-list');
        
        if (this.plan.transacciones.length === 0) {
            container.innerHTML = '<div class="empty-transactions">No hay transacciones este mes</div>';
            return;
        }

        // Ordenar transacciones por fecha (más recientes primero)
        const sortedTransactions = [...this.plan.transacciones].sort((a, b) => 
            new Date(b.fecha) - new Date(a.fecha)
        );

        container.innerHTML = sortedTransactions.map(transaction => {
            const fecha = new Date(transaction.fecha);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const categoryEmoji = {
                necesidades: '🏠',
                deseos: '🎯',
                ahorro: '💎'
            };

            return `
                <div class="transaction-item ${transaction.categoria}">
                    <div class="transaction-info">
                        <div class="transaction-category">
                            ${categoryEmoji[transaction.categoria]} ${this.capitalize(transaction.categoria)}
                        </div>
                        <div class="transaction-date">${fechaFormateada}</div>
                    </div>
                    <div class="transaction-amount">-${this.formatCurrency(transaction.monto)}</div>
                </div>
            `;
        }).join('');
    }

    // Capitalizar primera letra
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Terminar mes
    endMonth() {
        const sobranteN = this.plan.bloques.necesidades;
        const sobranteD = this.plan.bloques.deseos;
        const totalSobrante = sobranteN + sobranteD;

        // Mostrar resumen
        let mensaje = `Mes terminado! 📅\n\n`;
        if (totalSobrante > 0) {
            mensaje += `Sobraron:\n`;
            mensaje += `• Necesidades: ${this.formatCurrency(sobranteN)}\n`;
            mensaje += `• Deseos: ${this.formatCurrency(sobranteD)}\n`;
            mensaje += `• Total añadido a Ahorro: ${this.formatCurrency(totalSobrante)}`;
        } else {
            mensaje += `No quedaron sobrantes este mes.`;
        }

        if (confirm(mensaje + '\n\n¿Confirmas que quieres terminar el mes?')) {
            // Sumar sobrantes a ahorro
            this.plan.bloques.ahorro += totalSobrante;

            // Resetear bloques
            this.plan.bloques.necesidades = this.plan.salario * 0.5;
            this.plan.bloques.deseos = this.plan.salario * 0.3;

            // Limpiar transacciones
            this.plan.transacciones = [];

            this.saveToStorage();
            this.renderUI();
            this.showNotification('¡Mes terminado! Nuevo mes iniciado 🚀', 'success');
        }
    }

    // Reiniciar plan
    resetPlan() {
        if (confirm('¿Estás seguro de que quieres reiniciar completamente tu plan? Esta acción no se puede deshacer.')) {
            localStorage.removeItem(this.storageKey);
            this.plan = null;
            this.showSalaryModal();
            this.showNotification('Plan reiniciado', 'success');
        }
    }

    // Mostrar notificación
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        notificationText.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    // Ocultar notificación
    hideNotification() {
        document.getElementById('notification').classList.add('hidden');
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Plan502030();
});

// Funciones de utilidad adicionales
window.addEventListener('beforeunload', (e) => {
    // Advertir al usuario si hay cambios sin guardar
    // En este caso, todo se guarda automáticamente en localStorage
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
});

// Soporte para instalación como PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Aquí podrías registrar un service worker si quisieras
        // hacer la app installable como PWA
    });
}