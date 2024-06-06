import { fetchData } from './script.js';

document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('login-button');
  if (window.location.pathname === '/FrontEnd/login.html') {
    loginButton.style.fontWeight = 'bold';
  }
});

// Envoyer les données de connexion fournies par l'utilisateur via un fetch POST

function postLoginInfo() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const login = {
      email: event.target.querySelector('[name=email]').value,
      password: event.target.querySelector('[name=password]').value,
    };
    const jsonLogin = JSON.stringify(login);

    fetchData('users/login/', 'POST', jsonLogin)
      .then((data) => {
        if (data && data.token) {
          // Gestion de la réussite de la connexion
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        createModal('Erreur de connexion');
      });
  });
}

postLoginInfo();
