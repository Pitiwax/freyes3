// Función para obtener los datos del cliente a actualizar
function obtenerDatosCliente() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCliente = urlParams.get('id');

    fetch(`http://144.126.210.74:8080/api/cliente/${idCliente}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del cliente.');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('id_cliente').value = data.id_cliente;
            document.getElementById('nombre').value = data.nombres;
            document.getElementById('apellido').value = data.apellidos;
            document.getElementById('email').value = data.email;
            document.getElementById('celular').value = data.celular;
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('alerta_actualizar', 'danger', 'Error al obtener los datos del cliente.');
        });
}

// Función para actualizar un cliente
function actualizarCliente() {
    const idCliente = document.getElementById('id_cliente').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const celular = document.getElementById('celular').value;
    const fechaRegistro = obtenerFechaHora();

    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombres: nombre,
            apellidos: apellido,
            email: email,
            celular: celular,
            fecha_registro: fechaRegistro
        })
    };

    fetch(`http://144.126.210.74:8080/api/cliente/${idCliente}`, requestOptions)
        .then(response => {
            if (response.ok) {
                mostrarAlerta('alerta_actualizar', 'success', 'Cliente actualizado correctamente.');
                setTimeout(() => {
                    window.location.href = 'listar.html';
                }, 1500); // Redirigir después de 1.5 segundos
            } else {
                throw new Error('Error al actualizar el cliente.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('alerta_actualizar', 'danger', 'Error al actualizar el cliente.');
        });
}

// Función para eliminar un cliente
function eliminarCliente(id) {
    const requestOptions = {
        method: "DELETE"
    };

    fetch(`http://144.126.210.74:8080/api/cliente/${id}`, requestOptions)
        .then(response => {
            if (response.ok) {
                mostrarAlerta('alerta_eliminar', 'success', 'Cliente eliminado correctamente.');
                setTimeout(() => {
                    window.location.href = 'listar.html';
                }, 1500); // Redirigir después de 1.5 segundos
            } else {
                throw new Error('Error al eliminar el cliente.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('alerta_eliminar', 'danger', 'Error al eliminar el cliente.');
        });
}

// Función para mostrar una alerta de Bootstrap
function mostrarAlerta(idAlerta, tipo, mensaje) {
    const alerta = document.getElementById(idAlerta);
    alerta.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                            ${mensaje}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
    alerta.classList.remove('d-none');
}

// Función para listar clientes
function listarCliente() {
    fetch("http://144.126.210.74:8080/api/cliente?_size=200")
        .then(response => response.json())
        .then(data => {
            data.forEach(cliente => {
                completarFila(cliente); // Función para completar una fila de la tabla
            });
            $('#tbl_cliente').DataTable(); // Inicializar DataTable en la tabla de clientes
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta('alerta_listar', 'danger', 'Error al listar los clientes.');
        });
}

// Función para completar una fila en la tabla de clientes
function completarFila(cliente) {
    var fechaFormateada = formatearFechaHora(cliente.fecha_registro);

    // Asegurarse de que los valores no sean undefined o null
    var id = cliente.id_cliente !== undefined ? cliente.id_cliente : '';
    var nombre = cliente.nombres !== undefined ? cliente.nombres : '';
    var apellido = cliente.apellidos !== undefined ? cliente.apellidos : '';

    // Asumiendo que #tbl_cliente es el ID de la tabla en listar.html
    $('#tbl_cliente tbody').append(`
        <tr>
            <td>${id}</td>
            <td>${nombre}</td>
            <td>${apellido}</td>
            <td>${cliente.email}</td>
            <td>${cliente.celular}</td>
            <td>${fechaFormateada}</td>
            <td>
                <a href='actualizar.html?id=${id}' class='btn btn-warning btn-sm'>Actualizar</a>
                <button onclick="eliminarCliente(${id})" class='btn btn-danger btn-sm'>Eliminar</button>
            </td>
        </tr>
    `);
}

// Función para obtener la fecha y hora actual formateada
function obtenerFechaHora() {
    var fechaHoraActual = new Date();
    var fechaFormateada = fechaHoraActual.toLocaleString('es-ES', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/, '$3-$2-$1 $4:$5:$6');

    return fechaFormateada;
}

// Función para formatear fecha y hora desde el servidor
function formatearFechaHora(fecha_registro) {
    var fechaHoraActual = new Date(fecha_registro);
    var fechaFormateada = fechaHoraActual.toLocaleString('es-ES', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/, '$3-$2-$1 $4:$5');

    return fechaFormateada;
}

// Llamar a la función para listar clientes cuando el DOM esté cargado
$(document).ready(function() {
    listarCliente();
});
