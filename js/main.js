// --- LÓGICA DE CARGA MEJORADA (SE EJECUTA AL INICIO) ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. INICIALIZAR FIREBASE PRIMERO ---
    // Se necesita 'database' en el scope global para las funciones de asistencia
    const firebaseConfig = {
        apiKey: "AIzaSyDDJ0UmA5giAjFbz54JqaudKFOBfEv613U",
        authDomain: "babyshowerguzmanmiranda.firebaseapp.com",
        databaseURL: "https://babyshowerguzmanmiranda-default-rtdb.firebaseio.com",
        projectId: "babyshowerguzmanmiranda",
        storageBucket: "babyshowerguzmanmiranda.firebasestorage.app",
        messagingSenderId: "564665563453",
        appId: "1:564665563453:web:242aaba73a4768fa89ad54"
    };
    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.database(); // 'database' ahora es accesible para initPageUI

    const loaderWrapper = document.getElementById('loader-wrapper');

    // --- TAREA 1: PROMESA DE TIEMPO MÍNIMO ---
    const minTimePromise = new Promise(resolve => {
        setTimeout(resolve, 5000); // 5 segundos de tiempo mínimo del loader
    });

    // --- TAREA 2: PROMESA DE CARGA DEL LOADER HTML ---
    const loaderFetchPromise = new Promise((resolve) => {
        const loaderFiles = [
            'Biberon.html', 'BloquesBaby.html', 'Cigueña.html', 'Cochecito.html', 
            'HorneandoAlgo.html', 'Lluvia.html', 'Luna.html', 'Milagro.html', 
            'Patito.html', 'Rehilete.html', 'Saltando.html', 'Sonajero.html', 'Tendedero.html'
        ];
        const randomLoaderFile = loaderFiles[Math.floor(Math.random() * loaderFiles.length)];

        if (loaderWrapper && randomLoaderFile) {
            fetch(`loaders/${randomLoaderFile}`)
                .then(response => response.ok ? response.text() : '')
                .then(html => {
                    if (html.trim().length > 0) {
                        loaderWrapper.innerHTML = html;
                    }
                })
                .catch(error => console.error('No se pudo cargar el loader:', error))
                .finally(() => resolve()); // Siempre resolvemos para no bloquear la carga
        } else {
            resolve(); // Resuelve si no hay loader
        }
    });

    // --- TAREA 3: PROMESA DE DATOS DE FIREBASE Y PRE-CONFIGURACIÓN DE UI ---
    const firebaseDataPromise = new Promise((resolve) => {
        // Referencias a todos los elementos que vamos a cambiar
        const regalosIntroElement = document.querySelector('#regalos .regalos-intro');
        const textoOriginalRegalos = regalosIntroElement ? regalosIntroElement.innerHTML : ''; 
        const revelacionSection = document.getElementById('revelacion-info');
        const generoElement = document.getElementById('info-genero');
        const nombreElement = document.getElementById('info-nombre');
        const inicioSection = document.getElementById('inicio'); 
        const itinerarioSection = document.getElementById('itinerario'); 
        const ubicacionSection = document.getElementById('ubicacion'); 
        const videoElement = document.querySelector('video.logo');
        const videoSource = document.querySelector('video.logo source');

        // Función para manejar el estado por defecto (antes de la revelación o en error)
        const setDefaultState = () => {
            document.body.classList.remove('theme-girl'); // <-- QUITA LA CLASE DEL TEMA
            if (revelacionSection) revelacionSection.style.display = 'none'; 
            if (inicioSection) inicioSection.style.display = 'block'; 
            if (itinerarioSection) itinerarioSection.style.display = 'block'; 
            if (ubicacionSection) ubicacionSection.style.display = 'block';
            if (videoSource && videoElement) {
                videoSource.src = 'img/Baby Logo 2.webm';
                videoElement.load(); 
            }
            if (regalosIntroElement) {
                regalosIntroElement.innerHTML = textoOriginalRegalos;
            }
        };

        const configRef = database.ref('configuracion'); 
        
        configRef.once('value')
            .then((snapshot) => {
                const configData = snapshot.val();

                if (configData && configData.mostrarRevelacion === true) {
                    // --- Estado "Revelado" ---
                    document.body.classList.add('theme-girl'); // <-- AÑADE LA CLASE DEL TEMA

                    if (revelacionSection && generoElement && nombreElement) {
                        
                        generoElement.textContent = configData.genero || '¡Es una Niña!';
                        
                        const nombreTexto = configData.nombre || 'Bebé Guzmán Miranda';
                        const palabras = nombreTexto.split(' ');
                        nombreElement.innerHTML = ''; 
                        palabras.forEach((palabra, index) => {
                            const span = document.createElement('span');
                            span.textContent = palabra; 
                            span.style.animationDelay = `${0.8 + index * 0.2}s`; 
                            nombreElement.appendChild(span);
                        });
                        
                        revelacionSection.style.display = 'block';
                        // Generar iconos SÓLO para la sección de revelación si está activa
                        const revelacionIconContainer = document.getElementById('revelacion-icon-container');
                        if(revelacionIconContainer) generarIconosFlotantes(revelacionIconContainer);

                    }
                    
                    if (inicioSection) inicioSection.style.display = 'none'; 
                    if (itinerarioSection) itinerarioSection.style.display = 'none';
                    if (ubicacionSection) ubicacionSection.style.display = 'none';
                    
                    if (videoSource && videoElement) {
                        videoSource.src = 'img/Familia Logo.webm'; 
                        videoElement.load(); 
                    }
                    
                    if (regalosIntroElement && configData.mesaRegalos) {
                        regalosIntroElement.innerHTML = configData.mesaRegalos; 
                    }
                } else {
                    // --- Estado por Defecto ---
                    setDefaultState();
                }
            })
            .catch((error) => {
                console.error("Error al leer la configuración de Firebase con .once():", error);
                setDefaultState(); // Pone el estado por defecto si falla
            })
            .finally(() => {
                resolve(); // Resuelve la promesa de Firebase, haya éxito o no
            });
    });

    // --- INICIALIZA EL RESTO DE LA UI (MODALES, GALERÍA, ETC.) ---
    // Y AHORA TAMBIÉN GENERA LOS ICONOS PARA TODAS LAS SECCIONES
    initPageUI(database); 

    // --- OCULTAR EL LOADER ---
    Promise.all([minTimePromise, loaderFetchPromise, firebaseDataPromise])
        .then(() => {
            if (loaderWrapper) {
                loaderWrapper.classList.add('hidden');
                setTimeout(() => {
                    if (loaderWrapper) loaderWrapper.style.display = 'none';
                }, 1500); // Duración de la transición en CSS
            }
        });

}); // Fin de DOMContentLoaded

// --- FUNCIÓN QUE INICIALIZA EL RESTO DE LA PÁGINA ---
// (Modificada para llamar a generarIconosFlotantes para todos los contenedores)
function initPageUI(database) {
    if (window.pageInitialized) return;
    window.pageInitialized = true;

    console.log("Inicializando UI de la página (modales, galería, iconos flotantes, etc.)...");

    // =================================================================================
    // CÓDIGO DEL MODAL Y LÓGICA DE ASISTENCIA (sin cambios)
    // =================================================================================
    let modalContainer = document.getElementById('custom-modal-container');
    let modal = document.getElementById('custom-modal');
    let modalIcon = document.getElementById('modal-icon');
    let modalTitle = document.getElementById('modal-title');
    let modalMessage = document.getElementById('modal-message');
    let modalButtons = document.getElementById('modal-buttons');
    let onConfirmCallback = null;
    let onCancelCallback = null;
    let nombreDesdeURL = '';

    const icons = {
        success: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,95 C74.85,95 95,74.85 95,50 C95,25.15 74.85,5 50,5 C25.15,5 5,25.15 5,50 C5,74.85 25.15,95 50,95 Z" fill="#d1fae5"/><path d="M66.3,34.4c-1.2-1.2-3.1-1.2-4.2,0L45.8,50.7l-6.3-6.3c-1.2-1.2-3.1-1.2-4.2,0c-1.2,1.2-1.2,3.1,0,4.2l8.4,8.4c0.6,0.6,1.4,0.9,2.1,0.9s1.5-0.3,2.1-0.9l18.4-18.4C67.5,37.5,67.5,35.6,66.3,34.4z" fill="#10b981"/><path d="M55.8,62.5H44.2c-2.8,0-5-2.2-5-5V46.7c0-2.8,2.2-5,5-5h11.7c2.8,0,5,2.2,5,5v10.8C60.8,60.3,58.6,62.5,55.8,62.5z" fill="#a7f3d0"/><path d="M50,39.2c-1.4,0-2.5-1.1-2.5-2.5v-5c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5v5C52.5,38.1,51.4,39.2,50,39.2z" fill="#34d399"/></svg>`,
        error: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,95 C74.85,95 95,74.85 95,50 C95,25.15 74.85,5 50,5 C25.15,5 5,25.15 5,50 C5,74.85 25.15,95 50,95 Z" fill="#fee2e2"/><path d="M50 67.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="#ef4444"/><path d="M47,30v25c0-1.7,1.3,3,3,3s3-1.3,3-3V30c0-1.7-1.3-3-3-3S47,28.3,47,30z" fill="#ef4444"/><circle cx="35" cy="25" r="4" fill="#fca5a5"/><circle cx="65" cy="25" r="4" fill="#fca5a5"/></svg>`
    };

    window.showCustomConfirm = ({ type, title, message, onConfirm, onCancel }) => {
        if (!modalContainer) return;
        modalIcon.innerHTML = type === 'success' ? icons.success : icons.error;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        onConfirmCallback = onConfirm;
        onCancelCallback = onCancel;
        modalButtons.innerHTML = '';
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.className = 'modal-button confirm';
        confirmButton.onclick = handleConfirm;
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.className = 'modal-button cancel';
        cancelButton.onclick = handleCancel;
        modalButtons.appendChild(cancelButton);
        modalButtons.appendChild(confirmButton);
        modalContainer.classList.remove('hidden');
        modal.classList.remove('modal-leave');
        modal.classList.add('modal-enter');
    }

    window.showSimpleAlert = (type, title, message, onOk) => {
        if (!modalContainer) return;
        modalIcon.innerHTML = type === 'success' ? icons.success : icons.error;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalButtons.innerHTML = '';
        const okButton = document.createElement('button');
        okButton.textContent = '¡Entendido!';
        okButton.className = 'modal-button ok';
        okButton.onclick = () => {
            hideModal();
            if (onOk) onOk();
        };
        modalButtons.appendChild(okButton);
        modalContainer.classList.remove('hidden');
        modal.classList.remove('modal-leave');
        modal.classList.add('modal-enter');
    }

    function hideModal() {
        if (modal) {
            modal.classList.add('modal-leave');
            modal.classList.remove('modal-enter');
            setTimeout(() => {
                if(modalContainer) modalContainer.classList.add('hidden');
            }, 300);
        }
    }

    function handleConfirm() {
        if (onConfirmCallback) onConfirmCallback();
    }

    function handleCancel() {
        if (onCancelCallback) onCancelCallback();
        hideModal();
    }
    
    // =================================================================================
    // LÓGICA PARA ASIGNACIÓN DE MESAS Y SILLAS (sin cambios)
    // =================================================================================

    const MAX_MESAS = 15;
    const SILLAS_POR_MESA = 10;

    function normalizarNombre(nombre) {
        if (!nombre) return '';
        return nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '').trim().toUpperCase();
    }
    
    async function encontrarLugarDisponible() {
        const asistentesRef = database.ref('asistentes'); // 'database' viene del argumento de initPageUI
        const snapshot = await asistentesRef.once('value');
        const asistentes = snapshot.val();
        let lugaresOcupados = new Set();

        if (asistentes) {
            for (const key in asistentes) {
                const invitado = asistentes[key];
                if (invitado.estatus === 'confirmado' && invitado.mesa && invitado.silla) {
                    lugaresOcupados.add(`${invitado.mesa}-${invitado.silla}`);
                }
            }
        }
        
        for (let mesa = 1; mesa <= MAX_MESAS; mesa++) {
            for (let silla = 1; silla <= SILLAS_POR_MESA; silla++) {
                if (!lugaresOcupados.has(`${mesa}-${silla}`)) {
                    return { mesa, silla };
                }
            }
        }
        return null;
    }

    window.registrarAsistencia = async (nuevoEstatus) => {
        const nombreInput = document.getElementById('nombreInvitado');
        let nombreOriginal = nombreDesdeURL || (nombreInput ? nombreInput.value.trim() : '');

        if (nombreOriginal === '') {
            showSimpleAlert('error', '¡Oh, no!', 'Por favor, escribe tu nombre antes de confirmar.');
            return;
        }

        const nombreNormalizado = normalizarNombre(nombreOriginal);
        const esConfirmacion = nuevoEstatus === 'confirmado';

        if (!esConfirmacion) {
            const config = {
                type: 'error',
                title: '¿No podrás asistir?',
                message: `Lamentaremos no verte, ${nombreOriginal}. ¿Estás seguro?`,
                onConfirm: () => {
                     guardarAsistencia(nombreOriginal, nombreNormalizado, nuevoEstatus, null);
                },
                onCancel: () => console.log("El usuario canceló el rechazo.")
            };
            showCustomConfirm(config);
            return;
        }

        const asistentesRef = database.ref('asistentes');
        const snapshot = await asistentesRef.orderByChild('nombreNormalizado').equalTo(nombreNormalizado).once('value');

        if (snapshot.exists()) {
            const asistenteData = Object.values(snapshot.val())[0];
            if (asistenteData.estatus === 'confirmado' && asistenteData.mesa && asistenteData.silla) {
                showSimpleAlert(
                    'success',
                    '¡Ya estás confirmado!',
                    `Gracias por registrarte, ${nombreOriginal}. Nos encantara verte.`
                );
                if (nombreInput) nombreInput.value = '';
                return;
            }
        }
        
        const lugar = await encontrarLugarDisponible();
        if (!lugar) {
            showSimpleAlert('error', '¡Evento Lleno!', 'Lo sentimos, todos los lugares han sido ocupados.');
            return;
        }

        const config = {
            type: 'success',
            title: '¿Confirmas tu asistencia?',
            message: `¡Qué alegría, ${nombreOriginal}! Te esperamos.`,
            onConfirm: () => {
                guardarAsistencia(nombreOriginal, nombreNormalizado, nuevoEstatus, lugar);
            },
            onCancel: () => console.log("El usuario canceló la confirmación.")
        };
        showCustomConfirm(config);
    };

    async function guardarAsistencia(nombreOriginal, nombreNormalizado, estatus, lugar) {
        const asistentesRef = database.ref('asistentes');
        const snapshot = await asistentesRef.orderByChild('nombreNormalizado').equalTo(nombreNormalizado).once('value');
        const fechaISO = new Date().toISOString();
        let datosParaGuardar = {
            nombre: nombreOriginal.trim(),
            nombreNormalizado: nombreNormalizado,
            estatus: estatus,
            actualizadoEn: fechaISO
        };

        if (estatus === 'confirmado' && lugar) {
            datosParaGuardar.mesa = lugar.mesa;
            datosParaGuardar.silla = lugar.silla;
        } else {
            datosParaGuardar.mesa = null;
            datosParaGuardar.silla = null;
        }

        let operacionFirebase;
        if (snapshot.exists()) {
            const claveDelAsistente = Object.keys(snapshot.val())[0];
            operacionFirebase = database.ref(`asistentes/${claveDelAsistente}`).update(datosParaGuardar);
        } else {
            datosParaGuardar.registradoEn = fechaISO;
            operacionFirebase = asistentesRef.push(datosParaGuardar);
        }

        try {
            await operacionFirebase;
            
            if (estatus === 'confirmado' && lugar) {
                 showSimpleAlert(
                    'success', 
                    '¡Confirmación Exitosa!', 
                    `Gracias por confirmar, ${nombreOriginal}. Nos encantara verte pronto.`
                );
            } else {
                 showSimpleAlert('success', '¡Gracias!', 'Tu respuesta se guardó correctamente.');
            }

            const nombreInput = document.getElementById('nombreInvitado');
            if (nombreInput) nombreInput.value = '';
            
            if (nombreDesdeURL) {
                setTimeout(() => {
                    window.location.href = window.location.pathname;
                }, 4000); 
            }

        } catch (error) {
            console.error("¡ERROR DE FIREBASE!", error);
            showSimpleAlert('error', 'Error', 'Ocurrió un problema al guardar tu respuesta.');
        }
    }

    // =================================================================================
    // EL RESTO DE TU CÓDIGO (GALERÍA, CUENTA REGRESIVA, ETC.) (sin cambios)
    // =================================================================================
    window.abrirLightbox = (imagen) => {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        if (lightbox && lightboxImg) {
            lightboxImg.src = imagen.src;
            lightbox.style.display = "flex";
        }
    }

    window.cerrarLightbox = () => {
        const lightbox = document.getElementById("lightbox");
        if (lightbox) {
            lightbox.style.display = "none";
        }
    }

    const toggle = document.querySelector(".menu-toggle");
    const links = document.querySelector(".menu-links");
    if (toggle && links) {
        toggle.addEventListener("click", () => links.classList.toggle("show"));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const nombreParam = urlParams.get('name');
    if (nombreParam) {
        nombreDesdeURL = nombreParam.trim();
        document.getElementById('saludo-principal').textContent = `¡${nombreDesdeURL}!`;
        document.getElementById('texto-introduccion').innerHTML = `Estamos muy contentos de invitarte a celebrar con nosotros. <strong>¡Esperamos que puedas acompañarnos!</strong> 💖💙`;
        document.getElementById('rsvp-normal').style.display = 'none';
        document.getElementById('rsvp-personalizado').style.display = 'block';
    }

    const fechaEvento = new Date(2025, 10, 22, 14, 0, 0).getTime();
    const countdownDiv = document.getElementById("countdown");
    if (countdownDiv) {
        const actualizarCuentaRegresiva = setInterval(() => {
            const ahora = new Date().getTime();
            const diferencia = fechaEvento - ahora;
            if (diferencia < 0) {
                clearInterval(actualizarCuentaRegresiva);
                if(document.getElementById("countdown")) {
                    document.getElementById("countdown").innerHTML = "¡El gran día ha llegado!";
                }
                return;
            }
            if(document.getElementById("dias")) {
                document.getElementById("dias").innerText = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                document.getElementById("horas").innerText = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                document.getElementById("minutos").innerText = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                document.getElementById("segundos").innerText = Math.floor((diferencia % (1000 * 60)) / 1000);
            }
        }, 1000);
    }

    const stackContainer = document.querySelector('#galeria-pila');
    if (stackContainer) {
        const stack = stackContainer.querySelector('.foto-stack');
        const fotoItems = stack.querySelectorAll('.foto-item');
        let currentIndex = 0;

        window.updateStack = () => {
            fotoItems.forEach((item, i) => {
                item.classList.remove('active', 'prev', 'next');
                const figcaption = item.querySelector('.foto-descripcion');
                if (figcaption) {
                    figcaption.style.opacity = '0';
                    figcaption.textContent = '';
                }
                if (i === currentIndex) {
                    item.classList.add('active');
                    if(figcaption && item.querySelector('img')) {
                        figcaption.textContent = item.querySelector('img').getAttribute('data-description');
                        figcaption.style.opacity = '1';
                    }
                } else if (i === (currentIndex - 1 + fotoItems.length) % fotoItems.length) {
                    item.classList.add('prev');
                } else if (i === (currentIndex + 1) % fotoItems.length) {
                    item.classList.add('next');
                }
            });
        }

        window.showNext = () => {
            currentIndex = (currentIndex + 1) % fotoItems.length;
            updateStack();
        }

        window.showPrev = () => {
            currentIndex = (currentIndex - 1 + fotoItems.length) % fotoItems.length;
            updateStack();
        }
        
        updateStack();
    }

    // --- (MODIFICADO) Generar iconos para TODAS las secciones ---
    const iconContainers = document.querySelectorAll('.icon-container'); // Selecciona TODOS los contenedores
    iconContainers.forEach(container => {
        // Llama a la función solo si el contenedor NO es el de revelación (ese se maneja arriba si es true)
        if(container.id !== 'revelacion-icon-container'){
             generarIconosFlotantes(container);
        }
    });
}


/**
 * (MODIFICADO)
 * Genera los iconos flotantes para un contenedor específico.
 * @param {HTMLElement} iconContainer - El elemento div donde se agregarán los iconos.
 */
function generarIconosFlotantes(iconContainer) {
    if (!iconContainer) return; // Salir si el contenedor no existe

    iconContainer.innerHTML = ''; // Limpiar por si acaso
    const iconCount = 10; // Cantidad de iconos por contenedor
    // SVGs de Corazón y Estrella
    const icons = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.04 3 5.5l7 7Z"/></svg>`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    ];

    for (let i = 0; i < iconCount; i++) {
        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add('floating-icon');
        iconWrapper.innerHTML = icons[Math.floor(Math.random() * icons.length)];

        // (MODIFICADO) Rango de tamaño aprox 20% más grande: 14px a 34px
        const size = Math.random() * 20 + 14; 
        iconWrapper.style.width = `${size}px`;
        iconWrapper.style.height = `${size}px`;
        iconWrapper.style.left = `${Math.random() * 100}%`;
        iconWrapper.style.bottom = `${Math.random() * 20 - 10}%`;
        iconWrapper.style.animationDelay = `${Math.random() * 5}s`;
        iconWrapper.style.animationDuration = `${Math.random() * 4 + 5}s`; // entre 5 y 9 segundos

        iconContainer.appendChild(iconWrapper);
    }
}