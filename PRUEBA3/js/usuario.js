var g_id_usuario = "";

// Función para agregar un usuario nuevo
function agregarUsuario() {
    var nombres = document.getElementById("txt_nombres").value;
    var apellidos = document.getElementById("txt_apellidos").value;
    var email = document.getElementById("txt_email").value;
    var celular = document.getElementById("txt_celular").value;
    var username = document.getElementById("txt_username").value;
    var password = document.getElementById("txt_password").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechaActual = obtenerFechaHora();

    const raw = JSON.stringify({
        "nombres": nombres,
        "apellidos": apellidos,
        "email": email,
        "celular": celular,
        "username": username,
        "password": password,
        "fecha_registro": fechaActual
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
        .then(response => {
            if (response.ok) {
                location.href = "listar.html";
            } else {
                throw new Error('Error al agregar usuario');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para listar todos los usuarios
function listarUsuarios() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/?_size=200", requestOptions)
        .then(response => response.json())
        .then(json => {
            json.forEach(completarFila);
            $('#tbl_usuario').DataTable();
        })
        .catch(error => console.error('Error al listar usuarios:', error));
}

// Función para completar una fila en la tabla de usuarios
function completarFila(element, index, arr) {
    var fechaFormateada = formatearFechaHora(element.fecha_registro);

    arr[index] = document.querySelector("#tbl_usuario tbody").innerHTML +=
        `<tr>
            <td>${element.id_usuario}</td>
            <td>${element.nombres}</td>
            <td>${element.apellidos}</td>
            <td>${element.email}</td>
            <td>${element.celular}</td>
            <td>${element.username}</td>
            <td>${fechaFormateada}</td>
            <td>
                <a href='actualizar.html?id=${element.id_usuario}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_usuario}' class='btn btn-danger btn-sm'>Eliminar</a>
            </td>
        </tr>`;
}

// Función para obtener el ID de usuario de la URL en actualizar.html
function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_usuario = parametros.get('id');
    g_id_usuario = p_id_usuario;

    obtenerDatosActualizacion(p_id_usuario);
}

// Función para obtener los datos del usuario a actualizar
function obtenerDatosActualizacion(id_usuario) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/" + id_usuario, requestOptions)
        .then(response => response.json())
        .then(json => completarFormularioActualizar(json))
        .catch(error => console.error('Error al obtener datos para actualizar:', error));
}

// Función para completar el formulario de actualización con los datos del usuario
function completarFormularioActualizar(element) {
    document.getElementById('txt_nombres').value = element.nombres || '';
    document.getElementById('txt_apellidos').value = element.apellidos || '';
    document.getElementById('txt_email').value = element.email || '';
    document.getElementById('txt_celular').value = element.celular || '';
    document.getElementById('txt_username').value = element.username || '';
}

// Función para actualizar un usuario
function actualizarUsuario() {
    var nombres = document.getElementById("txt_nombres").value;
    var apellidos = document.getElementById("txt_apellidos").value;
    var email = document.getElementById("txt_email").value;
    var celular = document.getElementById("txt_celular").value;
    var username = document.getElementById("txt_username").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombres": nombres,
        "apellidos": apellidos,
        "email": email,
        "celular": celular,
        "username": username
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/" + g_id_usuario, requestOptions)
        .then(response => {
            if (response.ok) {
                location.href = "listar.html";
            } else {
                throw new Error('Error al actualizar usuario');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar un usuario
function eliminarUsuario() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/usuario/" + g_id_usuario, requestOptions)
        .then(response => {
            if (response.ok) {
                location.href = "listar.html";
            } else {
                throw new Error('Error al eliminar usuario');
            }
        })
        .catch(error => console.error('Error:', error));
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

// Función para formatear la fecha y hora desde la API
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
