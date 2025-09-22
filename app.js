fetch("eventos.json")
  .then(respuesta => respuesta.json())
  .then(eventos => {
    const contenedor = document.getElementById("eventos");
    eventos.forEach(ev => {
      const card = document.createElement("div");
      card.innerHTML = `
        <h2>${ev.titulo}</h2>
        <p><b>Fecha:</b> ${ev.fecha} - ${ev.hora}</p>
        <p><b>Lugar:</b> ${ev.lugar}</p>
        <p>${ev.descripcion}</p>
        <hr>
      `;
      contenedor.appendChild(card);
    });
  });