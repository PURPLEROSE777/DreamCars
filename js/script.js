// --- Conexión a Supabase (DreamCars) ---
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://afhjlxljgwmkdnltoeie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaGpseGxqZ3dta2RubHRvZWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MjE1MzMsImV4cCI6MjA3ODI5NzUzM30.sTn0VsJC7sYGRZd7Yv5UfKMqs5s6-eRFDBJ0nf0J7Us'

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log('✅ Conectado a Supabase:', supabaseUrl)


// === NAVEGACIÓN: Botón "Inicio" ===
const linkInicio = document.getElementById('linkInicio');
linkInicio.addEventListener('click', (e) => {
  cerrarOverlays();
  const destino = document.querySelector('#inicio');
  if (destino) {
    e.preventDefault();
    destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// === GALERÍA ===
const linkGaleria  = document.getElementById('linkGaleria');
const galeria      = document.getElementById('galeriaOverlay');
const cerrarGaleriaBtn = document.getElementById('cerrarGaleria');
const volverInicioDesdeGaleria = document.getElementById('volverInicioDesdeGaleria');

linkGaleria.addEventListener('click', (e)=>{
  e.preventDefault();
  abrirOverlay(galeria);
});
cerrarGaleriaBtn.addEventListener('click', ()=> cerrarOverlay(galeria));
volverInicioDesdeGaleria.addEventListener('click', ()=>{
  cerrarOverlay(galeria);
  document.querySelector('#inicio').scrollIntoView({ behavior:'smooth' });
});

// === AUTORES ===
const linkAutores  = document.getElementById('linkAutores');
const autores      = document.getElementById('autoresOverlay');
const cerrarAutoresBtn = document.getElementById('cerrarAutores');

linkAutores.addEventListener('click', (e)=>{
  e.preventDefault();
  abrirOverlay(autores);
});
cerrarAutoresBtn.addEventListener('click', ()=> cerrarOverlay(autores));

// === AUTORES DESDE FOOTER ===
const footerAutoresBtn = document.getElementById('footerAutores');
if (footerAutoresBtn) {
  footerAutoresBtn.addEventListener('click', (e) => {
    e.preventDefault();
    abrirOverlay(autores);
  });
}


// === TABLA COMPARATIVA ===
const linkTabla  = document.getElementById('linkTabla');
const tabla      = document.getElementById('tablaOverlay');
const cerrarTablaBtn = document.getElementById('cerrarTabla');

linkTabla.addEventListener('click', (e)=>{
  e.preventDefault();
  abrirOverlay(tabla);
});
cerrarTablaBtn.addEventListener('click', ()=> cerrarOverlay(tabla));

// === INVENTARIO ===
const linkInventario  = document.getElementById('linkInventario');
const inventarioOv    = document.getElementById('inventarioOverlay');
const cerrarInventarioBtn = document.getElementById('cerrarInventario');

linkInventario.addEventListener('click', (e)=>{
  e.preventDefault();
  abrirOverlay(inventarioOv);
});
cerrarInventarioBtn.addEventListener('click', ()=> cerrarOverlay(inventarioOv));

// === CONTACTO ===
const linkContacto = document.getElementById("linkContacto");
const contactoOverlay = document.getElementById("contactoOverlay");
const cerrarContacto = document.getElementById("cerrarContacto");

if (linkContacto && contactoOverlay && cerrarContacto) {
  linkContacto.addEventListener("click", (e) => {
    e.preventDefault();
    abrirOverlay(contactoOverlay);
  });
  cerrarContacto.addEventListener("click", () => {
    cerrarOverlay(contactoOverlay);
  });
}

// === FUNCIONES PARA OVERLAYS ===
function abrirOverlay(el){
  el.classList.add('activo');
  el.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function cerrarOverlay(el){
  el.classList.remove('activo');
  el.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
function cerrarOverlays(){
  [galeria, autores, tabla, contactoOverlay, inventarioOv].forEach(o=>{
    if (o && o.classList.contains('activo')) cerrarOverlay(o);
  });
}

// Cerrar overlays con tecla ESC
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') cerrarOverlays();
});

// === EFECTO REVEAL (animación al hacer scroll) ===
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting){
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el=> observer.observe(el));

/* ===================================================
   🔎 BARRA DE BÚSQUEDA DE MARCAS
   =================================================== */
const btnSugerir = document.getElementById('btnSugerir');
const inputMarca = document.getElementById('marca');
const msg        = document.getElementById('mensaje');
const resultados = document.getElementById('resultados');

// Capturar todas las cards ya existentes
const autos = Array.from(document.querySelectorAll('.card')).map(card => {
  return {
    nombre: card.querySelector('h2').textContent.trim(),
    img: card.querySelector('img').getAttribute('src'),
    id: card.id
  };
});

// Botón buscar
btnSugerir.addEventListener('click', (e)=>{
  e.preventDefault();
  buscarMarca();
});

// Enter = buscar
inputMarca.addEventListener('keyup', (e)=>{
  if (e.key === 'Enter') {
    buscarMarca();
  } else {
    mostrarResultados(inputMarca.value.trim());
  }
});

function buscarMarca(){
  const valor = (inputMarca.value || '').trim().toLowerCase();
  if (!valor){
    msg.style.color = '#ffce69';
    msg.textContent = 'Por favor escribe una marca.';
    resultados.innerHTML = '';
    return;
  }
  const filtrados = autos.filter(auto => auto.nombre.toLowerCase().includes(valor));
  if (filtrados.length > 0){
    msg.style.color = '#a7e5b8';
    msg.textContent = `Se encontraron ${filtrados.length} resultados:`;
    renderResultados(filtrados);
  } else {
    msg.style.color = '#ff6961';
    msg.textContent = `No se encontró ninguna marca con "${valor}".`;
    resultados.innerHTML = '';
  }
}

function renderResultados(lista){
  resultados.innerHTML = lista.map(auto => `
    <div class="preview-card" onclick="document.getElementById('${auto.id}').scrollIntoView({behavior:'smooth'})">
      <img src="${auto.img}" alt="${auto.nombre}">
      <p>${auto.nombre}</p>
    </div>
  `).join('');
}

function mostrarResultados(valor){
  if (!valor) {
    resultados.innerHTML = '';
    return;
  }
  const filtrados = autos.filter(auto => auto.nombre.toLowerCase().includes(valor.toLowerCase()));
  renderResultados(filtrados);
}

/* ===================================================
   🆕 SCROLL PARA TABLA COMPARATIVA
   =================================================== */
const tablaOverlayEl = document.getElementById("tablaOverlay");
if (tablaOverlayEl) {
  const tablaBody = tablaOverlayEl.querySelector(".overlay-body");
  if (tablaBody) {
    tablaBody.style.maxHeight = "70vh";
    tablaBody.style.overflowY = "auto";
  }
}

/* ===================================================
   🆕 INVENTARIO (CRUD con LocalStorage)
   =================================================== */
const formInventario = document.getElementById("formInventario");
const tablaInventario = document.querySelector("#tablaInventario tbody");
const tplFila = document.getElementById("tplFilaInventario");
const invBuscar = document.getElementById("invBuscar");
const invFiltroCategoria = document.getElementById("invFiltroCategoria");
const invTotal = document.getElementById("invTotal");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
const dlgConfirmar = document.getElementById("dlgConfirmar");
const dlgMsg = document.getElementById("dlgMsg");

// Estadísticas inventario
const statTotalAutos   = document.getElementById("statTotalAutos");
const statStock        = document.getElementById("statStock");
const statPromedio     = document.getElementById("statPromedio");
const statValorTotal   = document.getElementById("statValorTotal");
const statMarcaFrecuente = document.getElementById("statMarcaFrecuente");
const statAutoCaro       = document.getElementById("statAutoCaro");
const statMayorMargen    = document.getElementById("statMayorMargen");

let inventario = JSON.parse(localStorage.getItem("inventarioAutos")) || [];

// Render tabla
function renderInventario(lista = inventario) {
  tablaInventario.innerHTML = "";
  let total = 0;
  lista.forEach((auto, idx) => {
    const fila = tplFila.content.cloneNode(true);
    fila.querySelector(".c-marca").textContent = auto.marca;
    fila.querySelector(".c-modelo").textContent = auto.modelo;
    fila.querySelector(".c-anio").textContent = auto.anio;
    fila.querySelector(".c-categoria").textContent = auto.categoria;
    fila.querySelector(".c-img").innerHTML = auto.imagen ? `<img src="${auto.imagen}" alt="${auto.marca}" style="width:80px;height:50px;object-fit:cover;border-radius:6px">` : "-";
    fila.querySelector(".c-stock").textContent = auto.stock;
    fila.querySelector(".c-precio").textContent = `$${auto.precio}`;
    fila.querySelector(".c-costo").textContent = auto.costo ? `$${auto.costo}` : "-";
    const margen = auto.costo ? (((auto.precio - auto.costo) / auto.costo) * 100).toFixed(1) : "-";
    fila.querySelector(".c-margen").textContent = margen;
    const valor = auto.stock * auto.precio;
    fila.querySelector(".c-valor").textContent = `$${valor}`;
    total += valor;
    const acciones = document.createElement("div");
    const btnE = document.createElement("button");
    btnE.textContent = "✎";
    btnE.className = "btn-accion btn-editar";
    btnE.onclick = () => editarAuto(idx);
    const btnX = document.createElement("button");
    btnX.textContent = "🗑";
    btnX.className = "btn-accion btn-eliminar";
    btnX.onclick = () => confirmarEliminar(idx);
    acciones.append(btnE, btnX);
    fila.querySelector(".c-acciones").appendChild(acciones);
    tablaInventario.appendChild(fila);
  });
  invTotal.textContent = `$${total}`;
// === Actualizar estadísticas rápidas ===
statTotalAutos.textContent = lista.length;

// calcular stock total
const totalStock = lista.reduce((acc,a)=> acc + a.stock, 0);
statStock.textContent = totalStock;

// valor promedio por auto
const promedio = lista.length ? (total / lista.length).toFixed(2) : 0;
statPromedio.textContent = `$${promedio}`;

// valor total ya calculado
statValorTotal.textContent = `$${total}`;

// KPI: Marca más frecuente
if (lista.length) {
  const marcasCount = {};
  lista.forEach(a => {
    marcasCount[a.marca] = (marcasCount[a.marca] || 0) + 1;
  });
  const marcaTop = Object.entries(marcasCount).sort((a,b)=> b[1]-a[1])[0][0];
  statMarcaFrecuente.textContent = marcaTop;
} else {
  statMarcaFrecuente.textContent = "-";
}

// KPI: Auto más caro
if (lista.length) {
  const autoCaro = lista.reduce((max,a)=> a.precio > max.precio ? a : max, lista[0]);
  statAutoCaro.textContent = `${autoCaro.marca} ${autoCaro.modelo} ($${autoCaro.precio})`;
} else {
  statAutoCaro.textContent = "-";
}

// KPI: Mayor margen %
let mejorMargen = null;
lista.forEach(a=>{
  if (a.costo && a.costo > 0) {
    const margen = ((a.precio - a.costo) / a.costo) * 100;
    if (!mejorMargen || margen > mejorMargen.margen) {
      mejorMargen = { ...a, margen };
    }
  }
});
if (mejorMargen) {
  statMayorMargen.textContent = `${mejorMargen.marca} ${mejorMargen.modelo} (${mejorMargen.margen.toFixed(1)}%)`;
} else {
  statMayorMargen.textContent = "-";
}
  localStorage.setItem("inventarioAutos", JSON.stringify(inventario));
}


formInventario.addEventListener("submit", e => {
  e.preventDefault();
  const nuevo = {
    marca: document.getElementById("iMarca").value,
    modelo: document.getElementById("iModelo").value,
    anio: document.getElementById("iAnio").value,
    categoria: document.getElementById("iCategoria").value,
    stock: +document.getElementById("iStock").value,
    precio: +document.getElementById("iPrecio").value,
    costo: +document.getElementById("iCosto").value || null,
    sku: document.getElementById("iSKU").value,
    imagen: document.getElementById("iImagen").value
  };
  const idx = document.getElementById("iEditIndex").value;
  if (idx) {
    inventario[idx] = nuevo;
    document.getElementById("iEditIndex").value = "";
    btnCancelarEdicion.style.display = "none";
  } else {
    inventario.push(nuevo);
  }
  formInventario.reset();
  renderInventario();
});

function editarAuto(idx) {
  const auto = inventario[idx];
  document.getElementById("iMarca").value = auto.marca;
  document.getElementById("iModelo").value = auto.modelo;
  document.getElementById("iAnio").value = auto.anio;
  document.getElementById("iCategoria").value = auto.categoria;
  document.getElementById("iStock").value = auto.stock;
  document.getElementById("iPrecio").value = auto.precio;
  document.getElementById("iCosto").value = auto.costo || "";
  document.getElementById("iSKU").value = auto.sku || "";
  document.getElementById("iImagen").value = auto.imagen || "";
  document.getElementById("iEditIndex").value = idx;
  btnCancelarEdicion.style.display = "inline-block";
}

btnCancelarEdicion.addEventListener("click", ()=>{
  formInventario.reset();
  document.getElementById("iEditIndex").value = "";
  btnCancelarEdicion.style.display = "none";
});

function confirmarEliminar(idx) {
  dlgMsg.textContent = `¿Eliminar ${inventario[idx].marca} ${inventario[idx].modelo}?`;
  dlgConfirmar.showModal();
  dlgConfirmar.returnValue = "";
  dlgConfirmar.onclose = ()=>{
    if (dlgConfirmar.returnValue === "ok") {
      inventario.splice(idx,1);
      renderInventario();
    }
  };
}
// Aplicar Filtros
function aplicarFiltros(){
  const txt = (invBuscar.value || '').toLowerCase();
  const cat = invFiltroCategoria.value;

  const precioMinVal = document.getElementById('invPrecioMin').value;
  const precioMaxVal = document.getElementById('invPrecioMax').value;
  const anioMinVal = document.getElementById('invAnioMin').value;
  const anioMaxVal = document.getElementById('invAnioMax').value;

  const precioMin = precioMinVal ? parseFloat(precioMinVal) : null;
  const precioMax = precioMaxVal ? parseFloat(precioMaxVal) : null;
  const anioMin = anioMinVal ? parseInt(anioMinVal) : null;
  const anioMax = anioMaxVal ? parseInt(anioMaxVal) : null;

  const soloDisponibles = document.getElementById('invDisponibilidad').checked;

  let lista = inventario.filter(a => {
    // texto (marca o modelo)
    const matchesTxt = !txt || (a.marca && a.marca.toLowerCase().includes(txt)) || (a.modelo && a.modelo.toLowerCase().includes(txt));
    // categoria
    const matchesCat = !cat || a.categoria === cat;
    // precio
    const precio = Number(a.precio) || 0;
    const matchesPrecio = (precioMin === null || precio >= precioMin) && (precioMax === null || precio <= precioMax);
    // año
    const año = Number(a.anio) || 0;
    const matchesAnio = (anioMin === null || año >= anioMin) && (anioMax === null || año <= anioMax);
    // disponibilidad
    const matchesDisp = !soloDisponibles || (Number(a.stock) > 0);

    return matchesTxt && matchesCat && matchesPrecio && matchesAnio && matchesDisp;
  });

  // render con la lista filtrada
  renderInventario(lista);
}

invBuscar.addEventListener("input", aplicarFiltros);
invFiltroCategoria.addEventListener("change", aplicarFiltros);

 // Listeners para los filtros 

['invPrecioMin','invPrecioMax','invAnioMin','invAnioMax'].forEach(id=>{
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', aplicarFiltros);
});
const chkDisp = document.getElementById('invDisponibilidad');
if (chkDisp) chkDisp.addEventListener('change', aplicarFiltros);

const btnLimpiar = document.getElementById('invLimpiarFiltros');
if (btnLimpiar) btnLimpiar.addEventListener('click', ()=>{
  document.getElementById('invPrecioMin').value = '';
  document.getElementById('invPrecioMax').value = '';
  document.getElementById('invAnioMin').value = '';
  document.getElementById('invAnioMax').value = '';
  document.getElementById('invDisponibilidad').checked = false;
  invBuscar.value = '';
  invFiltroCategoria.value = '';
  aplicarFiltros();
});

// Exportar / Importar
document.getElementById("invExportar").addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(inventario,null,2)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "inventario.json";
  a.click();
});
document.getElementById("invImportar").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try {
      inventario = JSON.parse(reader.result);
      renderInventario();
    } catch(e){ alert("Archivo inválido"); }
  };
  reader.readAsText(file);
});
document.getElementById("invVaciar").addEventListener("click", ()=>{
  if (confirm("¿Vaciar inventario completo?")){
    inventario = [];
    renderInventario();
  }
});

// === Ordenamiento con íconos ===
let ordenActual = { campo:null, asc:true };

document.querySelectorAll("#tablaInventario th[data-sort]").forEach(th=>{
  th.addEventListener("click", ()=>{
    const campo = th.getAttribute("data-sort");

    // alternar asc/desc si es el mismo campo
    if (ordenActual.campo === campo) {
      ordenActual.asc = !ordenActual.asc;
    } else {
      ordenActual.campo = campo;
      ordenActual.asc = true;
    }

    inventario.sort((a,b)=>{
      if (a[campo] > b[campo]) return ordenActual.asc ? 1 : -1;
      if (a[campo] < b[campo]) return ordenActual.asc ? -1 : 1;
      return 0;
    });

    // limpiar iconos previos
    document.querySelectorAll("#tablaInventario th[data-sort]").forEach(el=>{
      el.textContent = el.textContent.replace(/[\u25B2\u25BC]$/,'').trim();
    });

    // añadir icono al encabezado actual
    th.textContent = th.textContent.replace(/[\u25B2\u25BC]$/,'').trim() + 
                     (ordenActual.asc ? " ▲" : " ▼");

    renderInventario();
  });

  // Doble click = reset
  th.addEventListener("dblclick", ()=>{
    ordenActual = { campo:null, asc:true };
    renderInventario();

    // limpiar iconos
    document.querySelectorAll("#tablaInventario th[data-sort]").forEach(el=>{
      el.textContent = el.textContent.replace(/[\u25B2\u25BC]$/,'').trim();
    });
  });
});
// === BOTÓN EXPORTAR CSV ===
document.getElementById('invExportarCSV').addEventListener('click', () => {
  if (inventario.length === 0) {
    alert('No hay autos en el inventario.');
    return;
  }

  const encabezados = [
    "Marca","Modelo","Año","Categoría","Stock",
    "Precio","Costo","Margen (%)","Valor Total","Imagen"
  ];

  const filas = inventario.map(auto => [
    auto.marca,
    auto.modelo,
    auto.anio,
    auto.categoria,
    auto.stock,
    `$${auto.precio}`,
    `$${auto.costo || 0}`,
    `${auto.margen}%`,
    `$${(auto.precio * auto.stock).toFixed(2)}`,
    auto.imagen || "N/A"
  ]);

  const csv = [encabezados, ...filas].map(row => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "inventario_autos.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// === SINCRONIZAR TABLA COMPARATIVA ===
function actualizarTablaComparativa() {
  const tbody = document.querySelector('#tablaOverlay tbody');
  tbody.innerHTML = ''; // limpiar tabla previa

  inventario.forEach(auto => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${auto.marca}</td>
      <td><img src="${auto.imagen || 'images/default.jpg'}" alt="${auto.modelo}" /></td>
      <td>${auto.modelo}</td>
      <td>${auto.anio}</td>
      <td>${auto.categoria} - $${auto.precio}</td>
    `;
    tbody.appendChild(fila);
  });
}
// nuevo
/* ===================================================
   🆕 TABLA RESUMEN + BÚSQUEDA MEJORADA INVENTARIO
   =================================================== */

// 1) Crear tabla resumen al final del inventario si no existe
function ensureTablaResumen() {
  if (document.getElementById("tablaResumenInventario")) return;

  const overlayBody = document.querySelector("#inventarioOverlay .overlay-body");
  if (!overlayBody) return;

  const section = document.createElement("section");
  section.id = "tablaResumenInventario";
  section.className = "formulario";
  section.style.marginTop = "18px";
  section.innerHTML = `
    <h3>Resumen de Autos Añadidos</h3>
    <div style="overflow:auto;border:1px solid #2a2b36;border-radius:14px">
      <table class="tabla-autos">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Stock</th>
            <th>Precio Unitario</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody id="tbodyResumenInventario"></tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align:right;font-weight:700">Valor total del inventario:</td>
            <td id="valorTotalResumen" style="font-weight:800">$0</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
  overlayBody.appendChild(section);
}

// 2) Actualizar tabla resumen
function actualizarTablaResumen() {
  ensureTablaResumen();
  const tbody = document.getElementById("tbodyResumenInventario");
  const totalEl = document.getElementById("valorTotalResumen");
  tbody.innerHTML = "";

  let total = 0;
  inventario.forEach(auto => {
    const valor = auto.precio * auto.stock;
    total += valor;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${auto.marca}</td>
      <td>${auto.modelo}</td>
      <td>${auto.stock}</td>
      <td>$${auto.precio}</td>
      <td>$${valor}</td>
    `;
    tbody.appendChild(tr);
  });

  totalEl.textContent = `$${total}`;
}

// 3) Mejorar búsqueda en inventario (marca + modelo)
const invBuscarInput = document.getElementById("invBuscar");
if (invBuscarInput) {
  invBuscarInput.addEventListener("input", () => {
    const valor = invBuscarInput.value.trim().toLowerCase();
    const filtrados = inventario.filter(auto => 
      auto.marca.toLowerCase().includes(valor) ||
      auto.modelo.toLowerCase().includes(valor)
    );
    renderInventario(filtrados);
  });
}

// 4) Integrar resumen con renderInventario existente
const oldRenderInventario = renderInventario;
renderInventario = function(lista = inventario) {
  oldRenderInventario(lista);
  actualizarTablaResumen();
};

// Inicializar resumen al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarTablaResumen();
});
// nuevo autos y tabla 
/* ===================================================
   🆕 SINCRONIZAR TABLA COMPARATIVA CON AUTOS AÑADIDOS
   =================================================== */

function actualizarTablaComparativaExtendida() {
  const tabla = document.querySelector("#tablaOverlay tbody");
  if (!tabla) return;

  // 🔹 Primero, eliminar solo las filas dinámicas previas
  tabla.querySelectorAll("tr.dinamico").forEach(tr => tr.remove());

  if (inventario.length === 0) return;

  // 🔹 Separador visual entre las filas fijas y los autos añadidos
  const separador = document.createElement("tr");
  separador.className = "dinamico";
  separador.innerHTML = `
    <td colspan="5" style="text-align:center;font-weight:bold;color:#ffce69;padding:8px 0">
      — AUTOS AÑADIDOS AL INVENTARIO —
    </td>
  `;
  tabla.appendChild(separador);

  // 🔹 Añadir las nuevas filas dinámicamente
  inventario.forEach(auto => {
    const fila = document.createElement("tr");
    fila.className = "dinamico";
    fila.innerHTML = `
      <td>${auto.marca}</td>
      <td>
        <img src="${auto.imagen || 'images/default.jpg'}"
             alt="${auto.modelo}"
             style="width:120px;height:80px;object-fit:cover;border-radius:6px">
      </td>
      <td>${auto.modelo}</td>
      <td>${auto.anio}</td>
      <td>${auto.categoria} — $${auto.precio}</td>
    `;
    tabla.appendChild(fila);
  });
}

// 🔹 Integramos la nueva función con tu renderInventario actual
const oldRenderInventarioExtendido = renderInventario;
renderInventario = function(lista = inventario) {
  oldRenderInventarioExtendido(lista);
  actualizarTablaResumen();              // actualiza la tabla resumen
  actualizarTablaComparativaExtendida(); // actualiza la tabla comparativa extendida
};

// 🔹 Ejecutar sincronización al cargar
document.addEventListener("DOMContentLoaded", () => {
  actualizarTablaResumen();
  actualizarTablaComparativaExtendida();
});

// =========================
// LOGIN OVERLAY HANDLER
// =========================
const loginOverlay = document.getElementById("loginOverlay");
const btnLogin = document.getElementById("btnLogin");
const userInfo = document.getElementById("userInfo");
const userName = document.getElementById("userName");
const btnLogout = document.getElementById("btnLogout");

// Abrir login
btnLogin?.addEventListener("click", () => {
  loginOverlay.style.display = "flex";
});

// Tabs login/register
document.getElementById("tabLogin").addEventListener("click", () => {
  document.getElementById("login-layout").style.display = "block";
  document.getElementById("register-layout").style.display = "none";
  document.getElementById("tabLogin").classList.add("active");
  document.getElementById("tabRegister").classList.remove("active");
});

document.getElementById("tabRegister").addEventListener("click", () => {
  document.getElementById("login-layout").style.display = "none";
  document.getElementById("register-layout").style.display = "block";
  document.getElementById("tabRegister").classList.add("active");
  document.getElementById("tabLogin").classList.remove("active");
});

// Cerrar overlay al hacer click fuera
loginOverlay.addEventListener("click", (e) => {
  if (e.target === loginOverlay) loginOverlay.style.display = "none";
});

// -----------------------------
// ACCIÓN REAL: LOGIN
// -----------------------------
document.getElementById("btnDoLogin").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

  if (error) {
    alert("Error al iniciar sesión: " + error.message);
    return;
  }

  loginOverlay.style.display = "none";
  btnLogin.style.display = "none";
  userInfo.style.display = "flex";
  userName.textContent = data.user.email;
});

// -----------------------------
// ACCIÓN REAL: REGISTRO
// -----------------------------
document.getElementById("btnDoRegister").addEventListener("click", async () => {
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();
  const name = document.getElementById("reg-name").value.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: { data: { name } }
  });

  if (error) {
    alert("Error al crear usuario: " + error.message);
    return;
  }

  alert("Cuenta creada. Revisa tu correo para confirmar.");
});


// ============================
// 🔥 CONTROL DE ROLES
// ============================
document.addEventListener("DOMContentLoaded", async () => {

  // Esperar a que exista el link
  const linkInventario = document.getElementById("linkInventario");
  if (!linkInventario) return; // Evita errores si no existe en alguna página

  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Si no hay usuario → Oculta inventario
  if (!user) {
    linkInventario.style.display = "none";
    return;
  }

  // Buscar rol del usuario
  const { data: perfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (perfil?.role === "admin") {
    linkInventario.style.display = "inline-block";
  } else {
    linkInventario.style.display = "none";
  }

});


