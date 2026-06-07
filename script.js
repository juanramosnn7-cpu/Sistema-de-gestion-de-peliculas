// Array principal: aqui se guardan todas las peliculas en memoria.
let peliculas = [];

// Esta variable guarda el id de la pelicula que se esta editando.
let idEnEdicion = null;

// Capturamos los elementos del HTML para poder usarlos con JavaScript.
const formulario = document.getElementById("formularioPelicula");
const peliculaId = document.getElementById("peliculaId");
const titulo = document.getElementById("titulo");
const director = document.getElementById("director");
const anio = document.getElementById("anio");
const categoria = document.getElementById("categoria");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const listaPeliculas = document.getElementById("listaPeliculas");
const mensajeVacio = document.getElementById("mensajeVacio");
const contadorPeliculas = document.getElementById("contadorPeliculas");
const botonGuardar = document.getElementById("botonGuardar");
const botonCancelar = document.getElementById("botonCancelar");
const botonModoOscuro = document.getElementById("botonModoOscuro");

const errorTitulo = document.getElementById("errorTitulo");
const errorDirector = document.getElementById("errorDirector");
const errorAnio = document.getElementById("errorAnio");
const errorCategoria = document.getElementById("errorCategoria");

// Al cargar la pagina, recuperamos las peliculas guardadas en localStorage.
document.addEventListener("DOMContentLoaded", iniciarAplicacion);

function iniciarAplicacion() {
    cargarPeliculas();
    cargarModoOscuro();
    mostrarPeliculas();
}

// Este evento se ejecuta cuando el usuario envia el formulario.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!formularioEsValido()) {
        return;
    }

    if (idEnEdicion === null) {
        crearPelicula();
    } else {
        actualizarPelicula();
    }

    guardarPeliculas();
    limpiarFormulario();
    mostrarPeliculas();
});

// Estos eventos actualizan la lista mientras el usuario busca o filtra.
buscador.addEventListener("input", mostrarPeliculas);
filtroCategoria.addEventListener("change", mostrarPeliculas);
botonCancelar.addEventListener("click", limpiarFormulario);
botonModoOscuro.addEventListener("click", cambiarModoOscuro);

function formularioEsValido() {
    let esValido = true;

    limpiarErrores();

    if (titulo.value.trim().length < 2) {
        errorTitulo.textContent = "El titulo debe tener minimo 2 caracteres.";
        esValido = false;
    }

    if (director.value.trim().length < 3) {
        errorDirector.textContent = "El director debe tener minimo 3 caracteres.";
        esValido = false;
    }

    const anioNumero = Number(anio.value);

    if (anioNumero < 1900 || anioNumero > 2026 || anio.value === "") {
        errorAnio.textContent = "El anio debe estar entre 1900 y 2026.";
        esValido = false;
    }

    if (categoria.value === "") {
        errorCategoria.textContent = "Debe seleccionar una categoria.";
        esValido = false;
    }

    return esValido;
}

function limpiarErrores() {
    errorTitulo.textContent = "";
    errorDirector.textContent = "";
    errorAnio.textContent = "";
    errorCategoria.textContent = "";
}

function crearPelicula() {
    const nuevaPelicula = {
        id: Date.now(),
        titulo: titulo.value.trim(),
        director: director.value.trim(),
        anio: Number(anio.value),
        categoria: categoria.value
    };
    peliculas.push(nuevaPelicula);
}

function actualizarPelicula() {
    peliculas = peliculas.map(function (pelicula) {
        if (pelicula.id === idEnEdicion) {
            return {
                id: idEnEdicion,
                titulo: titulo.value.trim(),
                director: director.value.trim(),
                anio: Number(anio.value),
                categoria: categoria.value
            };
        }

        return pelicula;
    });
}

function mostrarPeliculas() {
    listaPeliculas.innerHTML = "";

    const textoBuscado = buscador.value.toLowerCase().trim();
    const categoriaSeleccionada = filtroCategoria.value;

    const peliculasFiltradas = peliculas.filter(function (pelicula) {
        const coincideTitulo = pelicula.titulo.toLowerCase().includes(textoBuscado);
        const coincideCategoria = categoriaSeleccionada === "Todas" || pelicula.categoria === categoriaSeleccionada;

        return coincideTitulo && coincideCategoria;
    });

    contadorPeliculas.textContent = `${peliculasFiltradas.length} pelicula(s)`;
    mensajeVacio.classList.toggle("oculto", peliculasFiltradas.length > 0);

    peliculasFiltradas.forEach(function (pelicula) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-pelicula";

        tarjeta.innerHTML = `
            <h3>${pelicula.titulo}</h3>
            <p class="detalle"><strong>Director:</strong> ${pelicula.director}</p>
            <p class="detalle"><strong>Anio:</strong> ${pelicula.anio}</p>
            <span class="categoria">${pelicula.categoria}</span>
            <div class="acciones-tarjeta">
                <button class="boton-principal" type="button" onclick="editarPelicula(${pelicula.id})">Editar</button>
                <button class="boton-peligro" type="button" onclick="eliminarPelicula(${pelicula.id})">Eliminar</button>
            </div>
        `;

        listaPeliculas.appendChild(tarjeta);
    });
}

function editarPelicula(id) {
    const peliculaEncontrada = peliculas.find(function (pelicula) {
        return pelicula.id === id;
    });

    if (!peliculaEncontrada) {
        return;
    }

    idEnEdicion = peliculaEncontrada.id;
    peliculaId.value = peliculaEncontrada.id;
    titulo.value = peliculaEncontrada.titulo;
    director.value = peliculaEncontrada.director;
    anio.value = peliculaEncontrada.anio;
    categoria.value = peliculaEncontrada.categoria;

    botonGuardar.textContent = "Actualizar pelicula";
    botonCancelar.classList.remove("oculto");
    titulo.focus();
}

function eliminarPelicula(id) {
    const confirmar = window.confirm("Seguro que desea eliminar esta pelicula?");

    if (!confirmar) {
        return;
    }

    peliculas = peliculas.filter(function (pelicula) {
        return pelicula.id !== id;
    });

    guardarPeliculas();
    limpiarFormulario();
    mostrarPeliculas();
}

function limpiarFormulario() {
    formulario.reset();
    peliculaId.value = "";
    idEnEdicion = null;
    botonGuardar.textContent = "Guardar pelicula";
    botonCancelar.classList.add("oculto");
    limpiarErrores();
}

function guardarPeliculas() {
    localStorage.setItem("peliculas", JSON.stringify(peliculas));
}

function cargarPeliculas() {
    const peliculasGuardadas = localStorage.getItem("peliculas");

    if (peliculasGuardadas) {
        peliculas = JSON.parse(peliculasGuardadas);
    }
}

function cambiarModoOscuro() {
    document.body.classList.toggle("modo-oscuro");

    const modoOscuroActivo = document.body.classList.contains("modo-oscuro");
    localStorage.setItem("modoOscuro", modoOscuroActivo);
    botonModoOscuro.textContent = modoOscuroActivo ? "Modo claro" : "Modo oscuro";
}

function cargarModoOscuro() {
    const modoOscuroGuardado = localStorage.getItem("modoOscuro") === "true";

    if (modoOscuroGuardado) {
        document.body.classList.add("modo-oscuro");
        botonModoOscuro.textContent = "Modo claro";
    }
}