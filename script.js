// ===================================
// GESTIÓN DE ESTADO (Variables Globales)
// ===================================

let juego = {
    dinero: 0, 
    ingresoPorClic: 1, 
    ingresoPorSegundo: 0, 
    
    // Nueva lista de Mejoras de Clic (Mouse)
    mejorasClic: [
        { nombre: "Ratón Ergonómico 🖱️", costo: 50, factor: 2, cantidad: 0, multiplicador: 1.5 },
        { nombre: "Clic Automático Básico", costo: 500, factor: 5, cantidad: 0, multiplicador: 2 },
        { nombre: "Mouse Gamer RGB Pro", costo: 5000, factor: 10, cantidad: 0, multiplicador: 3 }
        // Añade más aquí
    ],

    // Lista de Generadores de Dinero (Ingreso Pasivo)
    generadores: [
        { id: 'trabajador', nombre: "Trabajador 👨‍💼", costo: 15, produccion: 0.1, cantidad: 0, factor: 1.15 },
        { id: 'cajero', nombre: "Máquina de Cajero 🏧", costo: 100, produccion: 1, cantidad: 0, factor: 1.15 },
        { id: 'fabrica', nombre: "Fábrica de Dinero 🏭", costo: 1000, produccion: 8, cantidad: 0, factor: 1.15 },
        { id: 'banco', nombre: "Banco Digital 🏦", costo: 15000, produccion: 40, cantidad: 0, factor: 1.15 },
        { id: 'inversion', nombre: "Fondo de Inversión 📈", costo: 100000, produccion: 100, cantidad: 0, factor: 1.15 },
        { id: 'multinacional', nombre: "Multinacional Global 🌍", costo: 1500000, produccion: 1000, cantidad: 0, factor: 1.15 }
    ]
};

// Referencias a los elementos del DOM
const DINE = document.getElementById('dinero-actual');
const IPS = document.getElementById('ips-actual');
const TIENDA_CLIC = document.getElementById('mejoras-clic-tienda'); // Nuevo ID
const TIENDA_GENERADORES = document.getElementById('generadores-tienda');
const BILLETE_BTN = document.getElementById('billete-btn');


// ===================================
// FUNCIONES DE COMPRA Y LÓGICA
// ===================================

function hacerClic() {
    juego.dinero += juego.ingresoPorClic; 
    crearAnimacionClic(juego.ingresoPorClic);
    actualizarInterfaz();
    guardarJuego();
}

function comprarMejoraClic(indice) {
    let mejora = juego.mejorasClic[indice];
    
    if (juego.dinero >= mejora.costo) {
        juego.dinero -= mejora.costo;
        mejora.cantidad++;
        
        // El ingreso por clic se multiplica por el factor de la mejora
        juego.ingresoPorClic *= mejora.multiplicador; 
        
        // Aumenta el costo del siguiente nivel/mejora
        mejora.costo = Math.ceil(mejora.costo * mejora.factor); 
        
        actualizarInterfaz();
        guardarJuego();
    }
}

function comprarGenerador(indice) {
    let generador = juego.generadores[indice];
    
    if (juego.dinero >= generador.costo) {
        juego.dinero -= generador.costo;
        generador.cantidad++;
        juego.ingresoPorSegundo += generador.produccion;
        generador.costo = Math.ceil(generador.costo * generador.factor); 
        
        actualizarInterfaz();
        guardarJuego();
        
    } else {
        // Alerta visual de dinero insuficiente
        console.warn("Dinero insuficiente para comprar: " + generador.nombre);
    }
}


// ===================================
// DIBUJO Y BUCLE
// ===================================

// Función genérica para dar formato al dinero
function formatDinero(monto) {
    const formatter = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    // Quitamos el símbolo de dólar para mantener el emoji $
    return formatter.format(monto).replace('US$', '$').trim();
}

function dibujarTienda(contenedor, items, funcionComprar) {
    contenedor.innerHTML = ''; 
    
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'tienda-item'; // Clase unificada
        const puedeComprar = juego.dinero >= item.costo;
        
        // Muestra la producción o el efecto de la mejora
        const efecto = item.produccion ? `${item.produccion} IPS` : `x${item.multiplicador} Clic`;

        div.innerHTML = `
            <p><strong>${item.nombre}</strong></p>
            <p>Costo: ${formatDinero(item.costo)}</p>
            <p>Efecto: ${efecto}</p>
            <p>Tienes: ${item.cantidad}</p>
            <button 
                onclick="${funcionComprar}(${index})" 
                ${!puedeComprar ? 'disabled' : ''}
                class="${puedeComprar ? 'btn-comprar' : 'btn-bloqueado'}"
            >
                Comprar
            </button>
        `;
        contenedor.appendChild(div);
    });
}

function actualizarInterfaz() {
    // Actualiza el contador de dinero con formato
    DINE.textContent = formatDinero(juego.dinero);
    
    // Actualiza el IPS (Ingreso por Segundo)
    IPS.textContent = juego.ingresoPorSegundo.toFixed(1);
    
    // Actualiza el Ingreso por Clic
    document.getElementById('ipc-actual').textContent = formatDinero(juego.ingresoPorClic);

    // Dibuja las dos secciones de la tienda
    dibujarTienda(TIENDA_CLIC, juego.mejorasClic, 'comprarMejoraClic');
    dibujarTienda(TIENDA_GENERADORES, juego.generadores, 'comprarGenerador');
}

// Bucle de Juego (Genera dinero automáticamente)
let bucleContador = 0;
function bucleDeJuego() {
    juego.dinero += juego.ingresoPorSegundo / 10; 
    
    // Guardamos el juego cada 5 segundos (50 * 100ms)
    if (bucleContador % 50 === 0) {
        guardarJuego();
    }
    
    actualizarInterfaz();
    bucleContador++;
}

// Lógica de Persistencia y Carga
function guardarJuego() {
    localStorage.setItem('millonarioClicker', JSON.stringify(juego));
}

function cargarJuego() {
    const datosGuardados = localStorage.getItem('millonarioClicker');
    if (datosGuardados) {
        const savedJuego = JSON.parse(datosGuardados);

        juego.dinero = savedJuego.dinero || 0;
        juego.ingresoPorClic = savedJuego.ingresoPorClic || 1;
        juego.ingresoPorSegundo = savedJuego.ingresoPorSegundo || 0;
        
        // Carga de Mejoras de Clic
        savedJuego.mejorasClic.forEach((savedItem, index) => {
            if (juego.mejorasClic[index]) {
                juego.mejorasClic[index].costo = savedItem.costo;
                juego.mejorasClic[index].cantidad = savedItem.cantidad;
            }
        });

        // Carga de Generadores Pasivos
        savedJuego.generadores.forEach((savedItem, index) => {
            if (juego.generadores[index]) {
                juego.generadores[index].costo = savedItem.costo;
                juego.generadores[index].cantidad = savedItem.cantidad;
            }
        });
    }
    
    setInterval(bucleDeJuego, 100); 
    actualizarInterfaz();
}

// Llama a la función de carga al iniciar el script
cargarJuego();
