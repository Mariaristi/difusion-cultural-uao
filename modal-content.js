// --- Función para abrir modal (usada también en calendario) ---
export function renderEventoModal(evento) {
  const modalBody = document.getElementById("evento-modal-body");

  // Solo tomamos las imágenes que existan
  const img3 = evento.imagen3 ? `<img src="${evento.imagen3}" class="modal-img">` : '';
  const img1 = evento.imagen1 ? `<img src="${evento.imagen1}" class="modal-img">` : '';
  const img2 = evento.imagen2 ? `<img src="${evento.imagen2}" class="modal-img">` : '';

  // Crear contenido HTML de las descripciones extendidas si existen
  const descripciones = [
    evento.descripcionExtendida1,
    evento.descripcionExtendida2,
    evento.descripcionExtendida3,
    evento.descripcionExtendida4
  ].filter(desc => desc).map(desc => `<p>${desc}</p>`).join('');

  modalBody.innerHTML = `
    <h2>${evento.titulo}</h2>
    ${img3}
    ${img1}
    <p><strong>Público:</strong> ${evento.publico || 'No especificado'}</p>
    ${descripciones}
    ${img2}
  `;
}

export function abrirModalEvento() {
  const modal = document.getElementById("evento-modal");
  modal.style.display = "flex";
}
