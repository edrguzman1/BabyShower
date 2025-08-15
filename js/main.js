

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





  const stack = document.querySelector('.foto-stack');
  const images = stack.querySelectorAll('img');

  // Asignamos índice para aplicar rotaciones
  images.forEach((img, i) => {
    img.setAttribute('data-index', i);
  });

  let currentIndex = 0;

  function updateStack() {
    images.forEach((img, i) => {
      img.classList.remove('active', 'prev', 'next');

      if (i === currentIndex) {
        img.classList.add('active');
      } else if (i === currentIndex - 1) {
        img.classList.add('prev');
      } else if (i === currentIndex + 1) {
        img.classList.add('next');
      }
    });
  }

  function showNext() {
    if (currentIndex < images.length - 1) {
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

  stack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  stack.addEventListener('touchend', (e) => {
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

        // 3. Esta es la función que tu formulario llamará
        function confirmarAsistencia(event) {
            event.preventDefault(); 
            
            const nombreInvitado = document.getElementById('nombreInvitado');
            const nombre = nombreInvitado.value;

            if (nombre.trim() === '') {
                alert('Por favor, escribe tu nombre para confirmar.');
                return;
            }

            // Referencia al nodo de 'asistentes'
            const asistentesRef = database.ref('asistentes');

            // BUSCAMOS un asistente que tenga exactamente ese nombre
            asistentesRef.orderByChild('nombre').equalTo(nombre).once('value', (snapshot) => {
                
                if (snapshot.exists()) {
                    // -- CASO 1: El nombre YA EXISTE, así que lo actualizamos --
                    const updates = {};
                    // Obtenemos la clave única (key) del registro encontrado
                    const key = Object.keys(snapshot.val())[0];
                    
                    // Preparamos la actualización para cambiar solo el estatus y la fecha
                    updates[`/asistentes/${key}/estatus`] = nuevoEstatus;
                    updates[`/asistentes/${key}/actualizadoEn`] = new Date().toISOString();

                    database.ref().update(updates)
                        .then(() => {
                            alert('¡Gracias! Hemos actualizado tu estado de asistencia.');
                            nombreInvitado.value = '';
                        });

                } else {
                    // -- CASO 2: El nombre NO EXISTE, así que creamos un nuevo registro --
                    asistentesRef.push({
                        nombre: nombre,
                        estatus: nuevoEstatus,
                        registradoEn: new Date().toISOString()
                    })
                    .then(() => {
                        alert('¡Gracias por confirmar tu asistencia!');
                        nombreInvitado.value = '';
                    })
                    .catch((error) => {
                        console.error("Error al guardar el nuevo registro: ", error);
                        alert('Ocurrió un error al guardar tu respuesta.');
                    });
                }
            });
        }
