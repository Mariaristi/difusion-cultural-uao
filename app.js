document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("modal-overlay");
  const nextBtn = document.getElementById("next-btn");
  const chipSet = document.querySelector("md-chip-set");

  nextBtn.addEventListener("click", () => {
    // Obtiene todos los chips seleccionados
    const selectedChips = Array.from(chipSet.querySelectorAll("md-filter-chip[selected]"))
      .map(chip => chip.getAttribute("value"));

    // ✅ Aquí guardamos o mostramos lo que eligió el usuario
    console.log("Preferencias del usuario:", selectedChips);

    // Oculta modal y quita blur del fondo
    overlay.style.display = "none";
    document.getElementById("page-content").style.filter = "none";

    // Ejemplo: Mostrar en la página principal lo seleccionado
    const pageContent = document.getElementById("page-content");
    const result = document.createElement("p");
    result.textContent = "Tus intereses: " + selectedChips.join(", ");
    pageContent.appendChild(result);
  });
});

