// ===== Configuración inicial =====
const CLAVE = "asignaturasEscolares"; // clave con la que se guarda en localStorage
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]; // orden de los días
// Horario que aparece la primera vez que se abre la página
const INICIALES = [
    { materia: "Matemáticas", dia: "Lunes", inicio: "07:00", fin: "08:00" },
    { materia: "Español", dia: "Martes", inicio: "08:00", fin: "09:00" },
    { materia: "Ciencias", dia: "Miércoles", inicio: "09:00", fin: "10:00" },
    { materia: "Inglés", dia: "Jueves", inicio: "10:00", fin: "11:00" }
];
let lista = []; // arreglo con todas las materias
// ===== Referencias a elementos del HTML =====
const inputMateria = document.getElementById("materia");
const selectDia = document.getElementById("dia");
const inputInicio = document.getElementById("inicio");
const inputFin = document.getElementById("fin");
const mensaje = document.getElementById("mensaje");
const filtro = document.getElementById("filtro");
const cuerpo = document.getElementById("cuerpo");
const vacio = document.getElementById("vacio");
// ===== Funciones de localStorage =====
// Lee la lista guardada; si no hay nada, usa el horario inicial
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        lista = guardado ? JSON.parse(guardado) : INICIALES.slice();
    } catch (error) {
      lista = INICIALES.slice(); // si algo falla, vuelve al horario inicial
    }
}
// Guarda la lista como texto en localStorage
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
}
// ===== Funciones que dibujan la tabla =====
// Crea una celda de la tabla con un texto
function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto; // textContent evita código malicioso
    return td;
}
// Dibuja las filas según el filtro, ordenadas por día y hora
function pintar() {
    cuerpo.innerHTML = ""; // limpia la tabla antes de dibujar
    const filas = lista
        .map(function (m, indice) { return { m: m, indice: indice }; }) // recuerda la posición original
        .filter(function (f) { return filtro.value === "Todos" || f.m.dia === filtro.value; })
        .sort(function (a, b) {
            return DIAS.indexOf(a.m.dia) - DIAS.indexOf(b.m.dia) || a.m.inicio.localeCompare(b.m.inicio);
        });
    filas.forEach(function (f) {
        const tr = document.createElement("tr");
        const boton = document.createElement("button");
        boton.className = "btn-eliminar";
        boton.textContent = "Eliminar";
        boton.dataset.posicion = f.indice; // posición real en el arreglo
        const celdaBoton = document.createElement("td");
        celdaBoton.appendChild(boton);
        tr.append(crearCelda(f.m.materia), crearCelda(f.m.dia), crearCelda(f.m.inicio + " - " + f.m.fin), celdaBoton);
        cuerpo.appendChild(tr);
    });
    vacio.classList.toggle("oculto", filas.length > 0); // muestra el aviso si no hay filas
}
// ===== Eventos =====
// Cada evento actualiza la lista, la guarda y redibuja la tabla
// Así lo que ves siempre coincide con lo guardado
// Los eventos solo reaccionan a lo que hace la persona
// Agregar una materia nueva
document.getElementById("btnAgregar").addEventListener("click", function () {
    const materia = inputMateria.value.trim();
    // Validaciones: nombre obligatorio y la hora de fin después de la de inicio
    if (!materia) { mensaje.textContent = "Escribe el nombre de la materia."; return; }
    if (inputFin.value <= inputInicio.value) { mensaje.textContent = "La hora de fin debe ser después del inicio."; return; }
    lista.push({ materia: materia, dia: selectDia.value, inicio: inputInicio.value, fin: inputFin.value });
    inputMateria.value = "";
    mensaje.textContent = "";
    guardarDatos();
    pintar();
});
// Eliminar: un solo evento en la tabla detecta el botón pulsado
cuerpo.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-eliminar")) {
        lista.splice(Number(e.target.dataset.posicion), 1); // quita esa materia
        guardarDatos();
        pintar();
    }
});
// Cambiar el filtro de día vuelve a dibujar la tabla
filtro.addEventListener("change", pintar);
// Restaurar el horario inicial (pide confirmación)
document.getElementById("btnRestaurar").addEventListener("click", function () {
    if (confirm("¿Volver al horario inicial? Se borrarán tus cambios.")) {
        lista = INICIALES.slice();
        guardarDatos();
        pintar();
    }
});
// ===== Inicio de la app =====
cargarDatos(); // primero se lee lo guardado
pintar();      // luego se dibuja la pantalla