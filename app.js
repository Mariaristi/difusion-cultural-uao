import { createCard } from './utils.js';
import { initCalendar } from './calendar.js';


// Toggle del drawer
const drawer = document.getElementById("drawer");
const menuBtn = document.getElementById("menu-btn");
const pageContent = document.getElementById("page-content");
const header = document.getElementById("header");

menuBtn.addEventListener("click", () => {
  drawer.classList.toggle("closed");
  pageContent.classList.toggle("shifted");
  header.classList.toggle("shifted");
});

// Cambiar escenas
document.querySelectorAll(".drawer-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".drawer-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");

    document.querySelectorAll(".scene").forEach(scene => scene.classList.remove("active"));
    const destino = item.getAttribute("data-target");
    document.getElementById("scene-" + destino).classList.add("active");

    // Si se cambia a Mis preferencias, renderizar favoritos allí
    if(destino === "preferencias") showMisPreferencias();
  });
});

// Contenedores
const cardsContainer = document.getElementById('cards-container');
const filteredContainer = document.getElementById('filtered-events');
const preferenciasContainer = document.getElementById("preferencias-container");

// Datos de filtros y eventos individuales
let eventosFiltro = [];
let eventosDetalle = [];
let eventosMostrados = [];
let favoritos = []; // aquí guardamos los eventos favoritos

// Cargar ambos archivos primero y luego renderizar
Promise.all([
  fetch('eventos.json').then(res => res.json()),
  fetch('eventos-detalle.json').then(res => res.json())
]).then(([filtros, detalles]) => {
  eventosFiltro = filtros;
  eventosDetalle = detalles;

  // Llenar eventosMostrados con todos los eventos al inicio
  eventosMostrados = eventosDetalle;

  // Actualizar cantidades dinámicamente
  eventosFiltro.forEach(filtro => {
    const cantidad = eventosDetalle.filter(ev => ev.clase === filtro.clase).length;
    filtro.cantidad = cantidad;
  });

  renderFiltroCards();

  // Renderizar todos los eventos al inicio
   initCalendar(eventosDetalle);
  renderEventos(eventosMostrados);
});

// Renderizar tarjetas de filtro
function renderFiltroCards() {
  cardsContainer.innerHTML = '';
  eventosFiltro.forEach(evento => {
    const card = createCard(evento.clase, evento.titulo, evento.descripcion, evento.cantidad);

    card.addEventListener('click', () => {
      document.querySelectorAll('.event-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      showFilteredEvents(evento.clase);
    });

    cardsContainer.appendChild(card);
  });

  // Selecciona la primera automáticamente
  if (eventosFiltro.length > 0) {
    document.querySelector('.event-card').classList.add('active');
    showFilteredEvents(eventosFiltro[0].clase);
  }
}

// Mostrar eventos filtrados por clase
function showFilteredEvents(clase) {
  const eventosFiltrados = eventosDetalle.filter(ev => ev.clase === clase);
  eventosMostrados = eventosFiltrados;
  renderEventos(eventosFiltrados);
}

// Renderizar eventos en el contenedor
function renderEventos(lista, container = filteredContainer) {
  container.innerHTML = '';

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No se encontró nada con tu busqueda.</p>
      </div>
    `;
    return;
  }

  lista.forEach(ev => {
    const div = document.createElement('div');
    div.classList.add('filtered-event-card');
    div.innerHTML = `
      <img src="${ev.imagen}" alt="${ev.titulo}">
      <div class="event-info">
        <div class="event-header">
          <h3 class="event-title">${ev.titulo}</h3>
          <span class="material-symbols-outlined favorite-icon ${favoritos.includes(ev) ? 'active' : ''}">favorite</span>
        </div>
        <p class="event-description">${ev.descripcion}</p>
        <p class="event-date">Fecha: ${ev.fecha}</p>
        <p class="event-time">Hora: ${ev.hora}</p>
        <p class="event-location">Lugar: ${ev.lugar}</p>
      </div>
    `;

    // 👇 Agregamos el listener para abrir el modal
div.addEventListener('click', (e) => {
  // Evitar que el click en el corazón active el modal
  if(e.target.classList.contains('favorite-icon')) return;

  abrirModalEvento(ev);
});
    container.appendChild(div);
  });
}

// Búsqueda en vivo sobre TODOS los eventos
const searchInput = document.querySelector(".search-container input");
searchInput.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();

  let listaAFiltrar = eventosDetalle; // TODOS los eventos

  if (!query) {
    renderEventos(listaAFiltrar);
    return;
  }

  const filtrados = listaAFiltrar.filter(ev =>
    ev.titulo.toLowerCase().includes(query) ||
    ev.descripcion.toLowerCase().includes(query) ||
    ev.fecha.toLowerCase().includes(query) ||
    ev.hora.toLowerCase().includes(query) ||
    ev.lugar.toLowerCase().includes(query)
  );

  renderEventos(filtrados);
});

// Marcar favoritos al hacer click en el corazón
filteredContainer.addEventListener("click", e => {
  if (e.target.classList.contains("favorite-icon")) {
    const card = e.target.closest(".filtered-event-card");
    const titulo = card.querySelector(".event-title").textContent;

    e.target.classList.toggle("active");

    const evento = eventosMostrados.find(ev => ev.titulo === titulo);

    if (e.target.classList.contains("active")) {
      if (evento && !favoritos.includes(evento)) {
        favoritos.push(evento);

        // Clonar la tarjeta y agregarla a Mis preferencias
        const clone = card.cloneNode(true);
        clone.querySelector(".favorite-icon").classList.add("active");
        preferenciasContainer.appendChild(clone);
      }
    } else {
      favoritos = favoritos.filter(ev => ev.titulo !== titulo);

      // Quitar tarjeta de Mis preferencias
      Array.from(preferenciasContainer.children).forEach(c => {
        const t = c.querySelector(".event-title").textContent;
        if (t === titulo) c.remove();
      });
    }
  }
});

// Mostrar favoritos en "Mis preferencias"
function showMisPreferencias() {
  preferenciasContainer.innerHTML = '';
  if (favoritos.length === 0) {
    preferenciasContainer.innerHTML = `<p class="no-results">Aún no tienes eventos en tus preferencias</p>`;
    return;
  }
  renderEventos(favoritos, preferenciasContainer);
}

// === FUNCIONALIDAD DEL MODAL DE EVENTO ===

// Función que abre el modal con la información del evento
export function abrirModalEvento(evento) {
  const modal = document.getElementById("evento-modal");
  const modalBody = document.getElementById("evento-modal-body");

  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <h2>${evento.titulo}</h2>
    <p><strong>Hora:</strong> ${evento.hora}</p>
    <p><strong>Fecha:</strong> ${evento.fecha}</p>
    <p><strong>Lugar:</strong> ${evento.lugar}</p>
    <p><strong>Descripción:</strong> ${evento.descripcion}</p>
    <p><strong>Categoría:</strong> ${evento.clase}</p>
  `;

  modal.style.display = "flex";
}

// Cerrar el modal al hacer clic en la X o fuera del contenido
document.addEventListener("click", (e) => {
  const modal = document.getElementById("evento-modal");
  if (!modal) return;

  if (e.target.classList.contains("evento-modal-close") || e.target === modal) {
    modal.style.display = "none";
  }
});


