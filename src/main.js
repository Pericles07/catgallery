import "../sass/styles.scss";
import { fetchCats } from './api.js';

// Selección de elementos
const gallery = document.getElementById('gallery-container');
const loading = document.getElementById('loading');
const btnMore = document.getElementById('load-more');
const btnFavs = document.getElementById('btn-favs');
const btnHome = document.getElementById('btn-home');

// Recuperamos favoritos de la memoria
let favorites = JSON.parse(localStorage.getItem('gatos_favs')) || [];


// Eventos 
gallery.addEventListener('click', (e) => {
  const btn = e.target.closest('.fav-btn');
  if (!btn) return;

  const card = btn.closest('.cat-card');
  const imgElement = card.querySelector('img');
  const catData = { id: btn.dataset.id, url: imgElement.src };

  const index = favorites.findIndex(fav => fav.id === catData.id);

  if (index === -1) {
    // Añadir
    favorites.push(catData);
    btn.innerHTML = '💖';
  } else {
    // Quitar
    favorites.splice(index, 1);
    btn.innerHTML = '❤️';
    
    // Si estamos en la sección de favoritos, borramos la tarjeta visualmente
    if (btnMore.classList.contains('hidden')) {
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 300);
    }
  }

  localStorage.setItem('gatos_favs', JSON.stringify(favorites));
});

// Botón de favoritos
btnFavs.addEventListener('click', () => {
  setActiveButton(btnFavs);
  gallery.innerHTML = ''; // Limpiamos la pantalla
  btnMore.classList.add('hidden'); // Ocultamos "Ver más"
  
  if (favorites.length === 0) {
    gallery.innerHTML = '<h2 class="empty-msg">Aún no tienes gatos favoritos </h2>';
  } else {
    renderCats(favorites);
  }
});

// Botón de inicio
btnHome.addEventListener('click',  async () => {
  setActiveButton(btnHome);
  gallery.innerHTML = ''; // Limpiamos favoritos
  handleLoadCats();       // Cargamos nuevos gatos
});

// Botón de ver más
btnMore.addEventListener('click', handleLoadCats);

// Arranque inicial
handleLoadCats();

// Función para cargar gatos de la API
async function handleLoadCats() {
  btnMore.classList.add('hidden');
  loading.classList.remove('hidden');

  const newCats = await fetchCats(8);

  loading.classList.add('hidden');

  if (newCats.length > 0) {
    renderCats(newCats);
    btnMore.classList.remove('hidden');
  }
}

// Función para pintar los gatos (sirve para aleatorios y para favoritos)
function renderCats(cats) {
  cats.forEach(cat => {
    const isFav = favorites.some(fav => fav.id === cat.id);
    
    const card = document.createElement('article');
    card.className = 'cat-card';
    card.innerHTML = `
      <img src="${cat.url}" alt="Michi">
      <button class="fav-btn" data-id="${cat.id}">
        ${isFav ? '💖' : '❤️'}
      </button>
    `;
    gallery.appendChild(card);
  });
}

// Función para marcar la sección donde nos encotramos(inicio o favoritos)
function setActiveButton(activeBtn) {
  btnHome.classList.remove('active');
  btnFavs.classList.remove('active');
  activeBtn.classList.add('active');
}