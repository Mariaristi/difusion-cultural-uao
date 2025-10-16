// Función para abrir modal 

export function renderEventoModal(evento) {
  const modalBody = document.getElementById("evento-modal-body");

  // Imagenes
  const img1 = evento.imagen1 ? `<img src="${evento.imagen1}" class="modal-img">` : '';
  const img2 = evento.imagen2 ? `<img src="${evento.imagen2}" class="modal-img">` : '';
  const img3 = evento.imagen3 ? `<img src="${evento.imagen3}" class="modal-img">` : '';
  const img4 = evento.imagen4 ? `<img src="${evento.imagen4}" class="modal-img">` : ''; 
  const img5 = evento.imagen5 ? `<img src="${evento.imagen5}" class="modal-img">` : '';  
  // Modal
  modalBody.innerHTML = `
    <h2>${evento.titulo}</h2>
    ${img3}
    ${img1}
    ${img4}   
    ${img5}
    ${img2}
  `;
}
