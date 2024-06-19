var g_id_resultado = ""; // Variable global para almacenar el ID del resultado seleccionado

// Función para agregar un nuevo resultado
function agregarResultado() {
    var nombre_resultado = document.getElementById("txt_nombre_resultado").value.trim();
    if (!nombre_resultado) {
        alert('Por favor, ingresa un nombre de resultado válido.');
        return;
    }

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "nombre_resultado": nombre_resultado,
            "fecha_registro": new Date().toISOString().slice(0, 19).replace('T', ' ')
        })
    };

    fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
        .then(response => {
            if (response.ok) {
                location.href = "listar.html";
            } else {
                throw new Error('Error al agregar resultado');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para listar resultados
function listarResultado() {
    fetch("http://144.126.210.74:8080/api/resultado")
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                completarFila(element);
            });
            $('#tbl_resultado').DataTable(); // Inicializar DataTable
        })
        .catch(error => console.error('Error al listar resultados:', error));
}

// Función para completar una fila en la tabla de resultados
function completarFila(element) {
    // Formatear la fecha
    const fechaRegistro = new Date(element.fecha_registro).toLocaleString('es-ES', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    document.getElementById("data").innerHTML +=
        `<tr>
            <td>${element.id_resultado}</td>
            <td>${element.nombre_resultado}</td>
            <td>${fechaRegistro}</td>
            <td>
                <a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger btn-sm'>Eliminar</a>
            </td>
        </tr>`;
}

// Función para obtener el ID de actualización desde la URL
function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id_resultado = urlParams.get('id');
    g_id_resultado = id_resultado;

    obtenerDatosActualizacion(id_resultado);
}

// Función para obtener datos de actualización de un resultado
function obtenerDatosActualizacion(id_resultado) {
    fetch(`http://144.126.210.74:8080/api/resultado/${id_resultado}`)
        .then(response => response.json())
        .then(data => completarFormularioActualizar(data))
        .catch(error => console.error('Error al obtener datos para actualizar:', error));
}

// Función para completar el formulario de actualización
function completarFormularioActualizar(data) {
    document.getElementById('txt_nombre_resultado').value = data.nombre_resultado;
}

// Función para actualizar un resultado
function actualizarResultado() {
    var nombre_resultado = document.getElementById("txt_nombre_resultado").value.trim();
    if (!nombre_resultado) {
        alert('Por favor, ingresa un nombre de resultado válido.');
        return;
    }

    const requestOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "nombre_resultado": nombre_resultado
        })
    };

    fetch(`http://144.126.210.74:8080/api/resultado/${g_id_resultado}`, requestOptions)
        .then(response => {
            if (response.ok) {
                location.href = "listar.html";
            } else {
                throw new Error('Error al actualizar resultado');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar un resultado
function eliminarResultado() {
    if (!g_id_resultado) {
        console.error('ID de resultado no válido.');
        return;
    }

    const requestOptions = {
        method: "DELETE"
    };

    fetch(`http://144.126.210.74:8080/api/resultado/${g_id_resultado}`, requestOptions)
        .then(response => {
            if (response.ok) {
                location.href = "listar.html";
            } else {
                throw new Error('Error al eliminar resultado');
            }
        })
        .catch(error => console.error('Error:', error));
}
