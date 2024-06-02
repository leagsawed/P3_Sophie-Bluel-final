const loginURL = 'http://localhost:5678/api/users/login';

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
      password: event.target.querySelector('[name=password').value,
    };
    const jsonLogin = JSON.stringify(login);

    fetch(loginURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonLogin,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur d'authentification");
        }
      })
      .then((data) => {
        // if (login.email == 'sophie.bluel@test.tld' && login.password == 'S0phie')
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          alert('Authentification Réussie!');
          window.location.href = './index.html';
        } else {
          alert('E-mail ou mot de passe incorrect.');
        }
      })
      .catch((error) => {
        console.error('Login Failed:', error);
        alert('E-mail ou mot de passe incorrect. Veuillez Réessayer.');
      });
  });
}

postLoginInfo();
