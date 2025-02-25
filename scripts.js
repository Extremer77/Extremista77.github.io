document.addEventListener('DOMContentLoaded', () => {
    const plantasContainer = document.getElementById('plantas');
    const carritoContainer = document.getElementById('items-carrito');
    const totalContainer = document.getElementById('total');
    const cantidadCarrito = document.getElementById('cantidad-carrito');
    const comprarButton = document.getElementById('comprar');
    const cancelarButton = document.getElementById('cancelar');
    const volverAtrasButton = document.getElementById('volver-atras');
    let carrito = [];
    let plantas = [];

    fetch('src/data/plants.json')
        .then(response => response.json())
        .then(data => {
            plantas = data;
            mostrarPlantas(plantas);
        });

    const mostrarPlantas = (plantas) => {
        plantasContainer.innerHTML = '';
        plantas.forEach(planta => {
            const plantaCard = document.createElement('div');
            plantaCard.classList.add('planta');
            const nombreImagen = planta.nombre.toLowerCase().replace(/ /g, '_');
            plantaCard.innerHTML = `
                <img src="public/images/${nombreImagen}.jpg" alt="${planta.nombre}">
                <h3>${planta.nombre}</h3>
                <p class="precio">$${planta.precio.toFixed(2)}</p>
                <p>Tipo: ${planta.tipo}</p>
                <p>Cuidados: ${planta.cuidados}</p>
                <input type="number" min="1" value="1" id="cantidad-${planta.id}">
                <button onclick="agregarAlCarrito(${planta.id}, '${planta.nombre}', ${planta.precio})">Agregar al Carrito</button>
            `;
            plantasContainer.appendChild(plantaCard);
        });
    };

    window.agregarAlCarrito = (id, nombre, precio) => {
        const cantidad = document.getElementById(`cantidad-${id}`).value;
        const item = carrito.find(item => item.id === id);
        if (item) {
            item.cantidad += parseInt(cantidad);
        } else {
            carrito.push({ id, nombre, precio, cantidad: parseInt(cantidad) });
        }
        actualizarCarrito();
    };

    const actualizarCarrito = () => {
        carritoContainer.innerHTML = '';
        let total = 0;
        let cantidadTotal = 0;
        carrito.forEach(item => {
            const itemCarrito = document.createElement('div');
            itemCarrito.innerHTML = `
                <p>${item.nombre} - ${item.cantidad} x $${item.precio.toFixed(2)}</p>
            `;
            carritoContainer.appendChild(itemCarrito);
            total += item.precio * item.cantidad;
            cantidadTotal += item.cantidad;
        });
        totalContainer.textContent = total.toFixed(2);
        cantidadCarrito.textContent = cantidadTotal;
    };

    window.buscarPlanta = () => {
        const query = document.getElementById('buscador').value.toLowerCase();
        const plantasFiltradas = plantas.filter(planta => planta.nombre.toLowerCase().includes(query));
        mostrarPlantas(plantasFiltradas);
        volverAtrasButton.style.display = 'inline';
    };

    window.volverAtras = () => {
        mostrarPlantas(plantas);
        volverAtrasButton.style.display = 'none';
    };

    comprarButton.addEventListener('click', () => {
        const mensaje = carrito.map(item => `${item.nombre} - ${item.cantidad} x $${item.precio.toFixed(2)}`).join('%0A');
        const total = totalContainer.textContent;
        const url = `https://wa.me/5492645880367?text=Pedido:%0A${mensaje}%0ATotal: $${total}`;
        window.open(url, '_blank');
 });

    cancelarButton.addEventListener('click', () => {
        carrito = [];
        actualizarCarrito();
    });
});