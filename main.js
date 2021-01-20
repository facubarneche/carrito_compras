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

//pinta el carrito cuando se toca el boton
const addCarrito = data => {
    let cont = 1, cant = 1;
    const cardBody = document.querySelectorAll('.card-body');
    //recorremos el html de cardbody
    cardBody.forEach(card => {
        //si se toca el boton, se agrega al carrito
        card.children[2].addEventListener('click', () => {
            const tbody = document.querySelector('tbody');
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <th scope="row">${cont++}</th>
            <td>${card.childNodes[1].outerText}</td>
            <td>${cant}</td>
            <td>
            <button class="btn-success">+</button>
            <button class="btn-danger">-</button>
            </td>
            <td>${card.childNodes[3].outerText}</td>`
            tr.classList.add('items-card')
            tbody.appendChild(tr);
            trs = document.querySelectorAll('.items-card');

            //recorre los elemento, si el nuevo ya existe, hace las sumas sin agregarlo al carrito
            for (i = 0; i < trs.length - 1; i++) {
                if (trs[i].children[1].textContent === trs[trs.length - 1].children[1].textContent) {
                    cont--;
                    trs[i].children[2].textContent++;
                    trs[i].children[4].innerHTML = `$${parseInt(card.childNodes[3].outerText.split("").splice(1, 6).join("")) * parseInt(trs[i].children[2].textContent)}`
                    tbody.removeChild(tr)
                }
            }

            //botones de suma y resta
            restar = document.querySelectorAll('.btn-danger');
            sumar = document.querySelector('.btn-success');
            
            sumar.addEventListener('click',()=>{
                console.log(sumar)
                sumar.parentNode.previousElementSibling.innerHTML++;
            })


            restar.forEach(boton => {
                boton.addEventListener('click', () => {
                    console.log("resta")
                })

            });

        });
    });
}
//llama a la api una vez el dom este cargado por completo
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
})
//llama a la api
const fetchData = async () => {
    try {
        let arrId = [];
        for (let i = 0; i < 2; i++) {
            //si el id ya esta push en arrId no lo llama

    templateCards = document.querySelector('section');
    let id = Math.floor(Math.random() * (151 - 1)) + 1;

    while(arrId.includes(id)){
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
