// ===================================
// GESTIÓN DE ESTADO (Variables Globales)
// ===================================

let juego = {
    dinero: 0, 
    ingresoPorClic: 1, 
    ingresoPorSegundo: 0, 
    siguienteMejoraClicIndex: 0, 
    
    // NUEVAS ESTADÍSTICAS GLOBALES
    clicsTotales: 0,
    dineroGanadoTotal: 0,
    puntosDeLujo: 0, // Valor total de los activos de lujo
    
    // Mejoras de Clic (Progresión Gated/Estricta)
    mejorasClic: [
        { nombre: "Dedo Entrenado 👆", costo: 10, multiplicador: 2, cantidad: 0, desc: "IPC x2. El inicio de la fortuna." },
        { nombre: "Clic Rápido ⚡", costo: 50, multiplicador: 2, cantidad: 0, desc: "IPC x2. Tus reflejos mejoran." },
        { nombre: "Mouse Óptico Básico", costo: 150, multiplicador: 2, cantidad: 0, desc: "IPC x2. Un ratón más preciso." },
        { nombre: "Doble Clic ✌️", costo: 400, multiplicador: 2, cantidad: 0, desc: "IPC x2. Ahora clicas dos veces por golpe." },
        { nombre: "Ratón Ergonómico 🖱️", costo: 1000, multiplicador: 3, cantidad: 0, desc: "IPC x3. Comodidad = Velocidad." },
        { nombre: "Auto-Clic Programado", costo: 3500, multiplicador: 3, cantidad: 0, desc: "IPC x3. Tu software te ayuda." },
        { nombre: "Mouse Gamer RGB", costo: 10000, multiplicador: 4, cantidad: 0, desc: "IPC x4. Estilo y rendimiento." },
        { nombre: "Conexión de Fibra", costo: 25000, multiplicador: 4, cantidad: 0, desc: "IPC x4. Clics instantáneos." },
        { nombre: "Dedo Biónico 🦾", costo: 60000, multiplicador: 5, cantidad: 0, desc: "IPC x5. Mejora robótica." },
        { nombre: "Clic Cuántico", costo: 150000, multiplicador: 5, cantidad: 0, desc: "IPC x5. Aprovecha el espacio-tiempo." },
        { nombre: "Hiper-Clic V.1", costo: 400000, multiplicador: 6, cantidad: 0, desc: "IPC x6. Entras en la liga mayor." },
        { nombre: "Motor de Clic Silencioso", costo: 1000000, multiplicador: 6, cantidad: 0, desc: "IPC x6. La eficiencia es invisible." },
        { nombre: "Clicker IA", costo: 3000000, multiplicador: 7, cantidad: 0, desc: "IPC x7. Inteligencia Artificial clica por ti." },
        { nombre: "Procesador Neural", costo: 8000000, multiplicador: 7, cantidad: 0, desc: "IPC x7. Clics pensados antes de ocurrir." },
        { nombre: "Fusión de Materia", costo: 20000000, multiplicador: 8, cantidad: 0, desc: "IPC x8. Cada clic genera energía." },
        { nombre: "Telequinesis", costo: 50000000, multiplicador: 8, cantidad: 0, desc: "IPC x8. ¡Ni siquiera necesitas el mouse!" },
        { nombre: "Generador de Clics Infinitos", costo: 150000000, multiplicador: 9, cantidad: 0, desc: "IPC x9. Desafía la ley de la física." },
        { nombre: "Singularidad Clic", costo: 500000000, multiplicador: 9, cantidad: 0, desc: "IPC x9. Creas un mini-agujero negro de dinero." },
        { nombre: "Omnipresencia", costo: 1500000000, multiplicador: 10, cantidad: 0, desc: "IPC x10. Existes en cada clic posible." },
        { nombre: "El Big Bang del Clic 💥", costo: 5000000000, multiplicador: 10, cantidad: 0, desc: "IPC x10. El último nivel: ¡Origen de todo el dinero!" }
    ],

    // Generadores de Dinero (Negocios - Compra Múltiple, IPS)
    generadores: [
        { id: 'trabajador', nombre: "Trabajador 👨‍💼", costo: 15, produccion: 0.1, cantidad: 0, factor: 1.15, desc: "Genera dinero básico." },
        { id: 'cajero', nombre: "Máquina de Cajero 🏧", costo: 100, produccion: 1, cantidad: 0, factor: 1.15, desc: "Una fuente constante de flujo." },
        { id: 'fabrica', nombre: "Fábrica de Dinero 🏭", costo: 1000, produccion: 8, cantidad: 0, factor: 1.15, desc: "Grandes cantidades de papel moneda." },
        { id: 'banco', nombre: "Banco Digital 🏦", costo: 15000, produccion: 40, cantidad: 0, factor: 1.15, desc: "Controla las finanzas." },
        { id: 'inversion', nombre: "Fondo de Inversión 📊", costo: 100000, produccion: 100, cantidad: 0, factor: 1.15, desc: "El dinero trabaja por ti." },
        { id: 'multinacional', nombre: "Multinacional Global 🌍", costo: 1500000, produccion: 1000, cantidad: 0, factor: 1.15, desc: "Dominio total del mercado." }
    ],

    // NUEVOS ACTIVOS: Compra única (Lujos) o Múltiple (Acciones)
    activos: {
        vehiculos: [
            { id: 'scooter', nombre: "Scooter de Lujo 🛵", costo: 50000, puntos: 10, cantidad: 0, desc: "Muévete con estilo." },
            { id: 'deportivo', nombre: "Deportivo Italiano 🏎️", costo: 500000, puntos: 50, cantidad: 0, desc: "Velocidad y prestigio." },
            { id: 'yate', nombre: "Súper Yate 🛥️", costo: 5000000, puntos: 250, cantidad: 0, desc: "Tu propia flota personal." },
            { id: 'avion', nombre: "Jet Privado ✈️", costo: 50000000, puntos: 1000, cantidad: 0, desc: "Viaja por el mundo." }
        ],
        propiedades: [
            { id: 'apartamento', nombre: "Apartamento en Ciudad 🏙️", costo: 100000, puntos: 20, cantidad: 0, desc: "Ubicación céntrica." },
            { id: 'mansion', nombre: "Mansión con Piscina 🏰", costo: 2000000, puntos: 100, cantidad: 0, desc: "Lujos ilimitados." },
            { id: 'isla', nombre: "Isla Privada 🏝️", costo: 10000000, puntos: 500, cantidad: 0, desc: "Tu propio paraíso." }
        ],
        acciones: [
            // Acciones: generan IPS extra (Compra Múltiple, IPS)
            { id: 'basica', nombre: "Acciones de Mercado Básico", costo: 1000, produccion: 0.5, cantidad: 0, factor: 1.2, desc: "Inversión estable y constante." },
            { id: 'tecnologia', nombre: "Acciones Tech Blue Chip", costo: 10000, produccion: 5, cantidad: 0, factor: 1.3, desc: "Rendimiento alto riesgo/beneficio." },
            { id: 'cripto', nombre: "Fondo de Criptomoneda 🪙", costo: 100000, produccion: 50, cantidad: 0, factor: 1.4, desc: "El futuro de las finanzas." }
        ]
    }
};

// Referencias a los elementos del DOM (Asumen que ya existen en el HTML)
const DINE = document.getElementById('dinero-actual');
const IPS = document.getElementById('ips-actual');
const TIENDA_CLIC = document.getElementById('mejoras-clic-tienda');
const TIENDA_GENERADORES = document.getElementById('generadores-tienda');

// Nuevos contenedores de activos y estadísticas
const TIENDA_VEHICULOS = document.getElementById('tienda-vehiculos');
const TIENDA_PROPIEDADES = document.getElementById('tienda-propiedades');
const TIENDA_ACCIONES = document.getElementById('tienda-acciones');
const STATS_CONTENT = document.getElementById('stats-content');


// ===================================
// FUNCIONES DE COMPRA Y LÓGICA
// ===================================

function hacerClic() {
    // La función crearAnimacionClic() debe existir en el HTML
    if (typeof crearAnimacionClic === 'function') {
        crearAnimacionClic(juego.ingresoPorClic);
    }
    juego.dinero += juego.ingresoPorClic; 
    juego.clicsTotales++; // Registrar clic
    juego.dineroGanadoTotal += juego.ingresoPorClic; // Registrar ganancia total
    actualizarInterfaz();
    guardarJuego();
}

// Lógica de compra para Mejoras de Clic (Progresión estricta)
function comprarMejoraClic(index) {
    if (index !== juego.siguienteMejoraClicIndex) { return; }
    let mejora = juego.mejorasClic[index];
    
    if (juego.dinero >= mejora.costo) {
        juego.dinero -= mejora.costo;
        juego.ingresoPorClic *= mejora.multiplicador; 
        mejora.cantidad = 1; 
        juego.siguienteMejoraClicIndex++;
        juego.ingresoPorClic = parseFloat(juego.ingresoPorClic.toFixed(2));
        actualizarInterfaz();
        guardarJuego();
    }
}

// Lógica de compra para Generadores (Negocios)
function comprarGenerador(indice) {
    let generador = juego.generadores[indice];
    
    if (juego.dinero >= generador.costo) {
        juego.dinero -= generador.costo;
        generador.cantidad++;
        juego.ingresoPorSegundo += generador.produccion;
        generador.costo = Math.ceil(generador.costo * generador.factor); 
        juego.ingresoPorSegundo = parseFloat(juego.ingresoPorSegundo.toFixed(2));
        actualizarInterfaz();
        guardarJuego();
    }
}

// Lógica de compra para Activos de Lujo (Vehículos y Propiedades - Compra Única)
function comprarActivoLujo(tipo, indice) {
    const lista = juego.activos[tipo];
    let activo = lista[indice];
    
    if (activo.cantidad >= 1) { return; } // Bloquear si ya está comprado
    
    if (juego.dinero >= activo.costo) {
        juego.dinero -= activo.costo;
        activo.cantidad = 1; 
        juego.puntosDeLujo += activo.puntos; // Aumenta el valor de lujo
        actualizarInterfaz();
        guardarJuego();
    }
}

// Lógica de compra para Acciones (Compra Múltiple, Aumenta IPS)
function comprarAccion(indice) {
    const lista = juego.activos.acciones;
    let accion = lista[indice];
    
    if (juego.dinero >= accion.costo) {
        juego.dinero -= accion.costo;
        accion.cantidad++;
        juego.ingresoPorSegundo += accion.produccion;
        
        // Aumenta el costo del siguiente nivel/accion
        accion.costo = Math.ceil(accion.costo * accion.factor); 

        juego.ingresoPorSegundo = parseFloat(juego.ingresoPorSegundo.toFixed(2));
        actualizarInterfaz();
        guardarJuego();
    }
}

function resetearJuego() {
    // Usamos la función nativa confirm, pero en entornos Canvas puede ser reemplazada.
    if (confirm("¿Estás seguro de que quieres reiniciar todo tu progreso?")) {
        localStorage.removeItem('millonarioClicker');
        window.location.reload(); // Recarga la página para empezar de nuevo
    }
}

// ===================================
// DIBUJO Y BUCLE
// ===================================

function formatDinero(monto) {
    // Formatea el dinero a USD con dos decimales para una mejor presentación
    const formatter = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(monto).replace('US$', '$').replace('€', '$').trim();
}

/**
 * Dibuja los ítems en las tiendas (Mejoras, Generadores, Activos)
 * @param {HTMLElement} contenedor - El elemento donde dibujar los ítems.
 * @param {Array<Object>} items - La lista de ítems a dibujar.
 * @param {string} funcionComprarBase - El nombre de la función JS a llamar al comprar.
 * @param {string} tipo - El tipo de ítem ('clic', 'generadores', 'vehiculos', 'propiedades', 'acciones').
 */
function dibujarTienda(contenedor, items, funcionComprarBase, tipo) {
    if (!contenedor) return; // Salir si el contenedor no existe
    contenedor.innerHTML = ''; 
    
    items.forEach((item, index) => {
        
        const isGatedUpgrade = (tipo === 'clic');
        const isLuxuryAsset = (tipo === 'vehiculos' || tipo === 'propiedades');
        
        const puedeComprar = juego.dinero >= item.costo;
        
        let itemStatusClass = '';
        let buttonText = 'Comprar';
        let isDisabled = !puedeComprar;
        
        // --- Lógica de Mejoras de Clic (Progresión Gated) ---
        if (isGatedUpgrade) {
            if (item.cantidad === 1) { 
                itemStatusClass = 'item-comprado';
                buttonText = 'Comprado';
                isDisabled = true;
            } else if (index > juego.siguienteMejoraClicIndex) {
                 itemStatusClass = 'item-bloqueado';
                 buttonText = 'Bloqueado';
                 isDisabled = true;
            } else if (index === juego.siguienteMejoraClicIndex && !puedeComprar) {
                itemStatusClass = 'item-bloqueado';
            }
            if (index > juego.siguienteMejoraClicIndex + 1) { return; } // Oculta mejoras lejanas
        } 
        // --- Lógica de Activos de Lujo (Compra Única) ---
        else if (isLuxuryAsset) {
            if (item.cantidad === 1) {
                itemStatusClass = 'item-comprado';
                buttonText = 'Adquirido';
                isDisabled = true;
            } else if (!puedeComprar) {
                itemStatusClass = 'item-bloqueado';
            }
        }
        // --- Lógica General (Generadores, Acciones - Compra Múltiple) ---
        else if (!puedeComprar) {
            itemStatusClass = 'item-bloqueado';
        }
        
        // Contenido del item
        const efecto = item.multiplicador 
            ? `IPC x${item.multiplicador}` 
            : item.puntos 
            ? `+${item.puntos} Lujo`
            : `${item.produccion.toFixed(1)} IPS` 
            
        const progreso = isGatedUpgrade && item.cantidad === 1 ? ` (${index + 1}/${juego.mejorasClic.length})` : '';
        const cantidadDisplay = isGatedUpgrade || isLuxuryAsset ? '' : `<p>Tienes: ${item.cantidad}</p>`;
        
        // Determina la función de compra correcta (Activo Lujo requiere el parámetro 'tipo')
        let funcionComprar = `${funcionComprarBase}(${index})`;
        if (isLuxuryAsset) {
            funcionComprar = `${funcionComprarBase}('${tipo}', ${index})`;
        }

        const div = document.createElement('div');
        div.className = `tienda-item ${itemStatusClass}`; 

        div.innerHTML = `
            <p><strong>${item.nombre}${progreso}</strong></p>
            <p style="font-size:0.85em; opacity:0.8;">${item.desc}</p>
            <p>Costo: ${formatDinero(item.costo)}</p>
            <p>Efecto: ${efecto}</p>
            ${cantidadDisplay}
            <button 
                onclick="${funcionComprar}" 
                ${isDisabled ? 'disabled' : ''}
                class="${isDisabled ? 'btn-bloqueado' : 'btn-comprar'}"
            >
                ${buttonText}
            </button>
        `;
        contenedor.appendChild(div);
    });
}

/**
 * Genera el contenido para la vista de Inventario y Estadísticas
 */
function dibujarEstadisticas() {
    if (!STATS_CONTENT) return;
    STATS_CONTENT.innerHTML = '';
    
    let html = '<h2>RESUMEN DE PROGRESO</h2>';
    html += '<div class="stats-panel">';
    
    // Estadísticas generales
    html += '<h3>📊 Estadísticas Generales</h3>';
    html += `<p><strong>Dinero Ganado Total:</strong> ${formatDinero(juego.dineroGanadoTotal)}</p>`;
    html += `<p><strong>Total de Clics Manuales:</strong> ${juego.clicsTotales}</p>`;
    html += `<p><strong>Puntos de Lujo Acumulados:</strong> ${juego.puntosDeLujo}</p>`;
    html += `<p><strong>Ingreso Pasivo Actual (IPS):</strong> ${juego.ingresoPorSegundo.toFixed(2)}</p>`;
    html += '</div>';

    // Inventario de Activos
    html += '<div class="stats-panel">';
    html += '<h3>📦 Inventario de Activos y Negocios</h3>';
    
    const assetsList = [];
    
    // Recopilar Vehículos y Propiedades (Lujos)
    ['vehiculos', 'propiedades'].forEach(tipo => {
        juego.activos[tipo].forEach(activo => {
            if (activo.cantidad > 0) {
                assetsList.push(`- ${activo.nombre}`);
            }
        });
    });

    // Recopilar Acciones
    juego.activos.acciones.forEach(accion => {
        if (accion.cantidad > 0) {
            assetsList.push(`- ${accion.nombre} x${accion.cantidad}`);
        }
    });

    // Recopilar Generadores de Negocio
    juego.generadores.forEach(gen => {
        if (gen.cantidad > 0) {
            assetsList.push(`- ${gen.nombre} x${gen.cantidad}`);
        }
    });

    if (assetsList.length > 0) {
        html += '<ul>' + assetsList.map(item => `<li>${item}</li>`).join('') + '</ul>';
    } else {
        html += '<p>Aún no has adquirido negocios o activos de lujo.</p>';
    }

    html += '</div>';
    STATS_CONTENT.innerHTML = html;
}

// Función principal para actualizar todos los datos mostrados en la interfaz
function actualizarInterfaz() {
    if (DINE) DINE.textContent = formatDinero(juego.dinero);
    if (IPS) IPS.textContent = juego.ingresoPorSegundo.toFixed(2);
    const ipcElement = document.getElementById('ipc-actual');
    if (ipcElement) ipcElement.textContent = formatDinero(juego.ingresoPorClic);

    // Solo dibujar las tiendas que estén en la vista activa para optimizar
    const currentViewId = document.querySelector('.game-view.active')?.id || 'view-clicker';

    if (currentViewId === 'view-clicker') {
        dibujarTienda(TIENDA_CLIC, juego.mejorasClic, 'comprarMejoraClic', 'clic');
        dibujarTienda(TIENDA_GENERADORES, juego.generadores, 'comprarGenerador', 'generadores');
    }
    
    if (currentViewId === 'view-propiedades') {
        dibujarTienda(TIENDA_VEHICULOS, juego.activos.vehiculos, 'comprarActivoLujo', 'vehiculos');
        dibujarTienda(TIENDA_PROPIEDADES, juego.activos.propiedades, 'comprarActivoLujo', 'propiedades');
        dibujarTienda(TIENDA_ACCIONES, juego.activos.acciones, 'comprarAccion', 'acciones');
    }

    if (currentViewId === 'view-stats') {
        dibujarEstadisticas();
    }
}

/**
 * Función que maneja la navegación entre las tres vistas principales
 * @param {string} vistaId - El ID de la vista a mostrar ('clicker', 'propiedades', 'stats')
 */
function cambiarVista(vistaId) {
    document.querySelectorAll('.game-view').forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
    });
    
    const vista = document.getElementById(`view-${vistaId}`);
    if (vista) {
        vista.classList.add('active');
        vista.style.display = 'block';
        actualizarInterfaz(); // Redibuja el contenido específico de la nueva vista
    }
}
window.cambiarVista = cambiarVista; // Hacer global para que el HTML pueda llamarla


// Bucle de Juego principal (Se ejecuta 10 veces por segundo)
let bucleContador = 0;
function bucleDeJuego() {
    // Gana dinero pasivo (IPS/10 cada 100ms)
    juego.dinero += juego.ingresoPorSegundo / 10; 
    
    // Guarda el juego cada 5 segundos (50 ciclos * 100ms/ciclo = 5000ms)
    if (bucleContador % 50 === 0) {
        guardarJuego();
    }
    
    actualizarInterfaz();
    bucleContador++;
}

// Lógica de Persistencia y Carga (LocalStorage)
function guardarJuego() {
    // Solo guardamos las propiedades que cambian o son necesarias para el estado
    const savedState = {
        dinero: juego.dinero,
        ingresoPorSegundo: juego.ingresoPorSegundo,
        siguienteMejoraClicIndex: juego.siguienteMejoraClicIndex,
        clicsTotales: juego.clicsTotales,
        dineroGanadoTotal: juego.dineroGanadoTotal,
        puntosDeLujo: juego.puntosDeLujo,
        // Solo guardar el estado de compra/cantidad para optimizar
        mejorasClic: juego.mejorasClic.map(m => ({ cantidad: m.cantidad })),
        generadores: juego.generadores.map(g => ({ costo: g.costo, cantidad: g.cantidad })),
        activos: {
            vehiculos: juego.activos.vehiculos.map(a => ({ cantidad: a.cantidad })),
            propiedades: juego.activos.propiedades.map(a => ({ cantidad: a.cantidad })),
            acciones: juego.activos.acciones.map(a => ({ costo: a.costo, cantidad: a.cantidad })),
        }
    };
    localStorage.setItem('millonarioClicker', JSON.stringify(savedState));
}

function cargarJuego() {
    const datosGuardados = localStorage.getItem('millonarioClicker');
    if (datosGuardados) {
        const savedJuego = JSON.parse(datosGuardados);

        juego.dinero = savedJuego.dinero || 0;
        juego.ingresoPorClic = 1; // Base
        juego.ingresoPorSegundo = savedJuego.ingresoPorSegundo || 0;
        juego.siguienteMejoraClicIndex = savedJuego.siguienteMejoraClicIndex || 0;
        juego.clicsTotales = savedJuego.clicsTotales || 0;
        juego.dineroGanadoTotal = savedJuego.dineroGanadoTotal || 0;
        juego.puntosDeLujo = savedJuego.puntosDeLujo || 0;
        
        // Recalcula IPC a partir de las mejoras compradas
        if(savedJuego.mejorasClic) {
             savedJuego.mejorasClic.forEach((savedItem, index) => {
                if (juego.mejorasClic[index]) {
                    juego.mejorasClic[index].cantidad = savedItem.cantidad || 0;
                    if (savedItem.cantidad === 1) {
                        juego.ingresoPorClic *= juego.mejorasClic[index].multiplicador;
                    }
                }
             });
             juego.ingresoPorClic = parseFloat(juego.ingresoPorClic.toFixed(2));
        }

        // Carga de ítems de compra múltiple (Generadores y Acciones: actualiza costo y cantidad)
        const loadMultiplePurchaseItems = (savedList, currentList) => {
            savedList.forEach((savedItem, index) => {
                if (currentList[index]) {
                    currentList[index].costo = savedItem.costo || currentList[index].costo;
                    currentList[index].cantidad = savedItem.cantidad || 0;
                }
            });
        };

        loadMultiplePurchaseItems(savedJuego.generadores || [], juego.generadores);
        loadMultiplePurchaseItems(savedJuego.activos?.acciones || [], juego.activos.acciones);
        
        // Carga de Activos de Lujo (Vehículos/Propiedades: solo cantidad)
        if(savedJuego.activos) {
            ['vehiculos', 'propiedades'].forEach(tipo => {
                savedJuego.activos[tipo]?.forEach((savedItem, index) => {
                    if (juego.activos[tipo][index]) {
                        juego.activos[tipo][index].cantidad = savedItem.cantidad || 0;
                    }
                });
            });
        }
    }
    
    // Inicializa la vista por defecto y comienza el bucle
    cambiarVista('clicker'); 
    setInterval(bucleDeJuego, 100); 
    actualizarInterfaz();
}

// Iniciar el juego
cargarJuego();

