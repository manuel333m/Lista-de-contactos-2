import * as ContactsModule from "./contacts.js";

// Selectores
const inputName = document.querySelector('#name-input');
const inputPhone = document.querySelector('#phone-input');
const form = document.querySelector('#main-form');
const formBtn = document.querySelector('#main-form-btn');
const contactsList = document.querySelector('#contacts-list');

// Regex
const NAME_REGEX = /^[A-Z\u00d1][a-z\u00f1]*[ ][A-Z\u00d1][a-z\u00f1]{3,}[ ]{0,1}$/;
const PHONE_REGEX = /^[0](412|424|414|416|426|212)[0-9]{7}$/;

// Validaciones
let isInputNameValid = false;
let isInputPhoneValid = false;

// Funciones
const renderInputValidationStatus = (input, isInputValid) => {
  const helperText = input.nextElementSibling;
  if (input.value === '') {
    // Quitar los colores y no mostrar el texto de ayuda.
    input.classList.remove('input-invalid');
    input.classList.remove('input-valid');
    helperText?.classList.remove('show-helper-text');
  } else if (isInputValid) {
    // Ponerse verde y ocultar el texto de ayuda.
    input.classList.add('input-valid');
    input.classList.remove('input-invalid');
    helperText?.classList.remove('show-helper-text');
  } else {
    // Ponerse rojo y mostrar el texto de ayuda.
    input.classList.add('input-invalid');
    input.classList.remove('input-valid');
    helperText?.classList.add('show-helper-text');
  }
}

const renderFormBtnValidationStatus = () => {
  if (isInputNameValid && isInputPhoneValid) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
}

// Eventos
inputName.addEventListener('input', e => {
  isInputNameValid = NAME_REGEX.test(inputName.value);
  renderInputValidationStatus(inputName, isInputNameValid);
  renderFormBtnValidationStatus();
});

inputPhone.addEventListener('input', e => {
  isInputPhoneValid = PHONE_REGEX.test(inputPhone.value);
  renderInputValidationStatus(inputPhone, isInputPhoneValid);
  renderFormBtnValidationStatus();
});

form.addEventListener('submit', e => {
  //1. Prevenir el evento predefinido
  e.preventDefault();
  // 2. Crear la estructura del contacto
  const newContact = {
    id: crypto.randomUUID(),
    name: inputName.value,
    phone: inputPhone.value,
  }
  // 3. Guardar el contacto en el array
  ContactsModule.addContact(newContact);
  // 4. Guardar el contacto en el navegador
  ContactsModule.saveContactsInBrowser();
  // 5. Mostrar contactos en el html
  ContactsModule.renderContacts(contactsList);
});

contactsList.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');

  if (deleteBtn) {
    // 1. Obtener el id
    const li = deleteBtn.parentElement.parentElement;
    // 2. Eliminar el contacto del array
    ContactsModule.removeContact(li.id);
    // 3. Guardar los contactos en el navegador
    ContactsModule.saveContactsInBrowser();
    // 4. Renderizar los contactos
    ContactsModule.renderContacts(contactsList);
  }

  if (editBtn) {
    // 1. Obtener el id
    const li = editBtn.parentElement.parentElement;
    // 2. Obtener ambos inputs
    const contactInputName = li.children[0].children[0];
    const contactInputPhone = li.children[0].children[1];
    const status = li.getAttribute('status');
    
    if (status === 'disabled-inputs') {
      // 1. Cambiar el status a enabled-inputs
      li.setAttribute('status', 'enabled-inputs');
      // 2. Cambiar el icono del btn
      editBtn.innerHTML = ContactsModule.editingIcon;
      // 3. Habilitar los inputs
      contactInputName.removeAttribute('readonly');
      contactInputPhone.removeAttribute('readonly');
    }

    if (status === 'enabled-inputs') {
      // 1. Cambiar el status a disabled-inputs
      li.setAttribute('status', 'disabled-inputs');
      // 2. Cambiar el icono del btn
      editBtn.innerHTML = ContactsModule.editIcon;
      // 3. Deshabilitar los inputs
      contactInputName.setAttribute('readonly', true);
      contactInputPhone.setAttribute('readonly', true);
      // 4. Actualizar el contacto
      const updatedContact = {
        id: li.id,
        name: contactInputName.value,
        phone: contactInputPhone.value
      }
      ContactsModule.updateContact(updatedContact);
      // 5. Guardar en el navegador
      ContactsModule.saveContactsInBrowser();
      // 6. Mostrar en el html
      ContactsModule.renderContacts(contactsList);
    }
  }
});

window.onload = () => {
  // 1. Obtener la lista de localStorage
  ContactsModule.getContactsFromBrowser();
  // 2. Renderizar los contactos
  ContactsModule.renderContacts(contactsList);
}