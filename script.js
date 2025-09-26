// ===================================
// GESTIÓN DE ESTADO (Variables Globales)
// ===================================

let juego = {
    dinero: 0, 
    ingresoPorClic: 1, 
    ingresoPorSegundo: 0, 
    // Los generadores inician con un factor de aumento de costo del 15% (1.15)
    generadores: [
        { id: 'trabajador', nombre: "Trabajador 👨‍💼", costo: 15, produccion: 0.1, cantidad: 0, factor: 1.15 },
        { id: 'cajero', nombre: "Máquina de Cajero 🏧", costo: 100, produccion: 1, cantidad: 0, factor: 1.15 },
        { id: 'fabrica', nombre: "Fábrica de Dinero 🏭", costo: 1000, produccion: 8, cantidad: 0, factor: 1.15 },
        { id: 'banco', nombre: "Banco Digital 🏦", costo: 15000, produccion: 40, cantidad: 0, factor: 1.15 },
        { id: 'inversion', nombre: "Fondo de Inversión 📈", costo: 100000, produccion: 100, cantidad: 0, factor: 1.15 }
    ]
};

// Referencias a los elementos del DOM (la interfaz)
const DINE = document.getElementById('dinero-actual');
const IPS = document.getElementById('ips-actual');
const TIENDA = document.getElementById('generadores-tienda');
const BILLETE_BTN = document.getElementById('billete-btn');


// ===================================
// FUNCIONES DE JUEGO
// ===================================

function hacerClic() {
    // 1. Aumenta el dinero
    juego.dinero += juego.ingresoPorClic; 
    
    // 2. Muestra animación de +$ al hacer clic (Opcional, pero genial)
    crearAnimacionClic(juego.ingresoPorClic);

    // 3. Actualiza la vista y guarda
    actualizarInterfaz();
    guardarJuego();
}

function comprarGenerador(indice) {
    let generador = juego.generadores[indice];
    
    if (juego.dinero >= generador.costo) {
        // 1. Deducir costo y actualizar cantidad
        juego.dinero -= generador.costo;
        generador.cantidad++;
        
        // 2. Aumentar el ingreso por segundo (IPS)
        juego.ingresoPorSegundo += generador.produccion;
        
        // 3. Aumentar el costo para la próxima compra 
        // Math.ceil asegura que el costo sea un número entero
        generador.costo = Math.ceil(generador.costo * generador.factor); 
        
        // 4. Actualizar toda la interfaz y guardar
        actualizarInterfaz();
        // Redibujar la tienda es clave para actualizar los botones (habilitar/deshabilitar)
        dibujarTienda(); 
        guardarJuego();
        
    } else {
        // Alerta visual de dinero insuficiente
        BILLETE_BTN.style.borderColor = 'red';
        setTimeout(() => {
             BILLETE_BTN.style.borderColor = '#2e7d32'; // Vuelve al color original
        }, 150);
        
    }
}

// ===================================
// DIBUJO, ANIMACIÓN Y BUCLE
// ===================================

function dibujarTienda() {
    TIENDA.innerHTML = ''; // Limpia el contenido antes de redibujar
    
    juego.generadores.forEach((g, index) => {
        const div = document.createElement('div');
        div.className = 'generador-item';
        const puedeComprar = juego.dinero >= g.costo;
        
        div.innerHTML = `
            <p><strong>${g.nombre}</strong></p>
            <p>Costo: $${Math.floor(g.costo).toLocaleString()}</p>
            <p>Produce: ${g.produccion} IPS</p>
            <p>Tienes: ${g.cantidad}</p>
            <button 
                onclick="comprarGenerador(${index})" 
                ${!puedeComprar ? 'disabled' : ''}
                class="${puedeComprar ? 'btn-comprar' : 'btn-bloqueado'}"
            >
                Comprar
            </button>
        `;
        TIENDA.appendChild(div);
    });
}

function actualizarInterfaz() {
    // toLocaleString() para formato de miles (p. ej., 1,000,000)
    // toFixed(2) para mostrar dos decimales en el dinero
    DINE.textContent = juego.dinero.toFixed(2).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    // toFixed(1) para mostrar un decimal en el IPS
    IPS.textContent = juego.ingresoPorSegundo.toFixed(1);
    
    // Se llama a dibujarTienda aquí para que los botones se habiliten o deshabiliten
    // cada vez que el dinero o el estado del juego cambian.
    dibujarTienda(); 
}

// Bucle de Juego (Genera dinero automáticamente)
function bucleDeJuego() {
    // Suma el ingreso por segundo. Se ejecuta cada 100 milisegundos para suavizar la animación.
    // Dividimos IPS entre 10 porque lo ejecutamos 10 veces por segundo (1000ms / 100ms)
    juego.dinero += juego.ingresoPorSegundo / 10; 
    
    // Guardamos el juego cada 5 segundos (50 * 100ms)
    if (bucleContador % 50 === 0) {
        guardarJuego();
    }
    
    actualizarInterfaz();
    bucleContador++;
}

// ===================================
// ANIMACIÓN DE CLIC (El "Wow Factor")
// ===================================

function crearAnimacionClic(monto) {
    const animacion = document.createElement('span');
    animacion.textContent = `+$${monto}`;
    animacion.classList.add('animacion-clic');
    
    // Posiciona la animación donde está el botón
    const rect = BILLETE_BTN.getBoundingClientRect();
    animacion.style.left = `${rect.left + rect.width / 2}px`;
    animacion.style.top = `${rect.top + rect.height / 2}px`;

    document.body.appendChild(animacion);

    // Eliminar el elemento después de la animación para limpiar el DOM
    animacion.addEventListener('animationend', () => {
        animacion.remove();
    });
}

// Puedes añadir este CSS a tu style.css para la animación:
/*
@keyframes floatAndFade {
    0% { transform: translate(-50%, 0); opacity: 1; }
    100% { transform: translate(-50%, -50px); opacity: 0; }
}

.animacion-clic {
    position: absolute;
    font-size: 1.5em;
    font-weight: bold;
    color: #ffd700; 
    pointer-events: none;
    animation: floatAndFade 0.8s ease-out;
    z-index: 1000;
}
*/


// ===================================
// PERSISTENCIA DE DATOS (localStorage)
// ===================================
let bucleContador = 0; // Contador para el guardado periódico

function guardarJuego() {
    // Guarda el objeto 'juego' completo en el almacenamiento local
    localStorage.setItem('millonarioClicker', JSON.stringify(juego));
}

function cargarJuego() {
    const datosGuardados = localStorage.getItem('millonarioClicker');
    if (datosGuardados) {
        const savedJuego = JSON.parse(datosGuardados);

        // Actualizamos los datos principales
        juego.dinero = savedJuego.dinero || 0;
        juego.ingresoPorClic = savedJuego.ingresoPorClic || 1;
        juego.ingresoPorSegundo = savedJuego.ingresoPorSegundo || 0;

        // Se cargan los generadores, asegurando que se mantenga la estructura original
        // Esto es importante si añades nuevos generadores en futuras versiones
        savedJuego.generadores.forEach((savedGen, index) => {
            if (juego.generadores[index]) {
                juego.generadores[index].costo = savedGen.costo;
                juego.generadores[index].cantidad = savedGen.cantidad;
            }
        });
    }
    
    // Inicia el bucle de juego al cargar la página
    setInterval(bucleDeJuego, 100); 
    actualizarInterfaz();
}

// Llama a la función de carga al iniciar el script para empezar el juego
cargarJuego();
