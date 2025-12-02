import { supabase } from "./script.js";

const BUCKET = "image"; // ✔ nombre real del bucket

// === CARGAR GALERÍA ===
async function cargarGaleria() {

  const contenedor = document.getElementById("galeriaOverlayContainer");

  if (!contenedor) {
    console.error("ERROR: No existe #galeriaOverlayContainer en el HTML");
    return;
  }

  contenedor.innerHTML = `<p style="color:white">Cargando imágenes...</p>`;

  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 50,
    sortBy: { column: "name", order: "asc" }
  });

  if (error) {
    console.error("ERROR al listar bucket:", error);
    contenedor.innerHTML = `<p style="color:red">No se pudo cargar la galería.</p>`;
    return;
  }

  contenedor.innerHTML = "";

  data.forEach(file => {

    // Solo cargar imágenes
    if (!file.name.match(/\.(jpg|jpeg|png|webp)$/i)) return;

    // Obtener URL pública
    const url = supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl;

    // Crear imagen
    const img = document.createElement("img");
    img.src = url;
    img.className = "img-galeria";
    img.loading = "lazy";

    contenedor.appendChild(img);
  });

}

// === LISTENER CUANDO ABREN LA GALERÍA ===
document.getElementById("linkGaleria")?.addEventListener("click", () => {
  cargarGaleria();
});
