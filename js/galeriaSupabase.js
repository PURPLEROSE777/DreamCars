// ============================================================
//  GALERÍA SUPABASE  —  Versión Limpia, Optimizada y Sin Errores
// ============================================================

// Importa la misma instancia de Supabase que usas en script.js
import { supabase } from "./script.js";

// Nombre del bucket donde guardas las imágenes
const BUCKET = "image";


// ============================================================
//  FUNCIÓN PRINCIPAL: Cargar Galería
// ============================================================
async function cargarGaleria() {

  // ⬅️ Este es el contenedor real en tu HTML
  const contenedor = document.getElementById("galeriaOverlayContainer");

  if (!contenedor) {
    console.error("❌ No existe el contenedor #galeriaOverlayContainer");
    return;
  }

  // Mensaje inicial
  contenedor.innerHTML = `
    <p style="color:white; text-align:center;">Cargando imágenes...</p>
  `;

  // Obtener lista de archivos del bucket
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", {
      limit: 100,
      sortBy: { column: "name", order: "asc" }
    });

  // Si falla la carga
  if (error) {
    contenedor.innerHTML = `
      <p style="color:red; text-align:center;">Error cargando galería.</p>
    `;
    console.error("Error Supabase:", error);
    return;
  }

  // Limpiar antes de inyectar imágenes
  contenedor.innerHTML = "";

  // Recorrer archivos del bucket
  data.forEach(file => {

    // Aceptar solo imágenes válidas
    if (!file.name.match(/\.(jpg|jpeg|png|webp)$/i)) return;

    // Obtener URL pública
    const { data: urlData } = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(file.name);

    const url = urlData.publicUrl;

    // Crear el elemento visual
    const img = document.createElement("img");
    img.src = url;
    img.loading = "lazy";
    img.className = "img-galeria";

    // Agregar a la grilla
    contenedor.appendChild(img);
  });

  // Si no había imágenes
  if (contenedor.innerHTML.trim() === "") {
    contenedor.innerHTML = `
      <p style="color:white; text-align:center;">No hay imágenes en el bucket.</p>
    `;
  }
}


// ============================================================
//  TRIGGER: Cargar galería SOLO al abrir el overlay
// ============================================================

const linkGaleria = document.getElementById("linkGaleria");

if (linkGaleria) {
  linkGaleria.addEventListener("click", () => {
    cargarGaleria();
  });
} else {
  console.warn("⚠️ No existe el botón #linkGaleria en el DOM.");
}

