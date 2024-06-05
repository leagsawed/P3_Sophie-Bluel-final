import { createModal } from './modal.js';

let storedData = null;

// fonction asynchronne générique de communication avec le Backend
export async function fetchData(endUrl, method1, headers1, body1) {
  let token = {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  };

  if (endUrl === 'users/login/') {
    headers1 = {
      'Content-Type': 'application/json',
    };
  } else if (
    (method1 == 'POST' || method1 == 'DELETE') &&
    localStorage.getItem('authToken') !== null
  ) {
    token = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    };
  }
  let url = 'http://localhost:5678/api/' + endUrl;
  const config = {
    method: method1,
    headers: headers1,
    body: method1 === 'POST' ? body1 : undefined,
  };

  // comportement de la fonction sur le reste du site
  try {
    const response = await fetch(url, config)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          if (endUrl === 'users/login/') {
            throw new Error("Erreur d'authentification");
          } else {
            const errorData = response.text();
            throw new Error(
              `HTTP error! status: ${response.status}, Message: ${errorData}`
            );
          }
        }
      })
      .then((data) => {
        // si (login.email == 'sophie.bluel@test.tld' && login.password == 'S0phie')
        if (endUrl === 'users/login/') {
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            createModal('Authentification Réussie!');
            setTimeout(() => {
              window.location.href = './index.html';
            }, 2000);
          } else {
            createModal('E-mail ou mot de passe incorrect.');
          }
        } else if (contentType && contentType.includes('application/json')) {
          const data = response.json();
          console.log('Success:', data);
          return data;
        } else {
          console.log('No JSON content, success:', response.statusText);
          return response.statusText;
        }
      })
      .catch((error) => {
        if (endUrl === 'users/login/') {
          console.error('Login Failed:', error);
          createModal('E-mail ou mot de passe incorrect. Veuillez Réessayer.');
        } else {
          console.error('Fetch error:', error);
          throw error;
        }
      });
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Fonction principale pour lancer l'application
async function main() {
  try {
    storedData = await fetchData('works/');
    if (storedData) {
      displayProjects(storedData);
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
  const displayedProjectIds = new Set();
  data.forEach((item) => {
    if (!displayedProjectIds.has(item.id)) {
      const project = makeProject(item);
      appendProjectToGallery(project);
      displayedProjectIds.add(item.id);
    }
  });
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
function appendProjectToGallery(figure) {
  const gallery = document.querySelector('.gallery');
  gallery.appendChild(figure);
}

// Configuration des boutons de filtre
function setupFilterButtons() {
  const portfolioSection = document.getElementById('portfolio');
  if (!portfolioSection) {
    console.error('The portfolio section is missing from the page.');
    return;
  }

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
  document.querySelectorAll('figure').forEach((figure) => figure.remove());
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
setupFilterButtons();
main();

export { storedData };
