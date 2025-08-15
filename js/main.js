

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


async function confirmarAsistencia(event) {
  event.preventDefault();

  const nombreInvitado = document.getElementById("nombre");
  const feedback = getOrCreateFeedbackElement();
  const boton = getOrCreateSubmitButton();

  const nombre = nombreInvitado.value;
  if (!nombre.trim()) {
    feedback.textContent = "Por favor escribe tu nombre."; 
    feedback.style.color = "red";
    return;
  }

  // Deshabilita el botón mientras se procesa
  boton.disabled = true;
  feedback.textContent = "Enviando...";
  feedback.style.color = "black";

  try {
    // Guarda el nombre en un nodo llamado 'asistentes'
    // push() crea un ID único para cada confirmación
    //console.log(`Intentando guardar: ${nombre}`); // Ayuda para depurar
    database.ref('asistentes').push({
        nombre: nombre,
        confirmadoEn: new Date().toISOString()
    })
    .then(() => {
        alert('¡Gracias por confirmar tu asistencia!');
        nombreInput.value = ''; // Limpia el campo después de confirmar
    })
    .catch((error) => {
        console.error("Error al guardar la confirmación: ", error);
        alert('Ocurrió un error. Por favor, intenta de nuevo.');
    });
  } catch (error) {
    console.error("Error al consumir el servicio:", error);

    feedback.textContent = `Error: ${error.message}`;
    feedback.style.color = "red";

  } finally {
    boton.disabled = false;
  }
}

/**
 * Crea o retorna el elemento de feedback debajo del formulario.
 */
function getOrCreateFeedbackElement() {
  let feedback = document.getElementById("rsvp-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "rsvp-feedback";
    feedback.style.marginTop = "8px";
    feedback.style.fontWeight = "500";
    const form = document.querySelector("form");
    form.parentNode.insertBefore(feedback, form.nextSibling);
  }
  return feedback;
}

/**
 * Intenta obtener el botón submit del formulario, o lo crea si no existe.
 */
function getOrCreateSubmitButton() {
  const form = document.querySelector("form");
  if (!form) return null;

  let button = form.querySelector('button[type="submit"], input[type="submit"]');
  if (!button) {
    button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Enviar";
    form.appendChild(button);
  }
  return button;
}

// Auto-engancha al formulario cuando cargue la página.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", confirmarAsistencia);
  } else {
    console.warn("No se encontró <form> en la página para enlazar confirmarAsistencia.");
  }
});

