// ===================================
// GESTIÓN DE ESTADO (Variables Globales)
// ===================================

let juego = {
    dinero: 0, 
    ingresoPorClic: 1, 
    ingresoPorSegundo: 0, 
    // Mantiene el índice de la próxima mejora de clic que se puede comprar
    siguienteMejoraClicIndex: 0, 
    
    // 20 Mejoras de Clic con progresión exponencial. Son compras ÚNICAS y ordenadas.
    mejorasClic: [
        { nombre: "Dedo Entrenado 👆", costo: 10, multiplicador: 2, desc: "IPC x2. El inicio de la fortuna." },
        { nombre: "Clic Rápido ⚡", costo: 50, multiplicador: 2, desc: "IPC x2. Tus reflejos mejoran." },
        { nombre: "Mouse Óptico Básico", costo: 150, multiplicador: 2, desc: "IPC x2. Un ratón más preciso." },
        { nombre: "Doble Clic ✌️", costo: 400, multiplicador: 2, desc: "IPC x2. Ahora clicas dos veces por golpe." },
        { nombre: "Ratón Ergonómico 🖱️", costo: 1000, multiplicador: 3, desc: "IPC x3. Comodidad = Velocidad." },
        { nombre: "Auto-Clic Programado", costo: 3500, multiplicador: 3, desc: "IPC x3. Tu software te ayuda." },
        { nombre: "Mouse Gamer RGB", costo: 10000, multiplicador: 4, desc: "IPC x4. Estilo y rendimiento." },
        { nombre: "Conexión de Fibra", costo: 25000, multiplicador: 4, desc: "IPC x4. Clics instantáneos." },
        { nombre: "Dedo Biónico 🦾", costo: 60000, multiplicador: 5, desc: "IPC x5. Mejora robótica." },
        { nombre: "Clic Cuántico", costo: 150000, multiplicador: 5, desc: "IPC x5. Aprovecha el espacio-tiempo." },
        { nombre: "Hiper-Clic V.1", costo: 400000, multiplicador: 6, desc: "IPC x6. Entras en la liga mayor." },
        { nombre: "Motor de Clic Silencioso", costo: 1000000, multiplicador: 6, desc: "IPC x6. La eficiencia es invisible." },
        { nombre: "Clicker IA", costo: 3000000, multiplicador: 7, desc: "IPC x7. Inteligencia Artificial clica por ti." },
        { nombre: "Procesador Neural", costo: 8000000, multiplicador: 7, desc: "IPC x7. Clics pensados antes de ocurrir." },
        { nombre: "Fusión de Materia", costo: 20000000, multiplicador: 8, desc: "IPC x8. Cada clic genera energía." },
        { nombre: "Telequinesis", costo: 50000000, multiplicador: 8, desc: "IPC x8. ¡Ni siquiera necesitas el mouse!" },
        { nombre: "Generador de Clics Infinitos", costo: 150000000, multiplicador: 9, desc: "IPC x9. Desafía la ley de la física." },
        { nombre: "Singularidad Clic", costo: 500000000, multiplicador: 9, desc: "IPC x9. Creas un mini-agujero negro de dinero." },
        { nombre: "Omnipresencia", costo: 1500000000, multiplicador: 10, desc: "IPC x10. Existes en cada clic posible." },
        { nombre: "El Big Bang del Clic 💥", costo: 5000000000, multiplicador: 10, desc: "IPC x10. El último nivel: ¡Origen de todo el dinero!" }
    ],

    // Lista de Generadores de Dinero (Ingreso Pasivo) - Se mantienen igual
    generadores: [
        { id: 'trabajador', nombre: "Trabajador 👨‍💼", costo: 15, produccion: 0.1, cantidad: 0, factor: 1.15, desc: "Genera dinero básico." },
        { id: 'cajero', nombre: "Máquina de Cajero 🏧", costo: 100, produccion: 1, cantidad: 0, factor: 1.15, desc: "Una fuente constante de flujo." },
        { id: 'fabrica', nombre: "Fábrica de Dinero 🏭", costo: 1000, produccion: 8, cantidad: 0, factor: 1.15, desc: "Grandes cantidades de papel moneda." },
        { id: 'banco', nombre: "Banco Digital 🏦", costo: 15000, produccion: 40, cantidad: 0, factor: 1.15, desc: "Controla las finanzas." },
        { id: 'inversion', nombre: "Fondo de Inversión 📈", costo: 100000, produccion: 100, cantidad: 0, factor: 1.15, desc: "El dinero trabaja por ti." },
        { id: 'multinacional', nombre: "Multinacional Global 🌍", costo: 1500000, produccion: 1000, cantidad: 0, factor: 1.15, desc: "Dominio total del mercado." }
    ]
};

// Referencias a los elementos del DOM
const DINE = document.getElementById('dinero-actual');
const IPS = document.getElementById('ips-actual');
const TIENDA_CLIC = document.getElementById('mejoras-clic-tienda');
const TIENDA_GENERADORES = document.getElementById('generadores-tienda');
const BILLETE_BTN = document.getElementById('billete-btn');

// ===================================
// FUNCIONES DE COMPRA Y LÓGICA
// ===================================

function hacerClic() {
    // La función crearAnimacionClic está en el HTML, definida al final del body
    crearAnimacionClic(juego.ingresoPorClic);
    juego.dinero += juego.ingresoPorClic; 
    actualizarInterfaz();
    guardarJuego();
}

// LOGICA DE PROGRESIÓN ESTRICTA PARA MEJORAS DE CLIC
function comprarMejoraClic(index) {
    if (index !== juego.siguienteMejoraClicIndex) {
        // Bloquea la compra si no es el siguiente índice (Gating)
        return; 
    }

    let mejora = juego.mejorasClic[index];
    
    if (juego.dinero >= mejora.costo) {
        juego.dinero -= mejora.costo;
        
        // Aplica el multiplicador a la ganancia base actual
        juego.ingresoPorClic *= mejora.multiplicador; 
        
        // Marca esta mejora como comprada (cantidad=1 indica comprado)
        mejora.cantidad = 1; 
        
        // Avanza al siguiente nivel/mejora
        juego.siguienteMejoraClicIndex++;
        
        // Asegura que IPC se vea limpio
        juego.ingresoPorClic = parseFloat(juego.ingresoPorClic.toFixed(2));
        
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
        
        // Aumenta el costo del siguiente nivel/generador
        generador.costo = Math.ceil(generador.costo * generador.factor); 
        
        // Ajuste decimal para IPS
        juego.ingresoPorSegundo = parseFloat(juego.ingresoPorSegundo.toFixed(2));
        
        actualizarInterfaz();
        guardarJuego();
    }
}


// ===================================
// DIBUJO Y BUCLE
// ===================================

function formatDinero(monto) {
    // Formato de moneda, usando $
    const formatter = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(monto).replace('US$', '$').replace('€', '$').trim();
}

function dibujarTienda(contenedor, items, funcionComprar) {
    contenedor.innerHTML = ''; 
    
    items.forEach((item, index) => {
        
        const isGatedUpgrade = (contenedor.id === 'mejoras-clic-tienda');
        const isNextClickUpgrade = (isGatedUpgrade && index === juego.siguienteMejoraClicIndex);
        const puedeComprar = juego.dinero >= item.costo;
        
        // Lógica de estado para la interfaz:
        let itemStatusClass = '';
        let buttonText = 'Comprar';
        let isDisabled = !puedeComprar;
        
        // --- Lógica para Mejoras de Clic (Gated) ---
        if (isGatedUpgrade) {
            // 1. Si ya se compró
            if (item.cantidad === 1) { 
                itemStatusClass = 'item-comprado';
                buttonText = 'Comprado';
                isDisabled = true;
            } 
            // 2. Si no es la mejora que toca (está más adelante)
            else if (index > juego.siguienteMejoraClicIndex) {
                 itemStatusClass = 'item-bloqueado';
                 buttonText = 'Bloqueado';
                 isDisabled = true;
            }
            // 3. Si es la que toca pero no tiene dinero
            else if (isNextClickUpgrade && !puedeComprar) {
                itemStatusClass = 'item-bloqueado';
            }
        }
        // --- Lógica para Generadores (No Gated) ---
        else if (!isGatedUpgrade && !puedeComprar) {
            itemStatusClass = 'item-bloqueado';
        }
        
        // Si es una mejora de clic y ya está comprada, o es la siguiente que se va a comprar, la mostramos.
        // Si es un generador, mostramos todos.
        if (isGatedUpgrade && index > juego.siguienteMejoraClicIndex + 1) {
            // Esto oculta las mejoras que están muy por delante, mostrando solo las relevantes
            return; 
        }

        const div = document.createElement('div');
        div.className = `tienda-item ${itemStatusClass}`; 
        
        // Muestra la producción o el efecto de la mejora
        const efecto = item.produccion 
            ? `${item.produccion.toFixed(1)} IPS` 
            : `IPC x${item.multiplicador}`;

        // Para las mejoras de clic, mostramos el progreso (ej. 1/20)
        const progreso = isGatedUpgrade && item.cantidad === 1 ? ` (${index + 1}/${juego.mejorasClic.length})` : '';
        const cantidadDisplay = !isGatedUpgrade ? `<p>Tienes: ${item.cantidad}</p>` : '';


        div.innerHTML = `
            <p><strong>${item.nombre}${progreso}</strong></p>
            <p style="font-size:0.85em; opacity:0.8;">${item.desc}</p>
            <p>Costo: ${formatDinero(item.costo)}</p>
            <p>Efecto: ${efecto}</p>
            ${cantidadDisplay}
            <button 
                onclick="${funcionComprar}(${index})" 
                ${isDisabled ? 'disabled' : ''}
                class="${isDisabled ? 'btn-bloqueado' : 'btn-comprar'}"
            >
                ${buttonText}
            </button>
        `;
        contenedor.appendChild(div);
    });
}

function actualizarInterfaz() {
    DINE.textContent = formatDinero(juego.dinero);
    IPS.textContent = juego.ingresoPorSegundo.toFixed(1);
    document.getElementById('ipc-actual').textContent = formatDinero(juego.ingresoPorClic);

    // Dibuja las dos secciones de la tienda
    dibujarTienda(TIENDA_CLIC, juego.mejorasClic, 'comprarMejoraClic');
    dibujarTienda(TIENDA_GENERADORES, juego.generadores, 'comprarGenerador');
}

// Bucle de Juego
let bucleContador = 0;
function bucleDeJuego() {
    // Gana dinero pasivo
    juego.dinero += juego.ingresoPorSegundo / 10; 
    
    // Guarda el juego cada 5 segundos
    if (bucleContador % 50 === 0) {
        guardarJuego();
    }
    
    actualizarInterfaz();
    bucleContador++;
}

// Lógica de Persistencia y Carga (LocalStorage)
function guardarJuego() {
    localStorage.setItem('millonarioClicker', JSON.stringify(juego));
}

function cargarJuego() {
    const datosGuardados = localStorage.getItem('millonarioClicker');
    if (datosGuardados) {
        const savedJuego = JSON.parse(datosGuardados);

        // Cargamos los valores base
        juego.dinero = savedJuego.dinero || 0;
        // El IPC debe recalcularse, así que lo reiniciamos a 1
        juego.ingresoPorClic = 1; 
        juego.ingresoPorSegundo = savedJuego.ingresoPorSegundo || 0;
        juego.siguienteMejoraClicIndex = savedJuego.siguienteMejoraClicIndex || 0;
        
        // Carga de Generadores (solo costos y cantidad)
        const loadItems = (savedList, currentList) => {
            savedList.forEach((savedItem, index) => {
                if (currentList[index]) {
                    currentList[index].costo = savedItem.costo || currentList[index].costo;
                    currentList[index].cantidad = savedItem.cantidad || 0;
                }
            });
        };
        
        // Carga y recalcula el IPC total de las mejoras compradas
        if(savedJuego.mejorasClic) {
             loadItems(savedJuego.mejorasClic, juego.mejorasClic);
             juego.mejorasClic.forEach(item => {
                if (item.cantidad === 1) {
                    juego.ingresoPorClic *= item.multiplicador;
                }
             });
             juego.ingresoPorClic = parseFloat(juego.ingresoPorClic.toFixed(2));
        }

        loadItems(savedJuego.generadores || [], juego.generadores);
    }
    
    // Inicia el bucle de juego
    setInterval(bucleDeJuego, 100); 
    actualizarInterfaz();
}

// Llama a la función de carga al iniciar el script
cargarJuego();
