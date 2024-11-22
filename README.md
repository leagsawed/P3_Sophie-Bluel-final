# Sophie Bluel - Portfolio d'Architecte d'intérieur

## Description

Ce projet est un portfolio professionnel pour Sophie Bluel, architecte d'intérieur. Il présente ses projets et permet une gestion dynamique du contenu via une interface d'administration.

## Fonctionnalités

- 🖼️ Galerie de projets filtrable par catégorie
- 🔐 Interface d'administration sécurisée
- ✨ Gestion dynamique des projets (ajout, suppression)
- 📱 Design responsive
- 🎨 Interface utilisateur moderne avec modal

## Technologies Utilisées

- HTML5
- CSS3
- JavaScript (Vanilla)
- API RESTful

## Structure du Projet

sophie-bluel/
├── assets/
│   ├── icons/
│   ├── images/
│   └── style.css
├── scripts/
│   ├── login.js
│   ├── loggedIn.js
│   ├── modal.js
│   └── script.js
├── index.html
└── login.html

## Installation

1. Clonez le repository
git clone [url-du-repo]

2. Lancez le serveur backend (nécessite Node.js)
cd backend
npm install
npm start

3. Ouvrez `index.html` dans votre navigateur

## API Endpoints

- `GET /api/works` : Récupère tous les projets
- `POST /api/works` : Ajoute un nouveau projet
- `DELETE /api/works/:id` : Supprime un projet
- `POST /api/users/login` : Authentification

## Connexion Admin

Email: sophie.bluel@test.tld
Password: S0phie 

## Fonctionnalités Principales

### Galerie de Projets
La galerie affiche dynamiquement les projets avec filtrage par catégorie. Les projets sont chargés depuis l'API et peuvent être modifiés par l'administrateur.

### Système d'Authentification
Un système de connexion sécurisé permet à l'administrateur d'accéder à l'interface de gestion des projets.

### Gestion des Modales
Les modales permettent d'ajouter ou de supprimer des projets de manière intuitive avec une validation visuelle des actions.

## Performance et Accessibilité

- Images optimisées
- Contraste vérifié pour l'accessibilité
- Navigation au clavier supportée
- Balises ARIA appropriées

## Déploiement

Le site est optimisé pour un déploiement sur n'importe quel serveur web statique.

## Auteur

Sophie Bluel - Architecte d'intérieur

## Licence

Ce projet est sous licence privée. Tous droits réservés.
