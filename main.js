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
<button class="btn btn-primary w-100">Comprar</button>
</div>`
    divs.classList.add('card', 'm-3', 'p-3', 'text-center');
    templateCards.appendChild(divs);
}
//refleja los cambios finales del carrito
const final = () => {
    const cantFinal = document.querySelector('.cantFinal');
    const precioFinal = document.querySelector('.precioFinal');
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

//pinta el carrito cuando se toca el boton
const addCarrito = () => {
    const cards = document.querySelectorAll('.card');
    const tBody = document.querySelector('tbody');
    const fragment = document.createDocumentFragment();
    let contador = 1;
    let cardsTouch = [];

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
            <td>
            <button class="btn btn-danger">X</button>
            </td>`
                fragment.appendChild(trHTML);
                tBody.appendChild(fragment);
                cardsTouch.push(e);
                final();

                //input con la cantidad esperando el evento cambio
                const cantidad = document.querySelectorAll('.inputNumber')
                cantidad.forEach(element => {
                    element.addEventListener('change', () => {
                        cantidad[element.id - 1].parentElement.nextElementSibling.innerHTML = "$" + e.childNodes[3].childNodes[5].parentNode.childNodes[3].innerHTML.split('').slice(1, 10).join('') * cantidad[element.id - 1].value;
                        //si con el input baja hasta 0 se limpia el elemento
                        if (cantidad[element.id - 1].parentElement.nextElementSibling.innerHTML === "$0") {
                            element.parentElement.parentElement.remove()
                            final()
                        }
                        final();
                    })
                });
                //click a borrar se limpia el elemento
                const clear = document.querySelectorAll('.btn-danger');
                clear.forEach(element => {
                    element.addEventListener('click', () => {
                        element.parentElement.parentElement.remove()
                        final()
                    })
                });
            }
        });
    });
};

//llama a la api una vez el dom este cargado por completo
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
})

//llama a la api
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

    } catch (e) {
        console.log(e)
    }
}
