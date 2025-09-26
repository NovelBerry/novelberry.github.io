/**
 * Lógica Principal del Juego Clicker (Millonario Clicker)
 * Incluye gestión de estado, bucle de juego, y lógica de compra.
 */

// =========================================================================
// 1. ESTADO GLOBAL DEL JUEGO
// =========================================================================

let estadoJuego = {
    dineroActual: 0,
    ipc: 1, // Ingreso Por Clic base
    ips: 0, // Ingreso Por Segundo
    conteoClicks: 0,
    totalGanado: 0,
    
    // Almacenamiento de las compras realizadas
    generadores: {}, // { 'generador_id': cantidad }
    mejoras: {},     // { 'mejora_id': true/false }
    propiedades: {}, // { 'propiedad_id': true/false }
    acciones: {},    // { 'accion_id': cantidad }
};

// Formateador de números para la moneda (USD/Latino)
const formatMoneda = new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

// =========================================================================
// 2. DEFINICIONES DE ITEMS DE LA TIENDA
// =========================================================================

// --- Mejoras de Clic (IPC - Ingreso Por Clic) ---
const ITEMS_IPC = [
    { id: 'mano_trabajadora', nombre: 'Mano Trabajadora', costo: 50, factor: 2, multiplicador_ipc: 1, gating: 0, descripcion: 'Duplica tu IPC base.' },
    { id: 'teclado_gamer', nombre: 'Teclado Mecánico', costo: 500, factor: 1.8, multiplicador_ipc: 2, gating: 1, descripcion: 'Triplica el IPC actual.' },
    { id: 'asistente_personal', nombre: 'Asistente Personal', costo: 5000, factor: 1.6, multiplicador_ipc: 5, gating: 2, descripcion: 'Multiplica el IPC por 5.' },
];

// --- Generadores Pasivos (IPS - Ingreso Por Segundo) ---
const ITEMS_IPS = [
    { id: 'puesto_limonada', nombre: 'Puesto de Limonada', costo: 100, ips_base: 0.1, factor: 1.15, gating: 0, descripcion: 'Genera $0.10 por segundo.' },
    { id: 'vendedor_ambulante', nombre: 'Vendedor Ambulante', costo: 1100, ips_base: 1, factor: 1.15, gating: 0, descripcion: 'Genera $1 por segundo.' },
    { id: 'tienda_online', nombre: 'Tienda Online', costo: 12000, ips_base: 8, factor: 1.15, gating: 0, descripcion: 'Genera $8 por segundo.' },
    { id: 'bienes_raices', nombre: 'Agencia de Bienes Raíces', costo: 150000, ips_base: 50, factor: 1.15, gating: 0, descripcion: 'Genera $50 por segundo.' },
];

// --- Activos y Lujos (Propiedades) ---
const ITEMS_ACTIVOS = [
    { id: 'auto_deportivo', nombre: 'Auto Deportivo 🏎️', costo: 1000000, tipo: 'vehiculo', descripcion: 'Lujo. Aumenta tu IPS en 100.' },
    { id: 'mansion_lujo', nombre: 'Mansión de Lujo 🏰', costo: 5000000, tipo: 'propiedad', descripcion: 'Lujo. Aumenta tu IPS en 500.' },
    { id: 'acciones_bluechip', nombre: 'Acciones Blue Chip 📊', costo: 100000, tipo: 'accion', ips_por_unidad: 5, descripcion: 'Unidad de Inversión Pasiva. Genera $5 IPS por unidad.' },
];


// =========================================================================
// 3. FUNCIONES CORE DEL JUEGO
// =========================================================================

/**
 * Clic principal: aumenta el dinero por IPC y actualiza el estado.
 */
function hacerClic() {
    // 1. Obtener IPC actual (se recalcula en cada clic)
    const ipc_actual = calcularIPC();
    
    // 2. Aumentar dinero
    estadoJuego.dineroActual += ipc_actual;
    estadoJuego.conteoClicks++;
    estadoJuego.totalGanado += ipc_actual;

    // 3. Crear animación flotante
    crearAnimacionClic(formatMoneda.format(ipc_actual));

    // 4. Actualizar UI y botones
    actualizarDisplay();
    // Esta es la función clave que arregla el bug de los botones
    actualizarBotones(); 
    guardarJuego();
}

/**
 * Maneja la compra de cualquier item (IPC, IPS, Activo).
 * @param {string} tipo - 'ipc', 'ips', 'propiedad', 'vehiculo', 'accion'
 * @param {string} id - ID del item
 */
function comprarItem(tipo, id) {
    let item;

    // 1. Buscar el item en el catálogo
    if (tipo === 'ipc' || tipo === 'ips') {
        const catalogo = (tipo === 'ipc') ? ITEMS_IPC : ITEMS_IPS;
        item = catalogo.find(i => i.id === id);
    } else { // Activos: propiedad, vehiculo, accion
        item = ITEMS_ACTIVOS.find(i => i.id === id);
    }

    if (!item) {
        console.error("Item no encontrado:", id);
        return;
    }

    // 2. Determinar el costo actual y el tipo de almacenamiento
    let costo;
    let almacenamiento;

    if (tipo === 'ipc' || tipo === 'ips') {
        // Generadores/Mejoras (Costo escalable)
        const cantidad = (tipo === 'ipc') ? (estadoJuego.mejoras[id] ? 1 : 0) : (estadoJuego.generadores[id] || 0);
        costo = item.costo * Math.pow(item.factor, cantidad);
        almacenamiento = (tipo === 'ipc') ? estadoJuego.mejoras : estadoJuego.generadores;
    } else {
        // Activos/Lujos (Costo fijo o escalable para acciones)
        costo = item.costo;
        almacenamiento = (item.tipo === 'accion') ? estadoJuego.acciones : estadoJuego.propiedades;
    }


    // 3. Validar compra
    if (estadoJuego.dineroActual < costo) {
        console.warn("Dinero insuficiente.");
        return;
    }

    // 4. Realizar la transacción
    estadoJuego.dineroActual -= costo;

    // 5. Actualizar la cantidad o estado de compra
    if (tipo === 'ipc') {
        almacenamiento[id] = true; // Mejora es binaria (comprada o no)
    } else if (tipo === 'ips') {
        almacenamiento[id] = (almacenamiento[id] || 0) + 1;
        item.costo = costo * item.factor; // Actualizar el costo del item en el catálogo (solo en memoria)
        dibujarTiendaIPS(); // Redibujar para mostrar nuevo costo
    } else if (item.tipo === 'accion') {
        almacenamiento[id] = (almacenamiento[id] || 0) + 1;
        // No hay redibujo de costo ya que se asume que se compra la misma unidad al mismo precio
    } else { // Propiedad/Vehículo (binario)
        almacenamiento[id] = true;
        // La propiedad comprada debe ser deshabilitada en la UI
    }
    
    // 6. Recalcular y actualizar
    recalcularIPS();
    actualizarDisplay();
    actualizarBotones(); // CLAVE: Vuelve a chequear todos los botones
    guardarJuego();

    // Si es una propiedad/lujo binario, forzamos el redibujo para desactivar su botón permanentemente
    if (item.tipo === 'propiedad' || item.tipo === 'vehiculo') {
        dibujarTiendaActivos();
    }
}


/**
 * Calcula el IPC actual (base + multiplicadores de mejoras).
 * @returns {number} IPC actual.
 */
function calcularIPC() {
    let ipc_base = 1;
    let ipc_multiplicador = 1;
    
    // Multiplicar por las mejoras IPC compradas
    ITEMS_IPC.forEach(item => {
        if (estadoJuego.mejoras[item.id]) {
            ipc_multiplicador *= item.multiplicador_ipc;
        }
    });

    return ipc_base * ipc_multiplicador;
}

/**
 * Recalcula el IPS total sumando todos los generadores y activos.
 */
function recalcularIPS() {
    let ips_total = 0;

    // Sumar IPS de Generadores (IPS escalables)
    ITEMS_IPS.forEach(item => {
        const cantidad = estadoJuego.generadores[item.id] || 0;
        ips_total += cantidad * item.ips_base;
    });

    // Sumar IPS de Activos (Lujos binarios)
    ITEMS_ACTIVOS.forEach(item => {
        if (item.tipo === 'vehiculo' && estadoJuego.propiedades[item.id]) {
            ips_total += 100; // Auto Deportivo
        } else if (item.tipo === 'propiedad' && estadoJuego.propiedades[item.id]) {
            ips_total += 500; // Mansión de Lujo
        }
    });

    // Sumar IPS de Acciones (Activos escalables)
    const acciones = ITEMS_ACTIVOS.find(i => i.id === 'acciones_bluechip');
    if (acciones) {
        const cantidad = estadoJuego.acciones[acciones.id] || 0;
        ips_total += cantidad * acciones.ips_por_unidad;
    }

    estadoJuego.ips = ips_total;
}

// =========================================================================
// 4. FUNCIONES DE UI Y RENDERIZADO
// =========================================================================

/**
 * Actualiza los elementos del display (dinero, IPC, IPS).
 */
function actualizarDisplay() {
    document.getElementById('dinero-actual').textContent = formatMoneda.format(estadoJuego.dineroActual);
    document.getElementById('ipc-actual').textContent = formatMoneda.format(calcularIPC());
    document.getElementById('ips-actual').textContent = formatMoneda.format(estadoJuego.ips);

    // Asegurar que el título de la vista de stats se actualiza si está visible
    if (document.getElementById('view-stats').classList.contains('active')) {
        dibujarEstadisticas();
    }
}

/**
 * Dibuja la tienda de Mejoras de Clic (IPC).
 */
function dibujarTiendaIPC() {
    const contenedor = document.getElementById('mejoras-clic-tienda');
    contenedor.innerHTML = ''; // Limpiar

    ITEMS_IPC.forEach(item => {
        const yaComprado = estadoJuego.mejoras[item.id];
        
        // El costo de las mejoras IPC es fijo (una vez compradas, ya no se muestran o se deshabilitan)
        const costo = item.costo; 

        if (yaComprado) return; // Si ya fue comprada, no se muestra

        const itemDiv = document.createElement('div');
        itemDiv.className = `tienda-item ${yaComprado ? 'item-comprado' : ''}`;
        itemDiv.setAttribute('data-costo', costo);
        itemDiv.innerHTML = `
            <p><strong>${item.nombre}</strong></p>
            <p style="font-size:0.8em; margin-top:5px;">${item.descripcion}</p>
            <p style="color:#ffd700; font-weight:700;">Costo: ${formatMoneda.format(costo)}</p>
            <button id="btn-${item.id}" onclick="comprarItem('ipc', '${item.id}')" ${yaComprado ? 'disabled' : ''}>
                COMPRAR
            </button>
        `;
        contenedor.appendChild(itemDiv);
    });
    actualizarBotones();
}

/**
 * Dibuja la tienda de Generadores Pasivos (IPS).
 */
function dibujarTiendaIPS() {
    const contenedor = document.getElementById('generadores-tienda');
    contenedor.innerHTML = ''; // Limpiar

    ITEMS_IPS.forEach(item => {
        const cantidad = estadoJuego.generadores[item.id] || 0;
        const costo = item.costo * Math.pow(item.factor, cantidad);
        const ips_generado = item.ips_base;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'tienda-item';
        itemDiv.setAttribute('data-costo', costo); // El costo real para la verificación
        itemDiv.innerHTML = `
            <p><strong>${item.nombre} (x${cantidad})</strong></p>
            <p style="font-size:0.8em; margin-top:5px;">Genera ${formatMoneda.format(ips_generado)}/s</p>
            <p style="color:#ffd700; font-weight:700;">Costo Siguiente: ${formatMoneda.format(costo)}</p>
            <button id="btn-${item.id}" onclick="comprarItem('ips', '${item.id}')">
                COMPRAR
            </button>
        `;
        contenedor.appendChild(itemDiv);
    });
    actualizarBotones();
}

/**
 * Dibuja la tienda de Activos y Lujos.
 */
function dibujarTiendaActivos() {
    const contenedorVehiculos = document.getElementById('tienda-vehiculos');
    const contenedorPropiedades = document.getElementById('tienda-propiedades');
    const contenedorAcciones = document.getElementById('tienda-acciones');
    
    contenedorVehiculos.innerHTML = '';
    contenedorPropiedades.innerHTML = '';
    contenedorAcciones.innerHTML = '';

    ITEMS_ACTIVOS.forEach(item => {
        const yaComprado = estadoJuego.propiedades[item.id];
        const cantidadAcciones = estadoJuego.acciones[item.id] || 0;
        const costo = item.costo;
        let contenedorObjetivo;
        let esBinario = false;

        if (item.tipo === 'vehiculo') {
            contenedorObjetivo = contenedorVehiculos;
            esBinario = true;
        } else if (item.tipo === 'propiedad') {
            contenedorObjetivo = contenedorPropiedades;
            esBinario = true;
        } else if (item.tipo === 'accion') {
            contenedorObjetivo = contenedorAcciones;
        }

        if (esBinario && yaComprado) {
            // Si es binario y ya se compró, solo se muestra el mensaje de comprado
            const itemCompradoDiv = document.createElement('div');
            itemCompradoDiv.className = 'tienda-item item-comprado';
            itemCompradoDiv.innerHTML = `
                <p><strong>${item.nombre}</strong></p>
                <p style="color:var(--color-exito); font-weight:700;">ADQUIRIDO ✅</p>
                <p style="font-size:0.8em; margin-top:5px;">${item.descripcion}</p>
            `;
            contenedorObjetivo.appendChild(itemCompradoDiv);
            return;
        }

        let nombreDisplay = item.nombre;
        let costoDisplay = formatMoneda.format(costo);
        let descripcionDisplay = item.descripcion;

        if (item.tipo === 'accion') {
            nombreDisplay = `${item.nombre} (x${cantidadAcciones})`;
            descripcionDisplay += ` Ingreso: ${formatMoneda.format(item.ips_por_unidad)} IPS por unidad.`;
        }


        const itemDiv = document.createElement('div');
        itemDiv.className = 'tienda-item';
        itemDiv.setAttribute('data-costo', costo);
        itemDiv.innerHTML = `
            <p><strong>${nombreDisplay}</strong></p>
            <p style="font-size:0.8em; margin-top:5px;">${descripcionDisplay}</p>
            <p style="color:#ffd700; font-weight:700;">Costo: ${costoDisplay}</p>
            <button id="btn-${item.id}" onclick="comprarItem('${item.tipo}', '${item.id}')" ${esBinario && yaComprado ? 'disabled' : ''}>
                COMPRAR
            </button>
        `;
        contenedorObjetivo.appendChild(itemDiv);
    });
    actualizarBotones();
}

/**
 * **FUNCIÓN CRÍTICA PARA SOLUCIONAR EL BUGEADO DE BOTONES**
 * Itera sobre todos los botones de la tienda y los habilita/deshabilita
 * basándose en el dinero actual del jugador.
 */
function actualizarBotones() {
    // Buscar todos los botones de compra en cualquier vista
    const botones = document.querySelectorAll('.tienda-item button'); 
    
    botones.forEach(button => {
        const itemDiv = button.closest('.tienda-item');
        if (itemDiv) {
            const costo = parseFloat(itemDiv.getAttribute('data-costo'));
            
            // Revisar si el botón ya está deshabilitado permanentemente (ej. lujo binario ya comprado)
            if (button.disabled) {
                itemDiv.classList.add('item-comprado'); // Mantener estilo de comprado
                return; 
            }

            // Lógica principal de habilitar/deshabilitar
            if (estadoJuego.dineroActual >= costo) {
                button.disabled = false;
                itemDiv.classList.remove('item-bloqueado');
            } else {
                button.disabled = true;
                itemDiv.classList.add('item-bloqueado');
            }
        }
    });
}

/**
 * Dibuja la vista de estadísticas con los datos actuales.
 */
function dibujarEstadisticas() {
    const contenedor = document.getElementById('stats-content');
    if (!contenedor) return;
    
    // Recalcular el IPS total para asegurar la precisión
    recalcularIPS();

    let inventarioHTML = '<h3>Inventario de Activos y Mejoras</h3><ul>';
    let inventarioVacio = true;

    // 1. Mejoras IPC
    ITEMS_IPC.forEach(item => {
        if (estadoJuego.mejoras[item.id]) {
            inventarioHTML += `<li>✅ Mejora de Clic: ${item.nombre}</li>`;
            inventarioVacio = false;
        }
    });

    // 2. Generadores IPS
    ITEMS_IPS.forEach(item => {
        const cantidad = estadoJuego.generadores[item.id] || 0;
        if (cantidad > 0) {
            inventarioHTML += `<li>⚙️ Generador: ${item.nombre} (x${cantidad})</li>`;
            inventarioVacio = false;
        }
    });

    // 3. Lujos Binarios
    ITEMS_ACTIVOS.filter(i => i.tipo === 'vehiculo' || i.tipo === 'propiedad').forEach(item => {
        if (estadoJuego.propiedades[item.id]) {
            inventarioHTML += `<li>💎 Lujo: ${item.nombre}</li>`;
            inventarioVacio = false;
        }
    });

    // 4. Acciones
    ITEMS_ACTIVOS.filter(i => i.tipo === 'accion').forEach(item => {
        const cantidad = estadoJuego.acciones[item.id] || 0;
        if (cantidad > 0) {
            inventarioHTML += `<li>📈 Inversión: ${item.nombre} (x${cantidad})</li>`;
            inventarioVacio = false;
        }
    });
    
    if (inventarioVacio) {
        inventarioHTML += '<li>No has adquirido ningún activo o mejora aún. ¡A comprar!</li>';
    }
    
    inventarioHTML += '</ul>';

    contenedor.innerHTML = `
        <div class="stats-panel">
            <h3>Estadísticas Generales</h3>
            <p><strong>Dinero Total Ganado:</strong> ${formatMoneda.format(estadoJuego.totalGanado)}</p>
            <p><strong>Número de Clics:</strong> ${estadoJuego.conteoClicks}</p>
            <p><strong>Ingreso por Clic (IPC):</strong> ${formatMoneda.format(calcularIPC())}</p>
            <p><strong>Ingreso por Segundo (IPS):</strong> ${formatMoneda.format(estadoJuego.ips)}</p>
        </div>
        <div class="stats-panel">
            ${inventarioHTML}
        </div>
        <p style="text-align:center; margin-top: 20px; font-size: 0.8em; color: #888;">ID de Usuario (para compartir): ${window.auth.currentUser?.uid || 'Invitado'}</p>
    `;
}

// =========================================================================
// 5. GESTIÓN DE VISTAS Y ESTADO PERSISTENTE (FIREBASE)
// =========================================================================

/**
 * Cambia la vista activa del juego.
 * @param {string} vista - 'clicker', 'propiedades', o 'stats'
 */
function cambiarVista(vista) {
    document.querySelectorAll('.game-view').forEach(view => {
        view.style.display = 'none';
        view.classList.remove('active');
    });

    const vistaElement = document.getElementById(`view-${vista}`);
    if (vistaElement) {
        vistaElement.style.display = 'block';
        vistaElement.classList.add('active');
    }

    // Asegurar que la vista de Stats se redibuja al ser activada
    if (vista === 'stats') {
        dibujarEstadisticas();
    }
}

/**
 * Reinicia el juego al estado inicial.
 */
function resetearJuego() {
    if (window.confirm("¿Estás seguro de que quieres REINICIAR el juego? Perderás todo el progreso.")) {
        estadoJuego = {
            dineroActual: 0,
            ipc: 1, 
            ips: 0, 
            conteoClicks: 0,
            totalGanado: 0,
            generadores: {},
            mejoras: {},
            propiedades: {},
            acciones: {},
        };
        // Reiniciar los costos en ITEMS_IPS a sus valores originales para el renderizado
        // (En un juego real, esto se haría cargando una copia limpia de las definiciones)
        
        dibujarTiendasIniciales();
        actualizarDisplay();
        actualizarBotones();
        guardarJuego();
        cambiarVista('clicker');
    }
}

// --- Lógica de persistencia con Firestore ---

let db;
let auth;
let userId;

// Referencia a la colección de datos privados del usuario (usando el esquema de Canvas)
const getDocRef = (collectionName) => {
    // Usar la variable global __app_id proporcionada por Canvas
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    return firebase.firestore().doc(`/artifacts/${appId}/users/${userId}/${collectionName}/game_data`);
};


/**
 * Guarda el estado actual del juego en Firestore.
 */
async function guardarJuego() {
    if (!db || !userId) return;
    try {
        const gameRef = getDocRef('clicker_data');
        await firebase.firestore().setDoc(gameRef, estadoJuego);
    } catch (e) {
        console.error("Error guardando el juego: ", e);
    }
}

/**
 * Carga el estado del juego desde Firestore.
 */
async function cargarJuego() {
    if (!db || !userId) return;
    try {
        const gameRef = getDocRef('clicker_data');
        const docSnap = await firebase.firestore().getDoc(gameRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Sobrescribe el estado actual con los datos guardados
            estadoJuego = { ...estadoJuego, ...data };
            console.log("Juego cargado exitosamente.");
        } else {
            console.log("No se encontraron datos guardados. Iniciando juego nuevo.");
        }
        
        // Finaliza la inicialización
        dibujarTiendasIniciales();
        actualizarDisplay();
        actualizarBotones();
        
    } catch (e) {
        console.error("Error cargando el juego: ", e);
        dibujarTiendasIniciales(); // Asegura que la UI se renderice incluso si la carga falla
        actualizarDisplay();
    }
}

// =========================================================================
// 6. INICIALIZACIÓN Y BUCLE DE JUEGO
// =========================================================================

/**
 * Ejecuta los ingresos pasivos por segundo (IPS).
 */
function ingresosPasivos() {
    // El IPS se recalcula antes de aplicarse
    recalcularIPS();
    estadoJuego.dineroActual += estadoJuego.ips / 10; // Aplicar 1/10 del IPS cada 100ms
    estadoJuego.totalGanado += estadoJuego.ips / 10;
    
    // Actualizar UI y botones (aunque sea más lento para optimizar, es clave para la reactividad)
    actualizarDisplay(); 
    actualizarBotones();
}

/**
 * Bucle principal de juego (se ejecuta 10 veces por segundo).
 */
function gameLoop() {
    // 1. Generar ingresos pasivos
    ingresosPasivos();

    // 2. Guardar el juego (solo cada 10 segundos para no saturar Firestore)
    if (estadoJuego.conteoClicks % 100 === 0) { // Un hack simple para guardar periodicamente
        guardarJuego();
    }

    // 3. Repetir el bucle
    setTimeout(gameLoop, 100); // 100ms = 10 veces por segundo
}

/**
 * Inicializa el juego después de la autenticación.
 */
function initGame() {
    // Obtener instancias de Firebase (asumiendo que fueron definidas en el HTML)
    db = window.db;
    auth = window.auth;
    userId = auth.currentUser?.uid || 'invitado'; // Usar UID o 'invitado'

    // Iniciar la carga de datos y el bucle
    cargarJuego();
    gameLoop();
}

/**
 * Dibuja las tiendas por primera vez al inicio.
 */
function dibujarTiendasIniciales() {
    dibujarTiendaIPC();
    dibujarTiendaIPS();
    dibujarTiendaActivos();
}


// Escuchar el evento de carga de la ventana o el estado de autenticación de Firebase
window.onload = () => {
    // Si Firebase ya está inicializado y autenticado (debería ser instantáneo en Canvas)
    if (window.auth && window.auth.currentUser) {
        initGame();
    } else if (window.auth) {
        // Si no está listo, esperamos el evento de autenticación (que lo hace el HTML)
        const checkAuth = setInterval(() => {
            if (window.auth.currentUser) {
                clearInterval(checkAuth);
                initGame();
            }
        }, 100);
    } else {
        // Fallback si Firebase no se inicializó correctamente en el HTML
        console.error("Firebase no disponible. Ejecutando sin guardar.");
        dibujarTiendasIniciales();
        actualizarDisplay();
        gameLoop();
    }
};

// Exponer las funciones necesarias para el HTML
window.hacerClic = hacerClic;
window.comprarItem = comprarItem;
window.cambiarVista = cambiarVista;
window.resetearJuego = resetearJuego;
