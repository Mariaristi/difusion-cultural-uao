// utils.js

// Crea una tarjeta de tipo de evento
export function createCard(clase, titulo, descripcion, cantidad) {
  const card = document.createElement('div');
  card.classList.add('event-card', clase);
  card.innerHTML = `
    <h2>${titulo}</h2>
    <p class="event-desc">${descripcion}</p>
    <p class="event-count">${cantidad} eventos</p>
  `;
  return card;
}
