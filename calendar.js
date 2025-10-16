
// calendar.js
export function initCalendar(events = []) {
  const container = document.querySelector('#scene-calendario .dashboard');
  if (!container) return;

  // Limpia y crea un contenedor
  container.innerHTML = '';
  const calDiv = document.createElement('div');
  calDiv.id = 'uao-calendar';
  container.appendChild(calDiv);

  // Inicializar FullCalendar
const calendar = new FullCalendar.Calendar(calDiv, {
  initialView: 'dayGridMonth',
  height: 'auto',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  buttonText: {
    month: 'Mes',
    week: 'Semana'
  },
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  },
  titleFormat: (date) => {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const mes = meses[date.date.marker.getMonth()];
    const año = date.date.marker.getFullYear();
    return `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${año}`;
  },
  dayHeaderContent: (arg) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[arg.date.getUTCDay()];
  },

  // Contenido de los eventos 
  eventContent: function(arg) {
    const hora = arg.event.extendedProps.hora || '';
    const titulo = arg.event.title || '';

    const horaEl = document.createElement('div');
    horaEl.classList.add('fc-event-time');
    horaEl.innerText = hora;

    const tituloEl = document.createElement('div');
    tituloEl.classList.add('fc-event-title');
    tituloEl.innerText = titulo;

    return { domNodes: [horaEl, tituloEl] };
  },

  // Configuración general de eventos 
  eventDisplay: 'block',
  eventMinHeight: 50,
  eventOverlap: false,   
  slotMinHeight: 70,  
  allDaySlot: false,

  views: {
    timeGridWeek: {
      slotEventOverlap: false, // apila eventos verticalmente
      eventMinHeight: 50,
    }
  },

  //Eventos
  events: events
    .filter(ev => ev.titulo)
    .map(ev => ({
      title: ev.titulo,
      start: convertirFecha(ev.fecha, ev.hora),
      extendedProps: {
        hora: ev.hora || '',
        fecha: ev.fecha || ''
      }
    }))
});

calendar.render();

// Altura semana
function ajustarAlturaSemana() {
  const dias = document.querySelectorAll('.fc-timegrid-col');
  dias.forEach(dia => {
    const eventos = dia.querySelectorAll('.fc-timegrid-event');
    const alturaBase = 70; // slotMinHeight
    dia.style.height = `${alturaBase * (eventos.length + 1)}px`;
  });
}

// Ejecutar ajuste después de renderizar
ajustarAlturaSemana();
}


// Conversión dd/mm/yyyy - ISO string 
function convertirFecha(fechaStr, horaStr = '00:00') {
  if (!fechaStr) return new Date().toISOString(); // fallback
  const [d, m, y] = fechaStr.split('/');
  let [hora, periodo] = (horaStr || '').split(' ');
  let [h, min] = (hora || '0:00').split(':');
  h = parseInt(h);
  min = min || '00';

  if (periodo && periodo.toUpperCase() === 'PM' && h < 12) h += 12;
  if (periodo && periodo.toUpperCase() === 'AM' && h === 12) h = 0;

  const hora24 = `${h.toString().padStart(2, '0')}:${min}`;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${hora24}`;
}
