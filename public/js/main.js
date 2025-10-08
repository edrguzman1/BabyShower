// --- LÓGICA DEL LOADER ALEATORIO (SE EJECUTA AL INICIO) ---
document.addEventListener('DOMContentLoaded', function() {
    
    // Lista de todos tus archivos de loaders
    const loaderFiles = [
        'Biberon.html',
        'BloquesBaby.html',
        'Cigueña.html',
        'Cochecito.html',
        'HorneandoAlgo.html',
        'Lluvia.html',
        'Luna.html',
        'Milagro.html',
        'Patito.html',
        'Rehilete.html',
        'Saltando.html',
        'Sonajero.html',
        'Tendedero.html'
    ];
    
    // Elige un loader al azar
    const randomLoaderFile = loaderFiles[Math.floor(Math.random() * loaderFiles.length)];
    const loaderWrapper = document.getElementById('loader-wrapper');

    // Carga el HTML del loader elegido y lo inserta en la página
    if (loaderWrapper && randomLoaderFile) {
        fetch(`loaders/${randomLoaderFile}`)
            .then(response => {
                if (!response.ok) throw new Error("Error al cargar el loader: " + response.statusText);
                return response.text();
            })
            .then(html => {
                if (html.trim().length > 0) {
                    loaderWrapper.innerHTML = html;
                } else {
                    // Si el archivo está vacío, oculta el wrapper y continúa
                    hideLoaderAndInitPage();
                }
            })
            .catch(error => {
                console.error('No se pudo cargar el loader:', error);
                hideLoaderAndInitPage();
            });
    } else {
        // Si no hay wrapper o archivo, inicia la página directamente
        initPageFunctions();
    }

    // Oculta el loader después de un tiempo mínimo
    const minimumLoaderTime = 5000;
    setTimeout(hideLoaderAndInitPage, minimumLoaderTime);

    function hideLoaderAndInitPage() {
        if (loaderWrapper && loaderWrapper.style.display !== 'none') {
            loaderWrapper.classList.add('hidden');
            setTimeout(() => {
                if (loaderWrapper) loaderWrapper.style.display = 'none';
                initPageFunctions();
            }, 1500); // Duración de la transición en CSS
        } else {
            initPageFunctions();
        }
    }
});

// --- FUNCIÓN QUE INICIALIZA TODO EL JAVASCRIPT DE LA PÁGINA ---
function initPageFunctions() {
    // Esta bandera evita que la función se ejecute más de una vez
    if (window.pageInitialized) return;
    window.pageInitialized = true;

    console.log("Inicializando funciones de la página...");

    // =================================================================================
    // AQUÍ COMIENZA TODO TU CÓDIGO ORIGINAL (MODAL, FIREBASE, GALERÍA, ETC.)
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
        error: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,95 C74.85,95 95,74.85 95,50 C95,25.15 74.85,5 50,5 C25.15,5 5,25.15 5,50 C5,74.85 25.15,95 50,95 Z" fill="#fee2e2"/><path d="M50 67.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="#ef4444"/><path d="M47,30v25c0,1.7,1.3,3,3,3s3-1.3,3-3V30c0-1.7-1.3-3-3-3S47,28.3,47,30z" fill="#ef4444"/><circle cx="35" cy="25" r="4" fill="#fca5a5"/><circle cx="65" cy="25" r="4" fill="#fca5a5"/></svg>`
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
    const database = firebase.database();

    function normalizarNombre(nombre) {
        if (!nombre) return '';
        return nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
    }

    window.registrarAsistencia = (nuevoEstatus) => {
        const nombreInput = document.getElementById('nombreInvitado');
        let nombreOriginal = nombreDesdeURL || (nombreInput ? nombreInput.value.trim() : '');
        if (nombreOriginal === '') {
            showSimpleAlert('error', '¡Oh, no!', 'Por favor, escribe tu nombre antes de confirmar.');
            return;
        }
        const nombreNormalizado = normalizarNombre(nombreOriginal);
        const nombreParaGuardar = nombreOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const esConfirmacion = nuevoEstatus === 'confirmado';
        const config = {
            type: esConfirmacion ? 'success' : 'error',
            title: esConfirmacion ? '¿Confirmas tu asistencia?' : '¿No podrás asistir?',
            message: esConfirmacion ? `¡Qué alegría, ${nombreOriginal}! Te esperamos.` : `Lamentaremos no verte, ${nombreOriginal}. ¿Estás seguro?`,
            onConfirm: () => {
                const asistentesRef = database.ref('asistentes');
                asistentesRef.once('value').then(snapshot => {
                    let claveDelAsistente = null;
                    snapshot.forEach(childSnapshot => {
                        const nombreEnDBNormalizado = normalizarNombre(childSnapshot.val().nombre);
                        if (nombreEnDBNormalizado === nombreNormalizado) {
                            claveDelAsistente = childSnapshot.key;
                        }
                    });
                    if (claveDelAsistente) {
                        return database.ref(`asistentes/${claveDelAsistente}`).update({ estatus: nuevoEstatus, actualizadoEn: new Date().toISOString() });
                    } else {
                        return asistentesRef.push({ nombre: nombreParaGuardar, estatus: nuevoEstatus, registradoEn: new Date().toISOString() });
                    }
                }).then(() => {
                    showSimpleAlert('success', '¡Gracias!', 'Tu respuesta se guardó correctamente.', () => {
                        if (nombreDesdeURL) {
                            window.location.href = window.location.pathname;
                        }
                    });
                    if(nombreInput) nombreInput.value = '';
                }).catch(error => {
                    console.error("¡ERROR DE FIREBASE!", error);
                    showSimpleAlert('error', 'Error', 'Ocurrió un problema al guardar tu respuesta.');
                });
            },
            onCancel: () => console.log("El usuario canceló la operación desde el modal.")
        };
        showCustomConfirm(config);
    }

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
}