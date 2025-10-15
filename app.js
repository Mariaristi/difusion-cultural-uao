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

  // Contenido manual para cada evento
  const contenidoModal = {
    "La UAO se mueve con la Carrera Atlética 2025": `
      <h2 style="color: red;">Carrera Atlética 2025</h2>
      <p>Únete a esta carrera atlética para fomentar la integración y el bienestar físico.</p>
      <p>Lugar: Arco Central</p>
    `,
    "10º Encuentro de Clubes de Lectura": `
      <h2 style="color: blue;">Clubes de Lectura</h2>
      <p>Intercambio de experiencias sobre fomento a la lectura.</p>
      <p>Lugar: Auditorio Xepia</p>
    `,
    "Zentangles: arte que relaja e inspira": `
      <h2 style="color: purple;">Zentangles</h2>
      <p>Exposición de obras con la técnica Zentangle, que promueve la relajación y creatividad.</p>
      <p>Lugar: CRAI</p>
    `,
    "¡La salsa vibra en la UAO!": `
      <h2 ">Concierto de Salsa</h2>
      <p>Homenaje a Cheo Feliciano y Rubén Blades con música en vivo.</p>
      <p>Lugar: Auditorio Quincha</p>
      <p>Disfruta de un concierto en homenaje a grandes exponentes de la salsa.,
      La orquesta y los bailarines invitados harán que el público viva la experiencia con energía y ritmo.,
      Habrá también una sección educativa sobre la historia y evolución de la salsa en Latinoamérica."</p>
    `,
    "Taller de lectura virtual: El buen mal": `
      <h2 style="color: teal;">Taller Virtual</h2>
      <p>Taller en línea para compartir y disfrutar la lectura.</p>
      <p>Lugar: Modalidad virtual</p>
    `,
    "Café UAO: Día de Amor y Amistad": `
      <h2 style="color: pink;">Café UAO</h2>
      <p>Evento cultural con música, arte y convivencia.</p>
      <p>Lugar: Centro Cultural y Deportivo UAO</p>
    `,
    "Día Internacional de los Museos": `
      <h2 style="color: green;">Museos</h2>
      <p>Jornada con arte, mapping y museo virtual.</p>
      <p>Lugar: Museo Lili</p>
    `,
    "Festival de Colores y Sonidos": `
      <h2 style="color: fuchsia;">Festival de Colores</h2>
      <p>Fusión de arte y música en vivo.</p>
      <p>Lugar: Auditorio Xepia</p>
    `,
    "El Escritor al Aula": `
      <h2 style="color: brown;">Conversatorio Literario</h2>
      <p>Encuentro con el autor Humberto Jarrín.</p>
      <p>Lugar: Salón 3406</p>
    `,
    "Exposición fotográfica AVE": `
      <h2 style="color: navy;">Exposición AVE</h2>
      <p>Fotografías sobre sostenibilidad y ecología.</p>
      <p>Lugar: Sala de exposiciones CRAI</p>
    `
    // Puedes seguir agregando los demás eventos de la misma forma
  };

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
        <p class="event-date">Fecha: ${ev.fecha}</p>
        <p class="event-time">Hora: ${ev.hora}</p>
        <p class="event-location">Lugar: ${ev.lugar}</p>
      </div>
    `;

    // 👇 Listener para abrir modal con contenido manual
    div.addEventListener('click', (e) => {
      if(e.target.classList.contains('favorite-icon')) return;

      const modalBody = document.getElementById("evento-modal-body");
      modalBody.innerHTML = contenidoModal[ev.titulo] || "<p>Información no disponible</p>";

      abrirModalEvento();
    });

    container.appendChild(div);
  });
}


// Búsqueda en vivo sobre TODOS los eventos
// Búsqueda en vivo sobre TODOS los eventos o favoritos según la escena activa
const searchInput = document.querySelector(".search-container input");
searchInput.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  const activeScene = document.querySelector(".scene.active"); // 🧠 detectar escena activa

  // Definir lista base y contenedor dependiendo de la escena activa
  let listaAFiltrar;
  let container;

  if (activeScene && activeScene.id === "scene-preferencias") {
    // Escena de Mis preferencias
    listaAFiltrar = favoritos;
    container = preferenciasContainer;
  } else {
    // Escena de Eventos (por defecto)
    listaAFiltrar = eventosDetalle;
    container = filteredContainer;
  }

  // Si no hay texto, mostrar todos los eventos o favoritos
  if (!query) {
    renderEventos(listaAFiltrar, container);
    return;
  }

  // Filtrado general
  const filtrados = listaAFiltrar.filter(ev =>
    ev.titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query) ||
    ev.descripcion.toLowerCase().includes(query) ||
    ev.fecha.toLowerCase().includes(query) ||
    ev.hora.toLowerCase().includes(query) ||
    ev.lugar.toLowerCase().includes(query)
  );

  renderEventos(filtrados, container);
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

// Función que solo cambia el contenido del modal
export function renderEventoModal(evento) {
  const modalBody = document.getElementById("evento-modal-body");
  if (!modalBody) return;

  modalBody.innerHTML = `
    <h2>${evento.titulo}</h2>
    <p><strong>Hora:</strong> ${evento.hora}</p>
    <p><strong>Fecha:</strong> ${evento.fecha}</p>
    <p><strong>Lugar:</strong> ${evento.lugar}</p>
    <p>${evento.descripcion}</p>
    <div class="imagenes-extra">
      ${evento.imagenesAdicionales.map(img => `<img src="${img}" alt="${evento.titulo}">`).join('')}
    </div>
  `;
}

// Función que solo muestra el modal
export function abrirModalEvento() {
  const modal = document.getElementById("evento-modal");
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


