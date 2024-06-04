import { storedData } from './script.js';
import { fetchData } from './script.js';

export { createModal, setupContentGalleryModal };

// Crée une fenêtre modale
function createModal(message) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  const closeBtn = createCloseButton();
  modalContent.appendChild(closeBtn);

  if (!message) {
    modal.id = 'modalId';

    closeBtn.addEventListener('click', () => {
      deleteModal('modalId');
    });
  } else {
    modal.id = 'modalPopUp';
    const msg = document.createElement('h2');
    msg.textContent = message;
    modalContent.appendChild(msg);

    closeBtn.addEventListener('click', () => {
      deleteModal('modalPopUp');
    });
  }

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  return modal;
}

// Crée un bouton "fermer"
function createCloseButton() {
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close';
  closeBtn.textContent = '×';

  return closeBtn;
}

//Permet de supprimer un élément html
function deleteModal(modalId) {
  const modalToRemove = document.getElementById(modalId);
  modalToRemove.remove();
}

//Met en place la gallerie au sein de la modale
function setupContentGalleryModal(data) {
  const modal = document.getElementById('modalId');
  const modalContent = modal.querySelector('.modal-content');

  const galleryContainer = document.createElement('div');
  galleryContainer.className = 'gallery-container';
  modalContent.appendChild(galleryContainer);

  const title = document.createElement('h2');
  title.textContent = 'Galerie Photo';
  galleryContainer.appendChild(title);

  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  displayImagesInModal(data, imageContainer);
  galleryContainer.appendChild(imageContainer);

  const addButton = document.createElement('button');
  addButton.textContent = 'Ajouter une photo';
  addButton.className = 'btn btn-primary';
  addButton.id = 'addPhotoButton';

  addButton.addEventListener('click', () => {
    modalContent.removeChild(galleryContainer);
    displayFormInModal();
  });
  galleryContainer.appendChild(addButton);
}

// Récupère les items pour les afficher dans la gallerie
function displayImagesInModal(data, container) {
  data.forEach((item) => {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'img-wrapper';
    imgWrapper.setAttribute('data-id', item.id);

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;
    img.className = 'gallery-img';

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa-solid fa-trash-can delete-icon';
    deleteIcon.onclick = () => deleteProject(item.id);

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(deleteIcon);
    container.appendChild(imgWrapper);
  });
}

// Permet de supprimer un projet de la galerie
async function deleteProject(id) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  };
  try {
    const result = await fetchData('works/' + id, 'DELETE', headers);
    console.log('Project deleted successfully:', result);
  } catch (error) {
    console.error('Error deleting project:', error);
  }
}

// Variable déclarée en globale afin de récupérer plus tard l'Url d'un projet uploadé
let uploadedImgUrl = null;

// Change le contenu de la modale pour afficher le formulaire d'ajout de projet
function displayFormInModal() {
  const modal = document.getElementById('modalId');
  const modalContent = modal.querySelector('.modal-content');

  const mainContainer = document.createElement('div');
  mainContainer.className = 'main-container';
  modalContent.appendChild(mainContainer);

  const returnBtn = document.createElement('span');
  returnBtn.className = 'return-btn fa-solid fa-arrow-left';
  mainContainer.appendChild(returnBtn);
  returnBtn.addEventListener('click', () => {
    modalContent.removeChild(mainContainer);
    setupContentGalleryModal(storedData);
  });

  const title = document.createElement('h2');
  title.textContent = 'Ajout Photo';
  mainContainer.appendChild(title);

  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  mainContainer.appendChild(formContainer);

  const form = document.createElement('form');
  form.id = 'addPhotoForm';
  form.action = '#';
  form.method = 'post';
  formContainer.appendChild(form);

  // Input photo
  const uploadContainer = document.createElement('div');
  uploadContainer.className = 'upload-container';
  const icon = document.createElement('i');
  icon.className = 'upload-icon fa-regular fa-image';

  const inputFile = document.createElement('input');
  inputFile.type = 'file';
  inputFile.id = 'inputFile';
  inputFile.accept = 'image/png, image/jpeg';
  const uploadLabel = document.createElement('label');
  uploadLabel.htmlFor = 'inputFile';
  uploadLabel.id = 'uploadBtn';

  const labelContent = document.createElement('span');
  labelContent.textContent = '+ Ajouter photo';
  labelContent.className = 'btn';
  uploadLabel.appendChild(labelContent);

  const uploadText = document.createElement('span');
  uploadText.textContent = 'jpg, png : 4mo max';
  uploadText.className = 'upload-text';

  uploadContainer.appendChild(icon);
  uploadContainer.appendChild(uploadLabel);
  uploadContainer.appendChild(inputFile);
  uploadContainer.appendChild(uploadText);
  form.appendChild(uploadContainer);

  // Input titre
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Titre';
  titleLabel.id = 'titleLabel';
  titleLabel.htmlFor = 'photoTitle';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'photoTitle';
  titleInput.name = 'photoTitle';
  form.appendChild(titleLabel);
  form.appendChild(titleInput);

  // Input Catégorie
  const categoryLabel = document.createElement('label');
  categoryLabel.textContent = 'Catégorie';
  categoryLabel.id = 'categoryLabel';
  categoryLabel.htmlFor = 'photoCategory';

  const categorySelect = document.createElement('select');
  categorySelect.id = 'photoCategory';
  categorySelect.name = 'photoCategory';

  const categories = ['Objets', 'Appartements', 'Hôtels & Restaurants'];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  form.appendChild(categoryLabel);
  form.appendChild(categorySelect);

  // Bouton Valider
  const submitDiv = document.createElement('div');
  submitDiv.className = 'submit-div';
  form.appendChild(submitDiv);

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.id = 'btnValider';
  submitButton.value = 'Valider';
  submitButton.className = 'btn btn-valider';
  submitDiv.appendChild(submitButton);

  replaceIconByUpload('inputFile');
  submitForm(form);
}

// Remplacer l'icone générique d'image par la photo Uploadée
function replaceIconByUpload(input) {
  document.getElementById(input).addEventListener('change', function (event) {
    event.preventDefault;
    const file = event.target.files[0];
    if (!file) return;
    const maxSize = 4 * 1048576;

    if (file.size > maxSize) {
      createModal('Le fichier doit faire 4 Mo ou moins.');
      return;
    }

    uploadedImgUrl = URL.createObjectURL(file);
    const uploadedImg = document.createElement('img');
    uploadedImg.src = uploadedImgUrl;
    uploadedImg.className = 'uploaded-img';

    const container = document.querySelector('.upload-container');
    const icon = document.querySelector('.fa-image');
    container.replaceChild(uploadedImg, icon);

    uploadedImg.onload = () => {
      URL.revokeObjectURL(uploadedImgUrl);
    };
  });
}

// Ajouter le projet au moment du clic
function submitForm(form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    addNewProject();
  });
}

// Transformer la catégorie selectionnée en categoryId
function getCategoryId(categoryName) {
  const categoryMap = {
    Objets: 1,
    Appartements: 2,
    'Hôtels & Restaurants': 3,
  };

  return categoryMap[categoryName] || null;
}

// Envoyer le résultat du formulaire au Backend
function addNewProject() {
  const inputFile = document.getElementById('inputFile').files[0];
  const titre = document.getElementById('photoTitle').value;
  const categoryName = document.getElementById('photoCategory').value;

  if (!inputFile) {
    console.error('Fichier non sélectionné');
    return;
  }

  if (!titre) {
    createModal('Veuillez entrer un titre.');
    return;
  }

  const categorySelect = getCategoryId(categoryName);
  if (!categorySelect) {
    console.error('Catégorie non valide');
    return;
  }

  console.log('Fichier sélectionné : ', inputFile.name);
  console.log('Titre : ', titre);
  console.log('Catégorie : ', categorySelect);

  const formData = new FormData();
  formData.append('image', inputFile);
  formData.append('title', titre);
  formData.append('category', categorySelect);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  };

  fetchData('works/ ', 'POST', headers, formData);
}
