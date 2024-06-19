var g_id_gestion = "";

function agregarGestion() {
    var id_usuario = document.getElementById("sel_id_usuario").value;
    var id_cliente = document.getElementById("sel_id_cliente").value;
    var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
    var id_resultado = document.getElementById("sel_id_resultado").value;
    var comentarios = document.getElementById("txt_comentarios").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "id_usuario": id_usuario,
        "id_cliente": id_cliente,
        "id_tipo_gestion": id_tipo_gestion,
        "id_resultado": id_resultado,
        "comentarios": comentarios,
        "fecha_registro": "2024-06-04 17:29:00" // Aquí puedes ajustar para obtener la fecha actual
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
        .then(response => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else if (response.status == 400) {
                alert("Se ha producido un error al agregar");
            }
        })
        .catch(error => console.error(error));
}

function listarGestion() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "query": "select ges.id_gestion as id_gestion,cli.id_cliente, ges.comentarios as comentarios,CONCAT(cli.nombres, ' ',cli.apellidos) as nombre_cliente,CONCAT(usu.nombres,' ' ,usu.apellidos) as nombre_usuario,tge.nombre_tipo_gestion as nombre_tipo_gestion,res.nombre_resultado as nombre_resultado,ges.fecha_registro as fecha_registro from gestion ges,usuario usu,cliente cli,tipo_gestion tge,resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado"
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
        .then(response => response.json())
        .then(json => {
            json.forEach(completarFila);
            $('#tbl_gestion').DataTable();
        })
        .catch(error => console.log('error', error));
}

function completarFila(element, index, arr) {
    arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML +=
        `<tr>
<td>${element.id_gestion}</td>
<td>${element.nombre_cliente}</td>
<td>${element.nombre_usuario}</td>
<td>${element.nombre_tipo_gestion}</td>
<td>${element.nombre_resultado}</td>
<td>${element.comentarios}</td>
<td>${element.fecha_registro}</td>
<td>
<a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
<a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a> 
</td>
</tr>`;
}

function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;

    obtenerDatosActualizacion(p_id_gestion);
}

function obtenerIdEliminacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;

    obtenerDatosEliminacion(p_id_gestion);
}

function obtenerDatosEliminacion(id_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + id_gestion, requestOptions)
        .then(response => response.json())
        .then(json => completarEtiquetaEliminar(json))
        .catch(error => console.error(error));
}

function obtenerDatosActualizacion(id_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + id_gestion, requestOptions)
        .then(response => response.json())
        .then(json => completarFormularioActualizar(json))
        .catch(error => console.error(error));
}

function completarEtiquetaEliminar(data) {
    var nombreCliente = data.nombre_cliente; // Ajusta según la estructura de tu JSON de respuesta
    document.getElementById('lbl_eliminar').innerHTML = `¿Desea eliminar la gestión del cliente <b>${nombreCliente}</b>?`;
}

function completarFormularioActualizar(data) {
    // Aquí completas el formulario de actualización con los datos obtenidos
    var id_cliente = data.id_cliente;
    var id_usuario = data.id_usuario;
    var id_tipo_gestion = data.id_tipo_gestion;
    var id_resultado = data.id_resultado;
    var comentarios = data.comentarios;

    // Asignar valores a los campos del formulario
    document.getElementById('sel_id_cliente').value = id_cliente;
    document.getElementById('sel_id_usuario').value = id_usuario;
    document.getElementById('sel_id_tipo_gestion').value = id_tipo_gestion;
    document.getElementById('sel_id_resultado').value = id_resultado;
    document.getElementById('txt_comentarios').value = comentarios;
}

function actualizarGestion() {
    var id_cliente = document.getElementById("sel_id_cliente").value;
    var id_usuario = document.getElementById("sel_id_usuario").value;
    var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
    var id_resultado = document.getElementById("sel_id_resultado").value;
    var comentarios = document.getElementById("txt_comentarios").value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "id_cliente": id_cliente,
        "id_usuario": id_usuario,
        "id_tipo_gestion": id_tipo_gestion,
        "id_resultado": id_resultado,
        "comentarios": comentarios
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://144.126.210.74:8080/api/gestion/" + g_id_gestion, requestOptions)
        .then(response => {
            if (response.status == 200) {
                location.href = "listar.html";
            } else {
                alert("No se pudo actualizar la gestión. Inténtalo de nuevo más tarde.");
            }
        })
        .catch(error => console.error(error));
}

function cargarListasDesplegables() {
    cargarSelectCliente();
    cargarSelectUsuario();
    cargarSelectTipoGestion();
    cargarSelectResultado();
}

function cargarSelectCliente() {
    fetch("http://144.126.210.74:8080/api/cliente")
        .then(response => response.json())
        .then(data => {
            var select = document.getElementById('sel_id_cliente');
            data.forEach(cliente => {
                var option = document.createElement('option');
                option.value = cliente.id_cliente;
                option.textContent = `${cliente.nombres} ${cliente.apellidos}`;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

function cargarSelectUsuario() {
    fetch("http://144.126.210.74:8080/api/usuario")
        .then(response => response.json())
        .then(data => {
            var select = document.getElementById('sel_id_usuario');
            data.forEach(usuario => {
                var option = document.createElement('option');
                option.value = usuario.id_usuario;
                option.textContent = `${usuario.nombres} ${usuario.apellidos}`;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

function cargarSelectTipoGestion() {
    fetch("http://144.126.210.74:8080/api/tipo_gestion")
        .then(response => response.json())
        .then(data => {
            var select = document.getElementById('sel_id_tipo_gestion');
            data.forEach(tipo => {
                var option = document.createElement('option');
                option.value = tipo.id_tipo_gestion;
                option.textContent = tipo.nombre_tipo_gestion;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

function cargarSelectResultado() {
    fetch("http://144.126.210.74:8080/api/resultado")
        .then(response => response.json())
        .then(data => {
            var select = document.getElementById('sel_id_resultado');
            data.forEach(resultado => {
                var option = document.createElement('option');
                option.value = resultado.id_resultado;
                option.textContent = resultado.nombre_resultado;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}
