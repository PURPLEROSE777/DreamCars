import { supabase } from "./script.js";  // usa la conexión que ya tienes

// Nombre del bucket donde guardas las imágenes
const BUCKET = "marcas";  

async function cargarGaleria() {
  const contenedor = document.getElementById("galeriaContainer");
  contenedor.innerHTML = `<p style="color:white">Cargando imágenes...</p>`;

  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 100,
    sortBy: { column: "name", order: "asc" }
  });

  if (error) {
    contenedor.innerHTML = `<p style="color:red">Error cargando galería.</p>`;
    console.error(error);
    return;
  }

  contenedor.innerHTML = "";

  data.forEach(file => {
    if (!file.name.match(/\.(jpg|jpeg|png|webp)$/i)) return;

    const url = supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl;

    const img = document.createElement("img");
    img.src = url;
    img.loading = "lazy";
    img.className = "img-galeria";
    contenedor.appendChild(img);
  });
}

// Ejecutar cuando abran la galería
document.getElementById("linkGaleria").addEventListener("click", cargarGaleria);
