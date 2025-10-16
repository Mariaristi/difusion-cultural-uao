// calendar.js
export function initCalendar(events = []) {
  const container = document.querySelector('#scene-calendario .dashboard');
  if (!container) return;

  // Crear contenedor
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
      // date.date.marker es usado en tu versión; lo dejamos como estaba
      const mes = meses[date.date.marker.getMonth()];
      
      const año = date.date.marker.getFullYear();
      return `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${año}`;
    },
    dayHeaderContent: (arg) => {
      const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      return dias[arg.date.getUTCDay()];
    },

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

    eventDisplay: 'block',
    eventMinHeight: 50,

    events: events.map(ev => ({
      title: ev.titulo,
      start: convertirFecha(ev.fecha, ev.hora),
      extendedProps: {
        hora: ev.hora,
        descripcion: ev.descripcion,
        lugar: ev.lugar,
        clase: ev.clase
      }
    })),

  eventClick: function(info) {
    info.jsEvent.preventDefault(); // evita comportamiento por defecto
    abrirModalEventoPorTitulo(info.event.title);
  }

  }); // <-- cierra new FullCalendar.Calendar(...)

  calendar.render();
} // <-- cierra export function initCalendar(...)

// Conversión dd/mm/yyyy → formato ISO
function convertirFecha(fechaStr, horaStr = '00:00') {
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
