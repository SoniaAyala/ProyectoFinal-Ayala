const divContenedor = document.getElementById("divContenedor");
const btnCesta = document.getElementById("cesta");
const inputSearch = document.getElementById("inputSearch");
const spanCesta = document.getElementById("productosEnCesta");
const productos = [];
const URLproductos = "js/productos.json";

const cesta = JSON.parse(localStorage.getItem("cestaCompras")) ?? [];

function retornarCardHTML(producto) {
    return `<div class="div-card">
                <div class="imagen"><img src="${producto.imagenSrc}" alt="${producto.nombre}"></div>
                <div class="producto">${producto.nombre}</div>
                <div class="importe">€ ${producto.precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }).replace('€', '')}</div>
                <button id="${producto.id}" class="add-to-cart">Añadir a la cesta</button>
            </div>`;
}

function retornarCardError() {
    return `<div class="div-card-error">
                <div class="imagen-error">⚠️</div>
                <div class="leyenda-error">Error al cargar productos</div>
                <div class="leyenda-intento">Inténtalo de nuevo más tarde.</div>
            </div>`;
}

function obtenerProductos() {
    fetch(URLproductos)
        .then((response) => response.json())
        .then((data) => {
            productos.push(...data);
            cargarProductos(productos);
        })
        .catch((error) => {
            console.error(error);
            divContenedor.innerHTML = retornarCardError();
        });
}

function cargarProductos(array) {
    if (array.length > 0) {
        divContenedor.innerHTML = "";
        array.forEach((producto) => {
            divContenedor.innerHTML += retornarCardHTML(producto);
        });
        activarEventosClick();
        cesta.length > 0 && actualizarTotalCesta();
        ajustarImagenes();
    } else {
        divContenedor.innerHTML = retornarCardError();
    }
}

function ajustarImagenes() {
    let imagenes = document.querySelectorAll('.imagen img');
    imagenes.forEach(function(imagen) {
        imagen.style.width = '200px';
        imagen.style.height = '220px';
        imagen.style.objectFit = 'cover';
    });
}

function actualizarTotalCesta() {
    spanCesta.textContent = cesta.length;
}

function activarEventosClick() {
    const botonesAgregar = document.querySelectorAll("button.add-to-cart");

    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach((boton) => {
            boton.addEventListener("click", () => {
                let productoSeleccionado = productos.find((producto) => producto.id == boton.id);
                cesta.push(productoSeleccionado);
                actualizarTotalCesta();
                localStorage.setItem("cestaCompras", JSON.stringify(cesta));
            });
        });
    }
}

btnCesta.addEventListener("click", () => {
    cesta.length > 0 ? location.href = "checkout.html" : alert("⛔️ La cesta está vacía. Agrega al menos un producto a la cesta.");
});

btnCesta.addEventListener("mousemove", () => {
    if (cesta.length > 0) {
        btnCesta.title = "Productos en cesta: " + cesta.length;
    }
});

inputSearch.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        let searchTerm = inputSearch.value.trim().toLowerCase();
        if (searchTerm === "") {
            cargarProductos(productos);
        } else {
            let resultado = productos.filter((producto) =>
                producto.nombre.toLowerCase().includes(searchTerm)
            );
            cargarProductos(resultado);
        }
    }
});

document.addEventListener('DOMContentLoaded', obtenerProductos);

