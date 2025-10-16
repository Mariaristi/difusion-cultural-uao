import { createCard } from './utils.js';
import { initCalendar } from './calendar.js';

// --- Funciones del modal ---
// Renderiza el contenido del modal
// --- Función actualizada para abrir modal con toda la información ---
export function renderEventoModal(evento) {
  const modalBody = document.getElementById("evento-modal-body");

  // Asignar imágenes individuales
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


// Función para mostrar el modal
export function abrirModalEvento() {
  const modal = document.getElementById("evento-modal");
  modal.style.display = "flex";
}


// Abre el modal según el título del evento
export function abrirModalEventoPorTitulo(titulo) {
  const ev = eventosDetalle.find(e => e.titulo === titulo);
  if (!ev) return;

  const imagenesAdicionales = ev.imagen1 ? [ev.imagen1] : [];

  renderEventoModal({
    ...ev,
    imagenesAdicionales
  });

  abrirModalEvento();
}

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

    if(destino === "preferencias") showMisPreferencias();
  });
});

// Contenedores
const cardsContainer = document.getElementById('cards-container');
const filteredContainer = document.getElementById('filtered-events');
const preferenciasContainer = document.getElementById("preferencias-container");

// Datos de filtros y eventos
let eventosFiltro = [];
let eventosDetalle = [];
let eventosMostrados = [];
let favoritos = [];

// Cargar archivos JSON
Promise.all([
  fetch('eventos.json').then(res => res.json()),
  fetch('eventos-detalle.json').then(res => res.json())
]).then(([filtros, detalles]) => {
  eventosFiltro = filtros;
  eventosDetalle = detalles;
  eventosMostrados = eventosDetalle;

  eventosFiltro.forEach(filtro => {
    filtro.cantidad = eventosDetalle.filter(ev => ev.clase === filtro.clase).length;
  });

  renderFiltroCards();
  initCalendar(eventosDetalle);
  renderEventos(eventosMostrados);
  renderEventosDestacados();
});

// Renderizar eventos destacados
function renderEventosDestacados() {
  const contenedor = document.querySelector('.right-featured-events');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  const eventosAleatorios = [...eventosDetalle].sort(() => 0.5 - Math.random()).slice(0, 5);

  eventosAleatorios.forEach(evento => {
    const card = document.createElement('div');
    card.classList.add('featured-event-card');

    const imgSrc = evento.imagen1 ? evento.imagen1 : 'Imagenes/default-evento.png';
    card.innerHTML = `
      <img src="${imgSrc}" alt="${evento.titulo}" class="featured-img">
      <div class="event-info">
        <h4 class="event-title">${evento.titulo || 'Evento sin título'}</h4>
        <p class="event-description">${evento.descripcion || 'Sin descripción disponible.'}</p>
      </div>
    `;

    // Abrir modal al hacer click en destacado
    card.addEventListener('click', () => {
      abrirModalEventoPorTitulo(evento.titulo);
    });

    contenedor.appendChild(card);
  });
}

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

  if (eventosFiltro.length > 0) {
    document.querySelector('.event-card').classList.add('active');
    showFilteredEvents(eventosFiltro[0].clase);
  }
}

// Mostrar eventos filtrados
function showFilteredEvents(clase) {
  const eventosFiltrados = eventosDetalle.filter(ev => ev.clase === clase);
  eventosMostrados = eventosFiltrados;
  renderEventos(eventosFiltrados);
}

// Renderizar eventos
function renderEventos(lista, container = filteredContainer) {
  container.innerHTML = '';

  if (lista.length === 0) {
    container.innerHTML = `<div class="no-results"><p>No se encontró nada con tu busqueda.</p></div>`;
    return;
  }

  lista.forEach(ev => {
    const div = document.createElement('div');
    div.classList.add('filtered-event-card');
    div.innerHTML = `
      <img src="${ev.imagen1}" alt="${ev.titulo}">
      <div class="event-info">
        <div class="event-header">
          <h3 class="event-title">${ev.titulo}</h3>
          <span class="material-symbols-outlined favorite-icon ${favoritos.includes(ev) ? 'active' : ''}">favorite</span>
        </div>
        <p class="event-description">${ev.descripcion}</p>
        <p class="event-date"><strong>Fecha:</strong> ${ev.fecha}</p>
        <p class="event-time"><strong>Hora:</strong> ${ev.hora}</p>
        <p class="event-location"><strong>Lugar:</strong> ${ev.lugar}</p>
      </div>
    `;

    // Abrir modal al hacer click en la tarjeta
    div.addEventListener('click', (e) => {
      if (e.target.classList.contains('favorite-icon')) return;
      abrirModalEventoPorTitulo(ev.titulo);
    });

    container.appendChild(div);
  });
}

// Búsqueda en vivo
const searchInput = document.querySelector(".search-container input");
searchInput.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  const activeScene = document.querySelector(".scene.active");

  let listaAFiltrar;
  let container;

  if (activeScene && activeScene.id === "scene-preferencias") {
    listaAFiltrar = favoritos;
    container = preferenciasContainer;
  } else {
    listaAFiltrar = eventosDetalle;
    container = filteredContainer;
  }

  if (!query) {
    renderEventos(listaAFiltrar, container);
    return;
  }

  const filtrados = listaAFiltrar.filter(ev =>
    ev.titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query) ||
    ev.descripcion.toLowerCase().includes(query) ||
    ev.fecha.toLowerCase().includes(query) ||
    ev.hora.toLowerCase().includes(query) ||
    ev.lugar.toLowerCase().includes(query)
  );

  renderEventos(filtrados, container);
});

// Marcar favoritos
filteredContainer.addEventListener("click", e => {
  if (e.target.classList.contains("favorite-icon")) {
    const card = e.target.closest(".filtered-event-card");
    const titulo = card.querySelector(".event-title").textContent;

    e.target.classList.toggle("active");
    const evento = eventosMostrados.find(ev => ev.titulo === titulo);

    if (e.target.classList.contains("active")) {
      if (evento && !favoritos.includes(evento)) {
        favoritos.push(evento);
        const clone = card.cloneNode(true);
        clone.querySelector(".favorite-icon").classList.add("active");
        preferenciasContainer.appendChild(clone);
      }
    } else {
      favoritos = favoritos.filter(ev => ev.titulo !== titulo);
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

// Cerrar el modal al hacer clic en la X o fuera del contenido
document.addEventListener("click", (e) => {
  const modal = document.getElementById("evento-modal");
  if (!modal) return;

  if (e.target.classList.contains("evento-modal-close") || e.target === modal) {
    modal.style.display = "none";
  }
});
