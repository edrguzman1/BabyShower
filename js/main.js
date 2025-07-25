

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

