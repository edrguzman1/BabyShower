

    function confirmarAsistencia(e) {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value.trim();
      alert("¡Gracias por confirmar, " + nombre + "! Nos encantará verte 🎉");
    }

function abrirLightbox(imagen) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = imagen.src;
  lightbox.style.display = "flex";
}

function cerrarLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".menu-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("show");
    });
  } else {
    console.warn("❗ No se encontró .menu-toggle o .menu-links");
  }
});





const stackContainer = document.querySelector('#galeria-pila');
  const stack = stackContainer.querySelector('.foto-stack');
  const fotoItems = stack.querySelectorAll('.foto-item');

  let currentIndex = 0;

  function updateStack() {
    fotoItems.forEach((item, i) => {
      item.classList.remove('active', 'prev', 'next');
      const figcaption = item.querySelector('.foto-descripcion');
      
      figcaption.style.opacity = '0';
      figcaption.textContent = '';


      if (i === currentIndex) {
        item.classList.add('active');
        figcaption.textContent = item.querySelector('img').getAttribute('data-description');
        figcaption.style.opacity = '1';

      } else if (i === currentIndex - 1) {
        item.classList.add('prev');
      } else if (i === currentIndex + 1) {
        item.classList.add('next');
      }
    });
  }

  function showNext() {
    if (currentIndex < fotoItems.length - 1) {
      currentIndex++;
      updateStack();
    }
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateStack();
    }
  }

  // Soporte para gestos táctiles
  let startX = 0;

  stackContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  stackContainer.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 50) showPrev();
    else if (diff < -50) showNext();
  });

  updateStack(); // Inicializar al cargar



  const firebaseConfig = {
    apiKey: "AIzaSyDDJ0UmA5giAjFbz54JqaudKFOBfEv613U",
    authDomain: "babyshowerguzmanmiranda.firebaseapp.com",
    databaseURL: "https://babyshowerguzmanmiranda-default-rtdb.firebaseio.com",
    projectId: "babyshowerguzmanmiranda",
    storageBucket: "babyshowerguzmanmiranda.firebasestorage.app",
    messagingSenderId: "564665563453",
    appId: "1:564665563453:web:242aaba73a4768fa89ad54"
  };

// 2. Inicializa la aplicación de Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 3. Función corregida para registrar o actualizar la asistencia
function registrarAsistencia(nuevoEstatus) {
    console.log(`Función iniciada con estatus: ${nuevoEstatus}`);
    const nombreInput = document.getElementById('nombreInvitado');
    const nombre = nombreInput.value.trim();

    if (nombre === '') {
        alert('Por favor, escribe tu nombre.');
        return;
    }

    const asistentesRef = database.ref('asistentes');

    // Paso 1: Leemos TODOS los asistentes una sola vez.
    // Sabemos que esto funciona gracias a la prueba anterior.
    asistentesRef.once('value')
        .then(snapshot => {
            let asistenteExistente = null;
            let claveDelAsistente = null;

            // Paso 2: Usamos JavaScript para buscar el nombre.
            // snapshot.forEach() es la forma de recorrer los resultados en Firebase.
            snapshot.forEach(childSnapshot => {
                const asistente = childSnapshot.val();
                if (asistente.nombre === nombre) {
                    asistenteExistente = asistente;
                    claveDelAsistente = childSnapshot.key;
                }
            });

            // Paso 3: Decidimos si actualizar o crear.
            if (asistenteExistente) {
                // CASO 1: El nombre se encontró. Lo actualizamos.
                console.log(`Nombre encontrado. Actualizando el estatus del asistente con clave: ${claveDelAsistente}`);
                return database.ref(`asistentes/${claveDelAsistente}`).update({
                    estatus: nuevoEstatus,
                    actualizadoEn: new Date().toISOString()
                });
            } else {
                // CASO 2: El nombre es nuevo. Creamos un registro.
                console.log("Nombre no encontrado. Creando nuevo asistente.");
                return asistentesRef.push({
                    nombre: nombre,
                    estatus: nuevoEstatus,
                    registradoEn: new Date().toISOString()
                });
            }
        })
        .then(() => {
            console.log("¡Éxito! La escritura en la base de datos funcionó.");
            alert('¡Gracias! Tu respuesta se guardó correctamente.');
            nombreInput.value = '';
        })
        .catch(error => {
            console.error("¡ERROR DE FIREBASE!", error);
            alert("Ocurrió un error inesperado. Revisa la consola (F12).");
        });
}

// --- CÓDIGO PARA LA CUENTA REGRESIVA ---
document.addEventListener('DOMContentLoaded', () => {
    // Fecha del evento (Año, Mes (0-11), Día, Hora, Minuto, Segundo)
    const fechaEvento = new Date(2025, 10, 22, 14, 0, 0).getTime();

    const actualizarCuentaRegresiva = setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = fechaEvento - ahora;

        if (diferencia < 0) {
            clearInterval(actualizarCuentaRegresiva);
            document.getElementById("countdown").innerHTML = "¡El gran día ha llegado!";
            return;
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        document.getElementById("dias").innerText = dias;
        document.getElementById("horas").innerText = horas;
        document.getElementById("minutos").innerText = minutos;
        document.getElementById("segundos").innerText = segundos;

    }, 1000);
});

