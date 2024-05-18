document.querySelector(".menu-btn").addEventListener("click", () => {
    document.querySelector(".nav-menu").classList.toggle("show");
});

ScrollReveal().reveal('.showcase');
ScrollReveal().reveal('.news-cards', { delay: 500 });
ScrollReveal().reveal('.cards-banner-one', { delay: 500 });
ScrollReveal().reveal('.cards-banner-two', { delay: 500 });


// FUNCION PARA MOSTRAR Y OCULTAR NAVBAR
document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.nav-menu-right a .search-icon');
    const closeIcon = document.querySelector('.nav-menu-right a .close-icon');
    const searchInput = document.querySelector('.searchInput');
    const navMenu = document.querySelector('.nav-menu');
    const searchContainer = document.querySelector('.nav-menu-right a');

    searchContainer.addEventListener('click', function(event) {
        event.preventDefault();

        // Comprobar el tamaño de la ventana para decidir sobre la visibilidad del nav-menu
        const isMobile = window.innerWidth <= 700;

        // Toggle the visibility of the search input and handle nav-menu for non-mobile devices
        if (searchInput.style.display === 'none' || searchInput.style.display === '') {
            searchInput.style.display = 'block';
            searchInput.focus();
            searchIcon.style.display = 'none';
            closeIcon.style.display = 'block';

            // Only hide nav-menu on non-mobile devices when search is active
            if (!isMobile) {
                navMenu.style.display = 'none';
            }
        } else {
            searchInput.style.display = 'none';
            searchIcon.style.display = 'block';
            closeIcon.style.display = 'none';

                // Only show nav-menu on non-mobile devices when search is not active
                if (!isMobile) {
                navMenu.style.display = 'flex';
                }
        }
    });
});

const apiKey = '8fc6900bb6bd4b6197f389a0e186b130'; // 
const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
const pageSize = 5; // Número de noticias por página
let currentPage = 1;
let totalResults = 0;
const country = 'us';
let currentCategory = ''; // Variable para almacenar la categoría actual

// FUNCION PARA OBTENER NOTICIAS DE LAS DIFERENTES CATEGORIAS
async function fetchNews(page, category = '') {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&page=${page}&category=${category}&apiKey=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        totalResults = data.totalResults;
        displayShowcaseNews(data.articles[0]); // Mostrar la primera noticia en la sección showcase
        displayNewsCards(data.articles.slice(1)); // Mostrar las siguientes noticias en news-cards
        displayPagination(category);
    } catch (error) {
        console.error('Error al obtener noticias:', error);
    }
}

function displayShowcaseNews(article) {
    const showcase = document.querySelector('.showcase');
    showcase.style.backgroundImage = `url('${article.urlToImage || '/images/not-available.png'}')`; // Usar imagen de la noticia o una imagen por defecto
    showcase.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description || 'Descripción no disponible'}</p>
        <a href="${article.url}" class="btn" target="_blank">Leer más <i class="fas         fa-chevron-right"></i></a>
    `;
}

function displayNewsCards(articles) {
    const newsCards = document.querySelector('.news-cards');
    newsCards.classList.remove('visible'); // Ocultar inicialmente

    setTimeout(() => {
      newsCards.innerHTML = ''; // Limpiar el contenido existente
      articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        const img = document.createElement('img');
        img.src = article.urlToImage || '/images/not-available.png'; // Imagen por defecto si no hay imagen
        img.alt = article.title;

        const title = document.createElement('h3');
        title.classList.add('news-title');
        title.textContent = article.title;

        const description = document.createElement('p');
        description.classList.add('news-description');
        description.textContent = article.description || 'Descripción no disponible';

        const link = document.createElement('a');
        link.href = article.url;
        link.textContent = 'Leer más';
        link.target = '_blank';

        newsItem.appendChild(img);
        newsItem.appendChild(title);
        newsItem.appendChild(description);
        newsItem.appendChild(link);
        newsCards.appendChild(newsItem);
      });

      newsCards.classList.add('visible'); // Mostrar con retraso
    }, 500); // Retraso de 500 ms (ajusta según tus necesidades)
}

function displayPagination(category = '') {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalResults / pageSize);

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.classList.toggle('disabled', currentPage === 1);
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchNews(currentPage, category);
      }
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.classList.toggle('disabled', currentPage === totalPages);
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchNews(currentPage, category);
      }
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
}

document.getElementById('general').addEventListener('click', (e) => {
    e.preventDefault();
    currentCategory = ''; // Establecer categoría a general
    currentPage = 1;
    fetchNews(currentPage, currentCategory);
    document.getElementById('news-cards').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('negocios').addEventListener('click', (e) => {
    e.preventDefault();
    currentCategory = 'business'; // Establecer categoría a negocios
    currentPage = 1;
    fetchNews(currentPage, currentCategory);
    document.getElementById('news-cards').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('deportes').addEventListener('click', (e) => {
    e.preventDefault();
    currentCategory = 'sports'; // Establecer categoría a deportes
    currentPage = 1;
    fetchNews(currentPage, currentCategory);
    document.getElementById('news-cards').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('tecnologia').addEventListener('click', (e) => {
    e.preventDefault();
    currentCategory = 'technology'; // Establecer categoría a tecnología
    currentPage = 1;
    fetchNews(currentPage, currentCategory);
    document.getElementById('news-cards').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('entretenimiento').addEventListener('click', (e) => {
    e.preventDefault();
    currentCategory = 'entertainment'; // Establecer categoría a entretenimiento
    currentPage = 1;
    fetchNews(currentPage, currentCategory);
    document.getElementById('news-cards').scrollIntoView({ behavior: 'smooth' });
});

fetchNews(currentPage, currentCategory);














