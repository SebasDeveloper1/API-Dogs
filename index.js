const API_KEY = 'api_key=955a92ce-ac0d-46ad-bbec-1283985de388';
const API = `https://api.thedogapi.com/v1/images/search?${API_KEY}`;
// const API = `https://api.thedogapi.com/v1/images/search`;
const main = document.querySelector('.main');
const cardContainer = document.querySelector('.card-container');

/**
 * It fetches the data from the API, then it creates a div with the class 'card' and an image with the
 * class 'card__img' and the source of the image is the url of the image from the API.
 *
 * Then it appends the image to the div and the div to the cardContainer.
 */
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

/**
 * It takes the value of the input, makes a fetch request to the API, creates a div element for each
 * object in the response, and appends the divs to the DOM.
 */
const createMultipleNodes = async () => {
    const input = document.getElementById('input-quantity');
    const valueInput = input.value;

    if (valueInput !== '') {
        try {
            const response = await fetch(`${API}&limit=${valueInput}`);
            const data = await response.json();
            const arrayNodes = [];
            data.forEach(element => {
                const card = document.createElement('div');
                card.className = 'card';

                const imagen = document.createElement('img');
                imagen.className = 'card__img'
                imagen.alt = 'Foto de un gatito'
                imagen.src = element.url;
                card.appendChild(imagen);
                arrayNodes.push(card);
            });

            cardContainer.append(...arrayNodes);

        } catch (error) {
            console.log(`This is the error => ${error}`);
        }
    }
}

/**
 * This function removes all the cards from the card container.
 */
const resetNode = () => {
    const card = document.querySelectorAll('.card');
    card.forEach((image) => {
        cardContainer.removeChild(image);
    })
}

/**
 * It removes the last child of the element with the class name 'card-container'.
 */
const deleteNode = () => {
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        const numberOfElements = cards.length;
        const lastNode = cards[numberOfElements - 1];
        cardContainer.removeChild(lastNode);
    }
};


/* An event listener that is listening for a click event. */
main.addEventListener('click', (e) => {
    e.preventDefault();
    switch (e.target.id) {
        case 'create-btn':
            createNode();
            break;

        case 'delete-btn':
            deleteNode();
            break;

        case 'reset-btn':
            resetNode();
            break;

        case 'add-quantity':
            createMultipleNodes();
            break;
        default:
            break;
    }
});

// fetch(API)
//     .then(response => response.json())
//     .then(data => {
//         const image = document.querySelector('.card__img');
//         image.src = data[0].url;
//     })
