const API = "https://api.thedogapi.com/v1/images/search";
const cardContainer = document.querySelector('.card-container');
const buttonCreate = document.getElementById("create-btn");
const buttonDelete = document.getElementById("delete-btn");
const buttonReset = document.getElementById("reset-btn");

const createNode = async () => {
    try {
        const response = await fetch(API);
        const data = await response.json();
        const imageUrl = data[0].url;

        const card = document.createElement('div');
        card.className = 'card';

        const imagen = document.createElement('img');
        imagen.className = 'card__img'
        imagen.alt = 'Foto de un gatito'
        imagen.src = imageUrl;

        card.appendChild(imagen);
        cardContainer.appendChild(card);

    } catch (error) {
        console.log(`This is the error => ${error}`);
    }
};

const resetNode = () => {
    const card = document.querySelectorAll('.card');
    card.forEach((image) => {
        cardContainer.removeChild(image);
    })
}

const deleteNode = () => {
    const cards = document.querySelectorAll('.card');
    const numberOfElements = cards.length;
    const lastNode = cards[numberOfElements - 1];
    cardContainer.removeChild(lastNode);
};

buttonCreate.addEventListener("click", createNode);
buttonDelete.addEventListener("click", deleteNode);
buttonReset.addEventListener("click", resetNode);

// fetch(API)
//     .then(response => response.json())
//     .then(data => {
//         const image = document.querySelector(".card__img");
//         image.src = data[0].url;
//     })
