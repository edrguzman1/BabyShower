

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



  //Consumo de Servicio WEB

// script.js

// script.js

// Configuración: ajusta si cambia el puerto o ruta
const API_URL = "http://192.168.68.109/ServicioBabyShower/api/strings/process";

/**
 * Función principal que se dispara al enviar el formulario.
 */
async function confirmarAsistencia(event) {
  event.preventDefault();

  const nombreInput = document.getElementById("nombre");
  const feedback = getOrCreateFeedbackElement();
  const boton = getOrCreateSubmitButton();

  const nombre = nombreInput.value.trim();
  if (!nombre) {
    feedback.textContent = "Por favor escribe tu nombre."; 
    feedback.style.color = "red";
    return;
  }

  // Deshabilita el botón mientras se procesa
  boton.disabled = true;
  feedback.textContent = "Enviando...";
  feedback.style.color = "black";

  // Log de diagnóstico básico
  console.log("Origen de la página:", window.location.origin);
  console.log("Endpoint objetivo:", API_URL);
  console.log("Payload:", { Input: nombre });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Input: nombre })
    });

    console.log("Status HTTP:", response.status);

    if (!response.ok) {
      // Trata de leer cuerpo de error
      let serverMessage = "";
      try {
        const json = await response.json();
        serverMessage = JSON.stringify(json);
      } catch {
        serverMessage = await response.text();
      }
      throw new Error(`HTTP ${response.status}: ${serverMessage || response.statusText}`);
    }

    const result = await response.json();
    console.log("Respuesta válida del servidor:", result);

    feedback.textContent = `Asistencia confirmada: "${result.Result}"`;
    feedback.style.color = "green";
    nombreInput.value = "";
  } catch (error) {
    console.error("Error al consumir el servicio:", error);

    // Mensaje personalizado para casos comunes
    if (error.message === "Failed to fetch" || error.message.toLowerCase().includes("failed to fetch")) {
      feedback.innerHTML = `
        <div>
          <div>Error: no se pudo conectar con el servicio.</div>
          <ul style="margin:4px 0;padding-left:16px">
            <li>Verifica que el servicio esté corriendo en <code>${API_URL}</code>.</li>
            <li>Si usas HTTPS con certificado autofirmado, abre esa URL directa en el navegador y confía el certificado.</li>
            <li>Revisa la consola DevTools → pestaña Network para ver si la petición salió o fue bloqueada (CORS / mixed content).</li>
          </ul>
        </div>`;
    } else {
      feedback.textContent = `Error: ${error.message}`;
    }
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

