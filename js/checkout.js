const tableBody = document.querySelector("#tableBody")
const importeTotalCesta = document.querySelector("#importeTotalCesta")
const btnComprar = document.querySelector("button#btnComprar")
const cesta = JSON.parse(localStorage.getItem("cestaCompras"))

function calcularTotalCesta() {
    if (cesta.length > 0) {
        let montoTotalCesta = cesta.reduce((acc, prod)=> acc + prod.precio, 0)
        importeTotalCesta.textContent = `${montoTotalCesta.toLocaleString("es-ES")} €`
    }
}

function armarTablaCesta({ imagenSrc, nombre, precio }) {
    return `<tr>
                <td class="imagen-cesta"><img src="${imagenSrc}" alt="${nombre}" style="max-width: 50px; max-height: 50px;"></td>
                <td>${nombre}</td>
                <td>${precio.toLocaleString("es-ES")} €</td>
                <td class="quitar-cesta" title="Clic para quitar de la cesta">❌</td>
            </tr>`;
}


function cargarProductosDelaCesta() {
    tableBody.innerHTML = ""
    
    if (cesta.length > 0) {
        cesta.forEach((producto)=> 
        tableBody.innerHTML += armarTablaCesta(producto))
        calcularTotalCesta()
    }
}
cargarProductosDelaCesta()

btnComprar.addEventListener("click", () => {
    Swal.fire({
        title: "Finalizar compra",
        text: "¿Deseas confirmar la cesta de tu compra?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
        customClass: {
            container: 'my-swal', // Clase personalizada para el contenedor del modal
            title: 'my-swal-title', // Clase personalizada para el título del modal
            content: 'my-swal-content', // Clase personalizada para el contenido del modal
            confirmButton: 'my-swal-confirm-button', // Clase personalizada para el botón de confirmar
            cancelButton: 'my-swal-cancel-button', // Clase personalizada para el botón de cancelar
        }
    })
    .then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("cestaCompras");
            cesta.length = 0;
            Swal.fire({
                icon: 'success',
                title: '¡Compra finalizada!',
                text: 'Tu compra ha sido completada con éxito.',
                customClass: {
                    container: 'my-swal', // Clase personalizada para el contenedor del modal
                    title: 'my-swal-title', // Clase personalizada para el título del modal
                    content: 'my-swal-content', // Clase personalizada para el contenido del modal
                }
            });
        }
    });
});

