import { fetchData } from './script.js';

document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('login-button');
  if (window.location.pathname === '/FrontEnd/login.html') {
    loginButton.style.fontWeight = 'bold';
  }
});

function postLoginInfo() {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const login = {
      email: event.target.querySelector('[name=email]').value,
      password: event.target.querySelector('[name=password]').value,
    };
    const jsonLogin = JSON.stringify(login);

    fetchData('users/login/', 'POST', jsonLogin);
  });
}

postLoginInfo();
