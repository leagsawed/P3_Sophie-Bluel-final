import { createModal } from './modal.js';

let storedData = null;

export async function fetchData(endUrl, method1, body1) {
  const url = `http://localhost:5678/api/${endUrl}`;

  let headers = {};

  if (endUrl === 'users/login/') {
    headers['Content-Type'] = 'application/json';
  } else if (method1 === 'POST' || method1 === 'DELETE') {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  }

  const config = {
    method: method1,
    headers: headers,
    body: method1 === 'POST' ? body1 : undefined,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, Message: ${errorText}`
      );
    }

    let data = null;
    if (
      response.headers.get('Content-Type')?.includes('application/json') &&
      response.status !== 204
    ) {
      data = await response.json(); // Parse JSON seulement si c'est approprié
    }
    if (endUrl === 'users/login/') {
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
        createModal('Authentification Réussie!');
        setTimeout(() => {
          window.location.href = './index.html';
        }, 2000);
      } else {
        createModal('E-mail ou mot de passe incorrect.');
        throw new Error('E-mail ou mot de passe incorrect.');
      }
    }

    return data; // Toujours retourner data pour d'autres utilisations
  } catch (error) {
    console.error('Fetch error:', error);
    if (endUrl === 'users/login/') {
      createModal('Veuillez entrer un e-mail et un mot de passe valide.');
    }
    throw error; // Relancer l'erreur pour la gestion d'erreur plus haut dans la chaîne d'appel
  }
}

// Fonction principale pour lancer l'application
async function main() {
  try {
    storedData = await fetchData('works/');
    if (storedData) {
      displayProjects(storedData);
      console.log(storedData);
    }
  } catch (error) {
    console.error('Échec du chargement des projets :', error);
    createModal(
      'Échec du chargement des projets. Veuillez réessayer plus tard.'
    );
  }
}

// Affichage des projets dans la galerie
function displayProjects(data) {
  const gallery = document.querySelector('.gallery');
  if (data && data.length > 0) {
    const displayedProjectIds = new Set();
    data.forEach((item) => {
      if (!displayedProjectIds.has(item.id)) {
        const project = makeProject(item);
        // appendProjectToGallery(project);
        gallery.appendChild(project);
        displayedProjectIds.add(item.id);
      }
    });
  }
}

// Création d'un élément de projet pour l'affichage
function makeProject(item) {
  const { categoryId, title, imageUrl } = item;
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  const figCaption = document.createElement('figcaption');

  img.src = imageUrl;
  img.alt = title;
  figCaption.textContent = title;
  figure.className = categoryId;
  figure.append(img, figCaption);

  return figure;
}

// Ajout du projet à la galerie
// function appendProjectToGallery(figure) {
//   const gallery = document.querySelector('.gallery');
//   gallery.appendChild(figure);
// }

// Configuration des boutons de filtre
function setupFilterButtons() {
  const portfolioSection = document.getElementById('portfolio');

  const gallery = portfolioSection.querySelector('.gallery');
  const filterMenu = document.createElement('div');
  filterMenu.className = 'filter-menu';
  portfolioSection.insertBefore(filterMenu, gallery);

  const filterButtons = setButtonParams();
  filterButtons.forEach((itemButton) => {
    const button = createButton(itemButton.id, itemButton.text);
    button.addEventListener('click', () =>
      handleButtonClick(button, itemButton)
    );
    filterMenu.appendChild(button);
  });
}

// Création d'un bouton
function createButton(id, text) {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.className = 'btn btn-select';
  return button;
}

// Définition des paramètres des boutons
function setButtonParams() {
  return [
    { id: 'Tous', text: 'Tous', categoryId: null },
    { id: 'Objets', text: 'Objets', categoryId: 1 },
    { id: 'Appartements', text: 'Appartements', categoryId: 2 },
    { id: 'Hotels', text: 'Hotels & Restaurants', categoryId: 3 },
  ];
}

// Gestion du clic sur les boutons
function handleButtonClick(button, itemButton) {
  resetButtonStyle();
  button.classList.add('active-button');
  clearGallery();
  const filteredData = itemButton.categoryId
    ? filterData(storedData, itemButton.categoryId)
    : storedData;
  displayProjects(filteredData);
}

// Réinitialisation du style des boutons
function resetButtonStyle() {
  document.querySelectorAll('.btn-select').forEach((button) => {
    button.className = 'btn btn-select';
  });
}

// Nettoyage de la galerie
function clearGallery() {
  const portfolio = document.getElementById('portfolio');
  portfolio.querySelectorAll('figure').forEach((figure) => figure.remove());
}

// Filtrage des données selon la catégorie
function filterData(data, categoryId) {
  return categoryId === null
    ? data
    : data.filter((item) => item.categoryId === categoryId);
}

//Rediriger vers la section Login
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', function () {
  window.location.href = './login.html';
});

document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('login-button');
  if (window.location.pathname === '/FrontEnd/login.html') {
    loginButton.style.fontWeight = 'bold';
  }
});

// Initialisation de l'application
function init() {
  const portfolio = document.getElementById('portfolio');
  if (portfolio) {
    setupFilterButtons();
    main();
  }
}

document.addEventListener('DOMContentLoaded', init);

export { storedData, clearGallery, displayProjects };
