//Comportement de l'état "Logged in"
import { createModal, setupContentGalleryModal } from './modal.js';
import { storedData } from './script.js';

const token = localStorage.getItem('authToken');
if (token) {
  setUpLoggedInState();
}
// mise en place de  l'état logged in
function setUpLoggedInState() {
  const modifyButton = createModifyButton();
  wrapHeaderAndAddModifyButton(modifyButton);
  setupLogout();
}

//Création d'un div pour englober le header "Mes Projets et le bouton modifier"
function wrapHeaderAndAddModifyButton(modifyButton) {
  const header = document.querySelector('#portfolio > h2');
  const wrapper = document.createElement('div');
  wrapper.className = 'header-wrapper';
  header.parentNode.insertBefore(wrapper, header);
  wrapper.appendChild(header);
  wrapper.appendChild(modifyButton);
}

//fonction pour se déconnecter
function setupLogout() {
  const login = document.getElementById('login-button');
  login.innerHTML = 'logout';
  login.onclick = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/FrontEnd/index.html';
  };
}
//comportement du bouton modifier
function createModifyButton() {
  const button = createButtonwithIcon(
    'btn btn-modify',
    'fa-regular fa-pen-to-square',
    ' modifier'
  );

  button.addEventListener('click', function () {
    createModal();
    setupContentGalleryModal(storedData);
  });

  return button;
}
//Création du bouton modifier avec son icone
function createButtonwithIcon(btnClass, iconClass, textContent) {
  const button = document.createElement('button');
  button.className = btnClass;
  const icon = document.createElement('i');
  icon.className = iconClass;
  button.appendChild(icon);
  const text = document.createTextNode(textContent);
  button.appendChild(text);
  return button;
}
