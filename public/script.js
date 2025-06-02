const VALID_USER = "admin";
const VALID_PASS = "zaragoza2024";

const loginIcon = document.getElementById('loginIcon');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const newsCreator = document.getElementById('newsCreator');
const newsForm = document.getElementById('newsForm');
const newsCards = document.getElementById('newsCards');
const logoutBtn = document.getElementById('logoutBtn');

let isLoggedIn = false;

// Mostrar modal de login
loginIcon.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    loginMessage.textContent = '';
    loginForm.reset();
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Login
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (user === VALID_USER && pass === VALID_PASS) {
        loginMessage.style.color = "green";
        loginMessage.textContent = "¡Sesión iniciada!";
        setTimeout(() => {
            isLoggedIn = true;
            loginModal.style.display = 'none';
            newsCreator.style.display = "block";
            logoutBtn.style.display = "block";
            renderNews();
        }, 700);
    } else {
        loginMessage.style.color = "red";
        loginMessage.textContent = "Contraseña equivocada";
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    isLoggedIn = false;
    newsCreator.style.display = "none";
    logoutBtn.style.display = "none";
    renderNews();
});

// Guardar noticia
newsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('newsTitle').value;
    const subtitle = document.getElementById('newsSubtitle').value;
    const image = document.getElementById('newsImage').value;
    const text = document.getElementById('newsText').value;

    const news = { title, subtitle, image, text, date: new Date().toLocaleString() };
    saveNews(news);
    renderNews();
    newsForm.reset();
});

function saveNews(news) {
    let newsList = JSON.parse(localStorage.getItem('newsList')) || [];
    newsList.unshift(news);
    localStorage.setItem('newsList', JSON.stringify(newsList));
}

function renderNews() {
    let newsList = JSON.parse(localStorage.getItem('newsList')) || [];
    newsCards.innerHTML = '';
    newsList.forEach((news, idx) => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            ${news.image ? `<img src="${news.image}" alt="Imagen noticia">` : ''}
            <h3>${news.title}</h3>
            ${news.subtitle ? `<h4 style="color: #555; margin-top: -10px;">${news.subtitle}</h4>` : ''}
            <p>${news.text}</p>
            <small>${news.date}</small>
            ${isLoggedIn ? `<button class="close-btn" title="Eliminar noticia">&times;</button>` : ''}
        `;

        if (isLoggedIn) {
            const closeBtn = card.querySelector('.close-btn');
            closeBtn.addEventListener('click', function () {
                card.style.transition = 'transform 0.3s, opacity 0.3s';
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                setTimeout(() => {
                    removeNews(idx);
                }, 300);
            });
        }

        newsCards.appendChild(card);
    });
}

function removeNews(idx) {
    let newsList = JSON.parse(localStorage.getItem('newsList')) || [];
    newsList.splice(idx, 1);
    localStorage.setItem('newsList', JSON.stringify(newsList));
    renderNews();
}

// Cargar noticias al iniciar
document.addEventListener('DOMContentLoaded', renderNews);
// Función para cerrar cualquier noticia expandida
function closeExpanded() {
    const expandedCard = document.querySelector('.news-card.expanded');
    if (expandedCard) {
        expandedCard.classList.remove('expanded');
    }
}

// Modificar renderNews para agregar la funcionalidad
function renderNews() {
    let newsList = JSON.parse(localStorage.getItem('newsList')) || [];
    newsCards.innerHTML = '';
    newsList.forEach((news, idx) => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            ${news.image ? `<img src="${news.image}" alt="Imagen noticia">` : ''}
            <h3>${news.title}</h3>
            ${news.subtitle ? `<h4 style="color: #555; margin-top: -10px;">${news.subtitle}</h4>` : ''}
            <p class="news-text">${news.text}</p>
            <small>${news.date}</small>
            <button class="close-btn" title="Eliminar noticia">&times;</button>
            <button class="close-expanded-btn" style="display:none;">Cerrar noticia</button>
        `;

        // Botón eliminar noticia (solo visible si sesión iniciada)
        const closeBtn = card.querySelector('.close-btn');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            card.style.transition = 'transform 0.3s, opacity 0.3s';
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            setTimeout(() => {
                removeNews(idx);
            }, 300);
        });
        closeBtn.style.display = newsCreator.style.display === 'block' ? 'inline-block' : 'none';

        // Botón cerrar noticia expandida
        const closeExpandedBtn = card.querySelector('.close-expanded-btn');
        closeExpandedBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            card.classList.remove('expanded');
            closeExpandedBtn.style.display = 'none';
        });

        // Abrir noticia expandida al hacer clic en la card (excepto en botones)
        card.addEventListener('click', function() {
            // Cerrar otras noticias expandidas
            closeExpanded();
            card.classList.add('expanded');
            closeExpandedBtn.style.display = 'block';
        });

        newsCards.appendChild(card);
    });
}

// Cerrar noticia expandida al hacer clic fuera de cualquier noticia
window.addEventListener('click', function(e) {
    const expandedCard = document.querySelector('.news-card.expanded');
    if (expandedCard && !expandedCard.contains(e.target)) {
        expandedCard.classList.remove('expanded');
        const closeBtn = expandedCard.querySelector('.close-expanded-btn');
        if (closeBtn) closeBtn.style.display = 'none';
    }
});
