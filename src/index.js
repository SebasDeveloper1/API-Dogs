import "../public/styles.css";
const axios = require('axios');

const API = process.env.API;
const API_KEY = process.env.API_KEY;
const API_RANDOM = process.env.API_RANDOM;
const API_FAVORITES = process.env.API_FAVORITES;
const API_UPLOAD = process.env.API_UPLOAD;
const API_FAVORITES_DELETE = (id) => `${API_FAVORITES}/${id}`;

const baseAxiosApi = axios.create({
    baseURL: API,
});

baseAxiosApi.defaults.headers.common['X-API-KEY'] = API_KEY;

const main = document.querySelector('.main');
const cardContainer = document.querySelector('.card-container');
const cardContainerFavorites = document.querySelector('.card-container-favorites');

/**
 * It fetches the data from the API, then it creates a div with the class 'card' and an image with the
 * class 'card__img' and the source of the image is the url of the image from the API.
 *
 * Then it appends the image to the div and the div to the cardContainer.
 */
const loadRandomImage = async () => {
    try {
        // const response = await fetch(API);
        // const data = await response.json();

        const { data, status } = await baseAxiosApi.get(API_RANDOM, {
        });

        if (status !== 200) {
            showNotification(`🚨 ${data.message}`);
        } else {
            const imageUrl = data[0].url;
            const imageId = data[0].id;

            const card = document.createElement('div');
            card.className = 'card-random';

            const imagen = document.createElement('img');
            imagen.className = 'card__img'
            imagen.alt = 'Foto de un gatito'
            imagen.src = imageUrl;

            const addFavoriteBtn = document.createElement('button');
            addFavoriteBtn.className = 'button-circle add-favorite-btn';
            addFavoriteBtn.type = 'button';
            addFavoriteBtn.textContent = '⭐';
            addFavoriteBtn.setAttribute('data-idimage', imageId);
            addFavoriteBtn.title = 'Add Favorites';

            card.append(imagen, addFavoriteBtn);
            cardContainer.appendChild(card);
        }
        showNotification(`👍 Added image!`);

    } catch (error) {
        console.log(`This is the error => ${error}`);
    }
};

/**
 * It takes the value of the input, makes a fetch request to the API, creates a div element for each
 * object in the response, and appends the divs to the DOM.
 */
const loadGroupRandomImages = async () => {
    const input = document.getElementById('inputQuantity');
    const valueInput = input.value;

    if (valueInput !== '' && parseInt(valueInput) > 0) {
        try {
            // const response = await fetch(`${API}?limit=${valueInput}`);
            // const data = await response.json();

            const { data, status } = await baseAxiosApi.get(`${API_RANDOM}?limit=${valueInput}`);

            if (status !== 200) {
                showNotification(`🚨 ${data.message}`);
            } else {
                const arrayNodes = [];
                data.forEach(element => {
                    const card = document.createElement('div');
                    card.className = 'card-random';

                    const imagen = document.createElement('img');
                    imagen.className = 'card__img'
                    imagen.alt = 'Foto de un gatito'
                    imagen.src = element.url;

                    const addFavoriteBtn = document.createElement('button');
                    addFavoriteBtn.className = 'button-circle add-favorite-btn';
                    addFavoriteBtn.type = 'button';
                    addFavoriteBtn.textContent = '⭐';
                    addFavoriteBtn.setAttribute('data-idimage', element.id);
                    addFavoriteBtn.title = 'Add Favorites';
                    card.append(imagen, addFavoriteBtn);
                    arrayNodes.push(card);
                });
                cardContainer.append(...arrayNodes);
            }
            showNotification(`👍 ${valueInput} added images!`);
        } catch (error) {
            console.log(`This is the error => ${error}`);
        }
    }
}

const loadFavoritesImages = async () => {
    try {
        // const response = await fetch(API_FAVORITES, {
        //     method: 'GET',
        //     headers: {
        //         'X-API-KEY': API_KEY,
        //     }
        // });
        // const data = await response.json();

        const { data, status } = await baseAxiosApi.get(API_FAVORITES);

        if (status !== 200) {
            showNotification(`🚨 ${data.message}`);
        } else {
            const favoritesImagesContainer = document.querySelectorAll('.card-favorite');
            favoritesImagesContainer.forEach(element => {
                cardContainerFavorites.removeChild(element);
            });

            const arrayNodes = [];
            data.forEach(element => {
                const infoImage = element.image;
                const card = document.createElement('div');
                card.className = 'card-favorite';

                const imagen = document.createElement('img');
                imagen.className = 'card__img'
                imagen.alt = 'Foto de un gatito'
                imagen.src = infoImage.url;

                const removeFavoriteBtn = document.createElement('button');
                removeFavoriteBtn.className = 'button-circle remove-favorite-btn';
                removeFavoriteBtn.type = 'button';
                removeFavoriteBtn.textContent = '❌';
                removeFavoriteBtn.setAttribute('data-idimage', element.id);
                removeFavoriteBtn.title = 'Remove Favorites';
                card.append(imagen, removeFavoriteBtn);
                arrayNodes.push(card);
            });
            cardContainerFavorites.append(...arrayNodes);
        }

    } catch (error) {
        console.log(`This is the error => ${error}`);
    }
};

/**
 * This function removes all the cards from the card container.
 */
const resetRandomImagesSection = () => {
    const card = document.querySelectorAll('.card-random');
    card.forEach((image) => {
        cardContainer.removeChild(image);
    });
    showNotification(`🚀 Deleted images!`);
}

/**
 * It removes the last child of the element with the class name 'card-container'.
 */
const deleteLastImage = () => {
    const cards = document.querySelectorAll('.card-random');
    if (cards.length > 0) {
        const numberOfElements = cards.length;
        const lastNode = cards[numberOfElements - 1];
        cardContainer.removeChild(lastNode);
    }
    showNotification(`✔ Images deleted!`);
};

/**
 * It takes an image id as an argument, and then it sends a POST request to the API_FAVORITES endpoint
 * with the image id as the body of the request.
 * @param idSelectedImage - the id of the image that was clicked on
 */
const saveFavoriteImage = async (idSelectedImage) => {
    try {
        const response = await baseAxiosApi.post(API_FAVORITES, {
            image_id: idSelectedImage,
        });

        // const response = await fetch(API_FAVORITES, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-API-KEY': API_KEY,
        //     },
        //     body: JSON.stringify({
        //         image_id: idSelectedImage,
        //     }),
        // });
        loadFavoritesImages();
        showNotification(`✔ Image added to favorites!`);
    } catch (error) {
        console.log(`This is the error => ${error}`);
    }
};

const deleteFavoriteImage = async (id) => {
    try {
        // const response = await fetch(API_FAVORITES_DELETE(id), {
        //     method: 'DELETE',
        //     headers: {
        //         'X-API-KEY': API_KEY,
        //     },
        // });
        const { data, status } = await baseAxiosApi.delete(API_FAVORITES_DELETE(id));

        if (status !== 200) {
            showNotification(`🚨 ${data.message}`);
        } else {
            loadFavoritesImages();
            showNotification(`✔ Image deleted to favorites!`);
        }
    } catch (error) {
        console.log(`This is the error => ${error}`);
    }
};

const uploadNewImage = async () => {

    try {
        const form = document.getElementById('uploadingForm');
        const formData = new FormData(form);

        const { data, status } = await baseAxiosApi.post(API_UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (status !== 201) {
            showNotification(`🚨 Failed to load image => ${status} ${data.message}`);
        }
        else {
            showNotification(`✔ Uploaded image`);
            saveFavoriteImage(data.id) //para agregar el dog cargado a favoritos.
            //Reset el input
            const preview = document.getElementById('previewFile');
            form.removeChild(preview);
            const imageFile = document.getElementById('imageFile').value = "";
        }
    } catch (error) {
        if (error.response.status === 400) {
            showNotification(`🚨 Please select a valid image!`);
        } else {
            showNotification(`🚨 Failed to load image => ${error}`);
        }
    }

};

function previewImage() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    //usamos el FileReader para sacar la información del archivo del formData
    const reader = new FileReader();

    //Este código es para borrar la miniatura anterior al actualizar el form.
    const preview = document.getElementById('previewFile');
    if (!!preview) {
        form.removeChild(preview);
    }
    //aquí sucede la magia, el reader lee los datos del form.
    reader.readAsDataURL(formData.get('file'))

    //Éste código es para cuando termine de leer la info de la form, cree una imagen miniatura de lo que leyó el form.
    reader.onload = () => {

        if (reader.result !== 'data:') {
            const previewImage = document.createElement('img')
            previewImage.id = 'previewFile';
            previewImage.className = 'form__preview-file';
            previewImage.src = reader.result;
            form.appendChild(previewImage);
        }
    }

}


/**
 * The function creates a new paragraph element, adds a class to it, adds the message to it, adds it to
 * the container, and then animates it.
 * @param notificationMessage - The message you want to display in the notification.
 */
function showNotification(notificationMessage) {
    const containerNotificationError = document.getElementById('containerNotificationError');
    const messageError = document.createElement('p');
    messageError.className = 'notification__error-message'
    messageError.textContent = `${notificationMessage}`;

    containerNotificationError.appendChild(messageError);
    containerNotificationError.style.transform = 'translateY(350px)';

    setTimeout(function () {
        containerNotificationError.style.transform = 'translateY(-350px)';
        containerNotificationError.removeChild(messageError);
    }, 3000);
}

/* An event listener that is listening for a click event. */
main.addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'createBtn':
            loadRandomImage();
            break;

        case 'deleteBtn':
            deleteLastImage();
            break;

        case 'resetBtn':
            resetRandomImagesSection();
            break;

        case 'addQuantityBtn':
            loadGroupRandomImages();
            break;

        case 'addFileBtn':
            uploadNewImage();
            break;
        default:
            break;
    }

    if (e.target.classList.contains('add-favorite-btn')) {
        const idSelectedImage = e.target.dataset.idimage;
        saveFavoriteImage(idSelectedImage);
    }

    if (e.target.classList.contains('remove-favorite-btn')) {
        const idSelectedImage = e.target.dataset.idimage;
        deleteFavoriteImage(idSelectedImage);
    }

    if (e.target.classList.contains('card__img')) {
        const urlSelectedImage = e.target.currentSrc;
        openModal(urlSelectedImage);
    }
});
/* Listening for the enter key to be pressed and then it calls the loadGroupRandomImages() function. */
document.getElementById('inputQuantity').addEventListener('keypress', e => {
    if (e.keyCode == 13) {
        e.preventDefault();
        loadGroupRandomImages();
    }
});


/* Listening for a change event on the input with the id 'imageFile', and when the event is triggered,
it calls the function previewImage. */
const imageFile = document.getElementById('imageFile');
imageFile.addEventListener("change", previewImage);

loadFavoritesImages();

/**
 * When the user clicks on an image, the modal will open and the image will be displayed in the modal.
 * @param urlSelectedImage - The URL of the image that was clicked on.
 */
const openModal = (urlSelectedImage) => {
    document.getElementById('modalImage').src = urlSelectedImage;
    document.querySelector(".modal-container").style.transform = 'translateY(100%)';
}

/* The above code is adding an event listener to the modalCloseBtn element. When the modalCloseBtn
element is clicked, the closeModal function is called. The closeModal function sets the display
property of the modal-container element to none. */
document.querySelector(".modal-container").addEventListener("click", (e) => closeModal(e));
const modalCloseBtn = document.getElementById('modalCloseBtn');
modalCloseBtn.addEventListener('click', (e) => closeModal(e));

const closeModal = (e) => {
    if (
        e.target.className.includes("modal__image") ||
        e.target.className === "modal"
    ) {
        return;
    } else {
        document.querySelector(".modal-container").style.transform = 'translateY(-100%)';
    }
};
