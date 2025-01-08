// Variables
const formulario = document.querySelector('.formulario')
const moderador = document.querySelector('#moderador');
const participanteContenedor = document.querySelector('#participantes');
const resultado = document.querySelector('#resultado');
const continuar = document.querySelector('#continuar');
const intercambiar = document.querySelector('#intercambiar');
const moderadorTarjeta = document.querySelector('.moderador-tarjeta');
const participantesTarjeta = document.querySelector('.participantes-tarjeta');
let participantes = [];

// EventListeners
cargarEvenetListeners();
function cargarEvenetListeners() {
    continuar.addEventListener('click', guardarModerador);

    participanteContenedor.addEventListener('input', verificarUltimoInput)

    participantesTarjeta.addEventListener('click', e => {
        if(e.target.closest('.svg')) {
            borrarContenido(e);
        }
    })

    intercambiar.addEventListener('click', guardarParticipantes);
}

// Funciones
function guardarModerador(e) {
    e.preventDefault();

    if(moderador.value === '') {
        console.log('no hay nada');

        return;
    } else {
        const moderadorGuardado = moderador.value;
        leerDatosCurso(moderadorGuardado);
        mostrarModerador();

        moderadorTarjeta.classList.add('hidden');
        participantesTarjeta.classList.remove('hidden');
    }
}

function mostrarModerador() {
    console.log(participantes);

    // Recorre el carrito y genera el HTML
    participantes.forEach( participante => {
        const { nombre } = participante;
        
        const row = document.createElement('DIV');
        row.innerHTML = `
            <input class="invalid" type="text" placeholder="${nombre}" disabled>
            <div class="participantes-input">
                <input type="text" placeholder="Participante 2">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C2C2C2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" stroke-width="2" data-id="2"> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path> </svg> 
            </div>
            <div class="participantes-input">
                <input type="text" placeholder="Participante 3">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C2C2C2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" stroke-width="2" data-id="3"> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path> </svg> 
            </div>
        `;

        // Agrega el HTML del carrito en el tbody
        participanteContenedor.appendChild(row);
    })
}

function leerDatosCurso(nombre) {
    // Crear un objeto con el contenido del curso actual
    const infoIntercambio = {
        nombre: nombre
    }

    console.log(participantes);

    // Revisa si un elemento ya existe en el carrito
    const existe = participantes.some( nombre => nombre.value === infoIntercambio.nombre );
    console.log(existe);

    if(existe) {
        return;
    } else {
        // Agrega elementos al arreglo de carrito
        participantes = [...participantes, infoIntercambio];
    }

    console.log(participantes);
}

function verificarUltimoInput(e) {
    const inputs = participanteContenedor.querySelectorAll('input[type="text"]');
    const ultimoInput = inputs[inputs.length - 1];

    // Si el evento proviene del último input y tiene contenido, se agrega un nuevo input
    if (e.target === ultimoInput && e.target.value.trim() !== '') {
        agregarNuevoInput(inputs.length + 1); // Incrementa el contador para el nuevo placeholder
    }
}

function agregarNuevoInput(indice) {
    const nuevoInput = document.createElement('DIV');
    nuevoInput.classList.add('participantes-input');
    nuevoInput.innerHTML = `
        <input type="text" placeholder="Participante ${indice}">
        <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C2C2C2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" stroke-width="2" data-id="${indice}"> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path> </svg>
    `;

    // Agrega el nuevo input al contenedor
    participanteContenedor.appendChild(nuevoInput);
}

function borrarContenido(e) {
    const participanteId = e.target.getAttribute('data-id');
    const input = e.target.closest('.participantes-input').querySelector('input');
    const valor = input.value.trim();
    const div = e.target.closest('.participantes-input');

    if(participanteId <= 3) {
        input.value = '';
    } else {
        div.remove();
    }

    // Ahora, eliminamos el participante del arreglo de participantes
    participantes = participantes.filter(participante => participante.nombre !== valor); // Filtramos el arreglo para remover el participante con ese ID

    console.log(participantes)
}

function guardarParticipantes(e) {
    e.preventDefault();

    const inputs = e.target.parentElement.parentElement.querySelectorAll('#participantes input[type="text"]');

    // Convierte los inputs en un array para asegurar compatibilidad al usar forEach con índice
    Array.from(inputs).forEach((input, index) => {
        if (input.value.trim() !== '') { // Verifica que el input no esté vacío
            const nombre = input.value.trim();

            // Verifica que el input no esté vacío
            if (nombre !== '') {
                const infoIntercambio = {
                    nombre: nombre,
                    id: index + 1 // Usamos el índice como ID para el participante
                };

                // Si el participante ya existe en el arreglo, actualizamos el nombre
                const participanteExistente = participantes.find(participante => participante.id === infoIntercambio.id);
                if (participanteExistente) {
                    // Si ya existe, solo actualizamos el nombre
                    participanteExistente.nombre = infoIntercambio.nombre;
                } else {
                    // Si no existe, lo agregamos al arreglo
                    participantes = [...participantes, infoIntercambio];
                }
            }
        }
    });

    console.log(participantes);

    // Formar los grupos y obtener las asignaciones
    const resultado = formarGrupos(participantes);

    // Mostrar las asignaciones de regalos en la interfaz
    mostrarAsignaciones(resultado);
}

function formarGrupos(participantes) {
    // Almacenamos los nombres de los participantes
    let nombres = participantes.map(participante => participante.nombre);

    // Mezclamos aleatoriamente los participantes para la asignación de los regalos
    const dar = [...nombres];  // Los que van a dar el regalo
    const recibir = [...nombres];  // Los que van a recibir el regalo

    // Aseguramos que no sea el mismo participante (no se pueden dar regalos a sí mismos)
    const asignaciones = [];

    while (dar.length > 0) {
        let darIndex = Math.floor(Math.random() * dar.length);
        let recibirIndex = Math.floor(Math.random() * recibir.length);

        // Aseguramos que no sea el mismo participante (no se pueden dar regalos a sí mismos)
        while (dar[darIndex] === recibir[recibirIndex]) {
            recibirIndex = Math.floor(Math.random() * recibir.length);
        }

        // Realizamos la asignación
        asignaciones.push({ da: dar[darIndex], recibe: recibir[recibirIndex] });

        // Eliminar los participantes que ya han sido asignados
        dar.splice(darIndex, 1);
        recibir.splice(recibirIndex, 1);
    }

    // Devolvemos las asignaciones
    return asignaciones;
}

function mostrarAsignaciones(asignaciones) {
    const resultadoDiv = document.querySelector('#resultado'); // Asegúrate de tener un contenedor con id="resultado"

    // Limpiar cualquier contenido previo
    resultadoDiv.innerHTML = '';

    // Iteramos sobre las asignaciones y creamos una tarjeta para cada una
    asignaciones.forEach(asignacion => {
        // Genera id unico para cada tarjeta
        const id = Math.random().toString(36).substring(2) + Date.now()

        const tarjeta = document.createElement('DIV');
        tarjeta.classList.add('intercambio');
        tarjeta.setAttribute('id', id)

        tarjeta.innerHTML = `
            <div class="tarjetaContenedor">
                <div class="tarjeta">
                    <div class="front">
                        <h2>Intercambio de ${asignacion.da}</h2>
                    </div>
                    <div class="back">
                        <p>${asignacion.da}</p>
                        <svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="1.5"> 
                            <path d="M12 11v10"></path> 
                            <path d="M9 18l3 3l3 -3"></path> 
                            <path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path> 
                        </svg> 
                        <p>${asignacion.recibe}</p>
                    </div>
                </div>
            </div>
        `;

        // Agregar la tarjeta al contenedor de resultados
        resultadoDiv.appendChild(tarjeta);
    });
}

