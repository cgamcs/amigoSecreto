// Variables
const moderador = document.querySelector('#moderador');
const participanteContenedor = document.querySelector('#participantes');
const continuar = document.querySelector('#continuar');
const intercambiar = document.querySelector('#intercambiar');
const moderadorTarjeta = document.querySelector('.moderador-tarjeta');
const participantesTarjeta = document.querySelector('.participantes-tarjeta');
let participantes = [];

// EventListeners
cargarEvenetListeners();
function cargarEvenetListeners() {
    continuar.addEventListener('click', guardarModerador);
    participanteContenedor.addEventListener('input', verificarUltimoInput);

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
    const div = e.target.closest('.participantes-input');
    const participantes = e.target.closest('#participantes')

    console.log(participantes);

    if(participanteId <= 3) {
        input.value = '';
    } else {
        div.remove();
    }

    console.log(participanteId);
}

function guardarParticipantes(e) {
    e.preventDefault();

    const inputs = e.target.parentElement.parentElement.querySelectorAll('#participantes input[type="text"]');

    // Convierte los inputs en un array para asegurar compatibilidad al usar forEach con índice
    Array.from(inputs).forEach((input, index) => {
        if (input.value.trim() !== '') { // Verifica que el input no esté vacío
            const infoIntercambio = {
                nombre: input.value.trim()
            };

            if (participantes[index]) {
                // Si el índice ya existe en el array, actualiza el objeto
                participantes[index] = infoIntercambio;
            } else {
                // Si el índice no existe, agrega el objeto al array
                participantes = [...participantes, infoIntercambio];
            }
        }
    });
    
    console.log(participantes)
}