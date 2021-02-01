//variables globales
let contador = 1, cantFinal, precioFinal;
let cardsTouch = [];


//llama a la api una vez el dom este cargado por completo
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
})


//crea el precio aleatorio
const cost = () => {
    let cost = Math.floor(Math.random() * (20 - 5)) + 5;
    return cost
}


//pinta las cards
pintarCard = data => {
    const divs = document.createElement('div');
    divs.innerHTML = `
    <img id="img" class="card-img-top" src="${data.sprites.other.dream_world.front_default}" alt="${data.forms[0].name}">
<div class="card-body">
<h5 class="card-title">${data.forms[0].name}</h5>
<p class="card-text">$${cost()}</p>
<button type="button" class="form-control btn btn-primary">Comprar</button>
</div>`
    divs.classList.add('card', 'm-3', 'p-3', 'text-center');
    templateCards.appendChild(divs);
}


//refleja los cambios finales del carrito
const final = () => {
    cantFinal = document.querySelector('.cantFinal');
    precioFinal = document.querySelector('.precioFinal');
    const carroFinal = document.querySelectorAll('.carro');
    let sumaTotal = 0;
    let precioTotal = 0;

    for (let i = 0; i < carroFinal.length; i++) {
        sumaTotal = parseInt(sumaTotal) + parseInt(carroFinal[i].children[3].children[0].value);
        precioTotal = parseInt(precioTotal) + parseInt(carroFinal[i].children[4].innerHTML.split('').slice(1, 10).join(''));
        cantFinal.innerHTML = sumaTotal;
        precioFinal.innerHTML = "$" + precioTotal;
    }
}


const limpiarTodo = () => {
    const vaciarCarro = document.querySelector('.limpiarTodo');

    vaciarCarro.addEventListener('click', () => {
        const tBody = document.querySelector('tbody');
        tBody.innerHTML = '';
        contador = 1;
        cardsTouch = [];
        cantFinal.innerHTML = 0;
        precioFinal.innerHTML = "$" + 0
    })
}


//pinta el carrito cuando se toca el boton
const addCarrito = () => {
    cards = document.querySelectorAll('.card');
    tBody = document.querySelector('tbody');
    fragment = document.createDocumentFragment();
    contador = 1;
    cardsTouch = [];

    //recorre botones, cuando tocan el boton comprar se realiza la funcion
    cards.forEach(e => {
        
        e.childNodes[3].childNodes[5].addEventListener('click', () => {
            //si el array incluye el elemento que pasamos en el else entra, selecciona los inputs de cantidad y los recorre buscando una igualdad en los id, si existe la igualdad suma 1 sin agregar un elemento nuevo y se le suma el precio multiplicado con la cantidad.
            if (cardsTouch.includes(e)) {
                const cantidad = document.querySelectorAll('.inputNumber');
                cantidad.forEach(element => {
                    if (element.id === e.childNodes[3].childNodes[5].id) {
                        cantidad[element.id - 1].value++;
                        cantidad[element.id - 1].parentElement.nextElementSibling.innerHTML = "$" + e.childNodes[3].childNodes[5].parentNode.childNodes[3].innerHTML.split('').slice(1, 10).join('') * cantidad[element.id - 1].value;
                        final();
                    }
                });

            } else {//se crea una linea de la tabla y se hace push el elemento a un array
                const trHTML = document.createElement('tr');
                trHTML.classList.add('carro')
                e.childNodes[3].childNodes[5].setAttribute('id', contador);
                trHTML.innerHTML =
                    `<td> ${contador++}
            <img class="carritoImages" src="${e.childNodes[1].src}" alt="${e.childNodes[1].alt}"></th>
            <td>${e.childNodes[1].alt}</td>
            <td>${e.childNodes[3].childNodes[3].innerHTML}</td>
            <td>
            <input type="number" value= 1 class="inputNumber" id="${contador - 1}"></input>
            </td>
            <td>${e.childNodes[3].childNodes[3].innerHTML}</td>
            <td></td>`
                fragment.appendChild(trHTML);
                tBody.appendChild(fragment);
                cardsTouch.push(e);
                final();

                //input con la cantidad esperando el evento cambio
                const cantidad = document.querySelectorAll('.inputNumber')
                cantidad.forEach(element => {
                    element.addEventListener('change', () => {
                        cantidad[element.id - 1].parentElement.nextElementSibling.innerHTML = "$" + element.parentNode.previousElementSibling.innerHTML.split('').slice(1, 10).join('') * cantidad[element.id - 1].value;
                        
                        final();
                    })
                });
            }
        });
    });
};




//llama a la api y se le pasa las funciones creadas anteriormente
const fetchData = async () => {
    try {
        let arrId = [];
        for (let i = 0; i < 4; i++) {
            //si el id ya esta push en arrId no lo llama

            templateCards = document.querySelector('section');
            let id = Math.floor(Math.random() * (151 - 1)) + 1;

            while (arrId.includes(id)) {
                id = Math.floor(Math.random() * (151 - 1)) + 1;
            }
            arrId.push(id);

            //llama a la api de pokemon, a un ID aleatorio
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            const data = await res.json()

            pintarCard(data)

        }
        addCarrito();
        limpiarTodo();

    } catch (e) {
        console.log(e)
    }
}
