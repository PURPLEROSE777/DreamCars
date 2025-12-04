// ==========================================================
// cargarMarcas.js
// Carga dinámicamente todas las marcas desde Supabase
// ==========================================================

// Inicializar el cliente Supabase
const supabaseUrl = 'https://afhjlxljgwmkdnltoeie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaGpseGxqZ3dta2RubHRvZWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MjE1MzMsImV4cCI6MjA3ODI5NzUzM30.sTn0VsJC7sYGRZd7Yv5UfKMqs5s6-eRFDBJ0nf0J7Us';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ----------------------------------------------------------
// Cargar marcas automáticamente al cargar la página
// ----------------------------------------------------------
async function cargarMarcas() {
  try {
    // Traer todo ordenado alfabéticamente
    const { data, error } = await supabase
      .from("marcas")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al obtener marcas:", error);
      return;
    }

    // Contenedor donde van las cards
    const contenedor = document.querySelector(".marcas");

    // Por si había contenido estático
    contenedor.innerHTML = "";

    // Crear cada card dinámicamente
    data.forEach(marca => {
      const card = document.createElement("article");
      card.classList.add("card", "reveal");
      card.id = marca.slug;

      card.innerHTML = `
        <div class="card-text">
          <h2>${marca.nombre}</h2>
          <p>${marca.descripcion}</p>
          <p><strong>Ícono:</strong> ${marca.icono} (${marca.anio_icono})</p>
        </div>
        <div class="card-img">
          <img src="${marca.imagen_url}" alt="${marca.icono}">
        </div>
      `;

      contenedor.appendChild(card);
    });

    console.log("Marcas cargadas correctamente.");

  } catch (err) {
    console.error("Error inesperado:", err);
  }
}

// Ejecutar la carga
document.addEventListener("DOMContentLoaded", cargarMarcas);
// ==========================================================
// Scroll infinito: Reveal de cards al entrar en viewport
// ==========================================================

// Función que activa el efecto de animación al entrar en pantalla
function initScrollReveal() {
  // Seleccionamos todas las cards
  const cards = document.querySelectorAll(".card");

  // Intersection Observer: detecta cuando un elemento entra en la ventana
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Cuando la card aparece, agregamos la clase 'reveal'
          entry.target.classList.add("reveal");
          // Dejamos de observar esta card
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1 // Se activa cuando el 10% de la card es visible
    }
  );

  // Observamos cada card
  cards.forEach(card => observer.observe(card));
}

// ==========================================================
// Ejecutar el efecto después de cargar las marcas
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  cargarMarcas().then(() => {
    initScrollReveal(); // Activamos la animación
  });
});

// ==========================================================
// Cargar marcas desde el overlay inventario  (CORREGIDO)
// ==========================================================

window.cargarMarcas = async function () {
  const cont = document.getElementById("marcasContainer");

  if (!cont) {
    console.error("❌ No existe el contenedor #marcasContainer.");
    return;
  }

  cont.innerHTML = "<p style='color:white'>Cargando marcas...</p>";

  const { data: marcas, error } = await supabase
    .from("marcas")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    cont.innerHTML = "<p style='color:white'>Error cargando marcas.</p>";
    console.error("❌ Error obteniendo marcas:", error);
    return;
  }

  cont.innerHTML = marcas
    .map(
      (m) => `
      <div class="card">
        <img src="${m.imagen_url}" alt="${m.nombre}">
        <h3>${m.nombre}</h3>
        <p>${m.descripcion}</p>
      </div>
    `
    )
    .join("");
};


