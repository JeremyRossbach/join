/* let currentContact;

async function init() {
    // Loads data from "/contacts".
    // Lädt Daten von "/contacts".
    await loadData("/contacts");
    // Generates the contact list.
    // Erzeugt die Kontaktliste.
    generateContactList();
}

function createContact() {
    // Retrieves input fields for name, email, and phone.
    // Holt die Eingabefelder für Name, E-Mail und Telefon.
    let inputname = document.getElementById(`create_name`);
    let inputmail = document.getElementById(`create_mail`);
    let inputphone = document.getElementById(`create_phone`);
    let contactReady = document.getElementById(`new_contact_ready`);
    // Checks if a contact's email already exists.
    // Überprüft, ob die E-Mail eines Kontakts bereits existiert.
    let index = contactData.findIndex(contact => contact.email == inputmail.value);

    if (index != -1) {
        // Displays a message if the email already exists.
        // Zeigt eine Nachricht an, wenn die E-Mail bereits existiert.
        contactReady.style.display = "flex";

        return;
    }

    let contact = {
        name: inputname.value,
        email: inputmail.value,
        phoneNumber: inputphone.value,
    };
    
    contactData.push(contact);

    // Hides a success message after adding a new contact.
    // Blendet eine Erfolgsmeldung aus, nachdem ein neuer Kontakt hinzugefügt wurde.
    hideCreateContactMessage("new_contact_successfully_div");
    // Updates the contact list.
    // Aktualisiert die Kontaktliste.
    generateContactList();
    // Saves the contact data.
    // Speichert die Kontaktinformationen.
    putData("contacts", contactData)
        .then(response => console.log(response))
        .catch(error => console.error(error));

    // Closes the window for adding a new contact.
    // Schließt das Fenster zum Hinzufügen eines neuen Kontakts.
    closeAddNewContactWindow();
}

function generateContactList() {
    let contactContainer = document.getElementById(`first_contact_under_container`);
    let lastChar = "";

    // Clears the existing contact list.
    // Löscht die vorhandene Kontaktliste.
    contactContainer.innerHTML = "";

    // Sorts the contact list alphabetically by name.
    // Sortiert die Kontaktliste alphabetisch nach Namen.
    contactData.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1);

    for (let i = 0; i < contactData.length; i++) {
        const contact = contactData[i];
        let select = "";

        if (currentContact) {
            // Marks the selected contact visually.
            // Markiert den ausgewählten Kontakt visuell.
            select = contact.name == currentContact.name ? "selected" : "";
        }

        let backgroundColor = colorPool[i % colorPool.length];

        if (lastChar !== contact.name.charAt(0).toUpperCase()) {
            // Groups contacts by the first letter of their name.
            // Gruppiert Kontakte nach dem ersten Buchstaben ihres Namens.
            contactContainer.innerHTML += `<div class="alphabet_div">${contact.name.charAt(0).toUpperCase()}</div><hr>`;
            lastChar = contact.name.charAt(0).toUpperCase();
        }

        contactContainer.innerHTML += `
        <div class="div_contact ${select}" id="div_contact_${i}" onclick="selectContact(${i})">
            <div class="contact_initials" style="background-color: ${backgroundColor};">${getInitials(contact.name)}</div>
            <div class="name_email_div">    
                <div class="contact_name">${contact.name}</div>
                <div class="contact_email">${contact.email}</div>
            </div>
        </div>            
        `;
    }
}

function selectContact(i) {
    // Selects a contact to display and edit.
    // Wählt einen Kontakt aus, um ihn anzuzeigen und zu bearbeiten.
    currentContact = contactData[i];
    let selectContact = document.getElementById(`div_contact_${i}`);
    let contactInfo = document.getElementById(`second_contact_container`);
    let contactList = document.getElementById(`first_contact_container`);
    let second_contact_infos = document.getElementById(`second_contact_infos`);
    // Clears the existing selection.
    // Löscht die vorhandene Auswahl.
    clearSelect();

    selectContact.classList.add(`selected`);
    contactInfo.classList.add(`selected`);
    contactList.classList.add(`selected`);
    second_contact_infos.style.display = "flex";

    // Displays the contact information.
    // Zeigt die Kontaktinformationen an.
    setContactInfo(currentContact);
}

// Removes visual marking from all contacts.
// Entfernt die visuelle Markierung von allen Kontakten.
function clearSelect() {
    let list = document.getElementsByClassName(`div_contact`);

    for (let i = 0; i < list.length; i++) {
        const element = list[i];

        element.classList.remove(`selected`);
    }
}

// Displays the details of the selected contact.
// Zeigt die Details des ausgewählten Kontakts an.
function setContactInfo(contact) {
    let nameDiv = document.getElementById(`name_div_big`);
    let emailDiv = document.getElementById(`email_optionen`);
    let phoneDiv = document.getElementById(`phone_optionen`);
    let initialDiv = document.getElementById(`name_div_small`);

    nameDiv.innerHTML = contact.name;

    let emailLink = document.createElement('a');

    emailLink.href = `mailto:${contact.email}`;
    emailLink.textContent = contact.email;
    emailDiv.innerHTML = '';
    emailDiv.appendChild(emailLink);

    let phoneLink = document.createElement('a');

    phoneLink.href = `tel:${contact.phoneNumber}`;
    phoneLink.textContent = contact.phoneNumber; 
    phoneDiv.innerHTML = '';
    phoneDiv.appendChild(phoneLink);

    initialDiv.innerHTML = getInitials(contact.name);
}

// Opens the window for adding a new contact.
// Öffnet das Fenster zum Hinzufügen eines neuen Kontakts.
function openAddNewContactWindow() {
    document.getElementById(`new_contact_container`).style.display = "flex";
    // Clears the input fields.
    // Löscht die Eingabefelder.
    clearInputs();
    document.body.style.overflow = "hidden";
    let contactReady = document.getElementById(`new_contact_ready`);
    contactReady.style.display = "none";
}

// Opens the window for editing a contact.
// Öffnet das Fenster zum Bearbeiten eines Kontakts.
function openEditContactWindow() {
    document.getElementById(`edit_contact_container`).style.display = "flex";
    document.body.style.overflow = "hidden";

}

// Closes the window for adding a new contact.
// Schließt das Fenster zum Hinzufügen eines neuen Kontakts.
function closeAddNewContactWindow() {
    document.getElementById(`new_contact_container`).style.display = "none";
    document.body.style.overflow = "auto";
}

// Displays a temporary message and then hides it after a certain duration.
// Zeigt eine temporäre Nachricht an und blendet sie nach einer bestimmten Zeit aus.
function hideCreateContactMessage(messageID) {
    var messageDiv = document.getElementById(messageID);
    messageDiv.style.display = "flex";
    messageDiv.classList.add("animate");

    setTimeout(function () {
        removeClassAnimate(messageDiv);
    }, 5000);
}

// Closes the window for editing a contact.
// Schließt das Fenster zum Bearbeiten eines Kontakts.
function closeEditContactWindow() {
    document.getElementById(`edit_contact_container`).style.display = "none";
    document.body.style.overflow = "auto";
}

// Clears the input fields for adding a new contact.
// Löscht die Eingabefelder zum Hinzufügen eines neuen Kontakts.
function clearInputs() {
    let inputname = document.getElementById(`create_name`);
    let inputmail = document.getElementById(`create_mail`);
    let inputphone = document.getElementById(`create_phone`);

    inputname.value = "";
    inputmail.value = "";
    inputphone.value = "";
}

// Deletes the currently selected contact and updates the contact list.
// Löscht den ausgewählten Kontakt und aktualisiert die Kontaktliste.
function deleteContact() {
    // Finds the index of the contact to delete.
    // Ermittelt den Index des zu löschenden Kontakts.
    let index = contactData.findIndex(contact => contact.email == currentContact.email);
    let second_contact_infos = document.getElementById(`second_contact_infos`);
    // Removes the contact from the data array.
    // Entfernt den Kontakt aus dem Datensatz.
    contactData.splice(index, 1);

    // Hides the contact details.
    // Blendet die Kontaktdetails aus.
    second_contact_infos.style.display = "none";
    // Closes the edit contact window.
    // Schließt das Fenster zum Bearbeiten eines Kontakts.
    closeEditContactWindow();

    // Displays a message indicating successful deletion of the contact.
    // Zeigt eine Nachricht an, die das erfolgreiche Löschen des Kontakts angibt.
    hideCreateContactMessage("delete_contact_successfully_div");
    // Hides the edit/delete menu container.
    // Blendet den Container für das Bearbeiten/Löschen-Menü aus.
    hideMenuEditDeleteContainer();
    // Closes the contact details.
    // Schließt die Kontaktdetails.
    closeContactInfo();
    // Saves the updated contact data.
    // Speichert die aktualisierten Kontaktdaten.
    putData("contacts", contactData)
        .then(response => console.log(response))
        .catch(error => console.error(error));
    // Regenerates the contact list.
    // Generiert die Kontaktliste neu.
    generateContactList();
}

// Hides the menu for editing and deleting contacts.
// Blendet das Menü zum Bearbeiten und Löschen von Kontakten aus.
function hideMenuEditDeleteContainer() {
    let menu_edit_delete_container = document.getElementById(`menu_edit_delete_container`);
    menu_edit_delete_container.style.display = "none";
}

// Populates the edit contact form with the details of the currently selected contact.
// Füllt das Formular zum Bearbeiten eines Kontakts mit den Details des ausgewählten Kontakts aus.
function editContact() {
    let nameDiv = document.getElementById(`edit_name`);
    let emailDiv = document.getElementById(`edit_mail`);
    let phoneDiv = document.getElementById(`edit_phone`);
    let initialDiv = document.getElementById(`profil_name_initialen`);
    let contactReady = document.getElementById(`edit_contact_ready`);

    // Hides the "contact ready" message.
    // Blendet die "Kontakt bereit" -Nachricht aus.
    contactReady.style.display = "none";
    // Populates input fields with contact details.
    // Füllt die Eingabefelder mit den Kontaktdetails aus.
    nameDiv.value = currentContact.name;
    emailDiv.value = currentContact.email;
    phoneDiv.value = currentContact.phoneNumber;
    // Updates the initials display.
    // Aktualisiert die Anzeige der Initialen.
    initialDiv.innerHTML = getInitials(currentContact.name);

    // Hides the edit/delete menu container.
    // Blendet den Container für das Bearbeiten/Löschen-Menü aus.
    hideMenuEditDeleteContainer();
    // Opens the edit contact window.
    // Öffnet das Fenster zum Bearbeiten eines Kontakts.
    openEditContactWindow();
}

// Updates the details of the currently selected contact.
// Aktualisiert die Details des ausgewählten Kontakts.
function updateContact() {
    let name = document.getElementById(`edit_name`).value;
    let email = document.getElementById(`edit_mail`).value;
    let phone = document.getElementById(`edit_phone`).value;
    let contactReady = document.getElementById(`edit_contact_ready`);
    let index = contactData.findIndex(contact => contact.email == email);

    if (index != -1 && currentContact.email != email) {
        // Displays a message if the email already exists.
        // Zeigt eine Nachricht an, wenn die E-Mail bereits existiert.
        contactReady.style.display = "flex";

        return;
    }

    // Updates contact details.
    // Aktualisiert die Kontaktdetails.
    currentContact.name = name;
    currentContact.email = email;
    currentContact.phoneNumber = phone;

    // Updates the contact information display.
    // Aktualisiert die Anzeige der Kontaktdaten.
    setContactInfo(currentContact);

    // Hides the "contact successfully edited" message.
    // Blendet die "Kontakt erfolgreich bearbeitet" -Nachricht aus.
    hideCreateContactMessage("edit_contact_successfully_div");
    // Closes the edit contact window.
    // Schließt das Fenster zum Bearbeiten eines Kontakts.
    closeEditContactWindow();
    // Saves the updated contact data.
    // Speichert die aktualisierten Kontaktdaten.
    putData("contacts", contactData)
        .then(response => console.log(response))
        .catch(error => console.error(error));
    // Regenerates the contact list.
    // Generiert die Kontaktliste neu.
    generateContactList();
}

// Closes the contact information display.
// Schließt die Anzeige der Kontaktdaten.
function closeContactInfo() {
    let contactInfo = document.getElementById(`second_contact_container`);
    let contactList = document.getElementById(`first_contact_container`);
    // Clears the selection.
    // Löscht die Auswahl.
    clearSelect();

    contactInfo.classList.remove(`selected`);
    contactList.classList.remove(`selected`);

    // Hides the edit/delete menu container.
    // Blendet den Container für das Bearbeiten/Löschen-Menü aus.
    hideMenuEditDeleteContainer();
}

// Toggles the display of the edit/delete menu container.
// Schaltet die Anzeige des Containers für das Bearbeiten/Löschen-Menü um.
function menu_window() {
    let menuContainer = document.getElementById(`menu_edit_delete_container`);

    // Toggles the display of the menu container.
    // Schaltet die Anzeige des Menücontainers um.
    if (menuContainer.style.display == "none" || menuContainer.style.display == "") {
        menuContainer.style.display = "flex";
    } else {
        menuContainer.style.display = "none";
    }
}

// Removes the "animate" class from a given element.
// Entfernt die Klasse "animate" von einem bestimmten Element.
function removeClassAnimate(messageDiv) {
    messageDiv.style.display = "none";
    messageDiv.classList.remove("animate");
}
 */

/**
 * Represents the currently selected contact.
 * Repräsentiert den aktuell ausgewählten Kontakt.
 * @type {Object}
 */
let currentContact;

/**
 * Initializes the application by loading contacts and generating the contact list.
 * Initialisiert die Anwendung, indem Kontakte geladen und die Kontaktliste generiert werden.
 * @returns {Promise<void>}
 */
async function init() {
    await loadData("/contacts");
    generateContactList();
}

/**
 * Creates a new contact based on user input.
 * Erstellt einen neuen Kontakt basierend auf Benutzereingaben.
 */
function createContact() {
    /**
     * @type {HTMLInputElement}
     */
    let inputname = document.getElementById(`create_name`);
    /**
     * @type {HTMLInputElement}
     */
    let inputmail = document.getElementById(`create_mail`);
    /**
     * @type {HTMLInputElement}
     */
    let inputphone = document.getElementById(`create_phone`);
    /**
     * @type {HTMLElement}
     */
    let contactReady = document.getElementById(`new_contact_ready`);
    let index = contactData.findIndex(contact => contact.email == inputmail.value);

    if (index != -1) {
        contactReady.style.display = "flex";
        return;
    }

    let contact = {
        name: inputname.value,
        email: inputmail.value,
        phoneNumber: inputphone.value,
    };
    
    contactData.push(contact);

    hideCreateContactMessage("new_contact_successfully_div");
    generateContactList();
    putData("contacts", contactData)
        .then(response => console.log(response))
        .catch(error => console.error(error));

    closeAddNewContactWindow();
}

/**
 * Generates the contact list based on the available contact data.
 * Generiert die Kontaktliste basierend auf den verfügbaren Kontaktdaten.
 */
function generateContactList() {
    /**
     * @type {HTMLElement}
     */
    let contactContainer = document.getElementById(`first_contact_under_container`);
    let lastChar = "";

    contactContainer.innerHTML = "";

    contactData.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1);

    for (let i = 0; i < contactData.length; i++) {
        const contact = contactData[i];
        let select = "";

        if (currentContact) {
            select = contact.name == currentContact.name ? "selected" : "";
        }

        let backgroundColor = colorPool[i % colorPool.length];

        if (lastChar !== contact.name.charAt(0).toUpperCase()) {
            contactContainer.innerHTML += `<div class="alphabet_div">${contact.name.charAt(0).toUpperCase()}</div><hr>`;
            lastChar = contact.name.charAt(0).toUpperCase();
        }

        contactContainer.innerHTML += `
        <div class="div_contact ${select}" id="div_contact_${i}" onclick="selectContact(${i})">
            <div class="contact_initials" style="background-color: ${backgroundColor};">${getInitials(contact.name)}</div>
            <div class="name_email_div">    
                <div class="contact_name">${contact.name}</div>
                <div class="contact_email">${contact.email}</div>
            </div>
        </div>            
        `;
    }
}

/**
 * Selects a contact and displays its details.
 * Wählt einen Kontakt aus und zeigt dessen Details an.
 * @param {number} i - The index of the contact to select.
 */
function selectContact(i) {
    currentContact = contactData[i];
    /**
     * @type {HTMLElement}
     */
    let selectContact = document.getElementById(`div_contact_${i}`);
    /**
     * @type {HTMLElement}
     */
    let contactInfo = document.getElementById(`second_contact_container`);
    /**
     * @type {HTMLElement}
     */
    let contactList = document.getElementById(`first_contact_container`);
    /**
     * @type {HTMLElement}
     */
    let second_contact_infos = document.getElementById(`second_contact_infos`);
    clearSelect();

    selectContact.classList.add(`selected`);
    contactInfo.classList.add(`selected`);
    contactList.classList.add(`selected`);
    second_contact_infos.style.display = "flex";

    setContactInfo(currentContact);
}

/**
 * Clears the selection of contacts.
 * Löscht die Auswahl der Kontakte.
 */
function clearSelect() {
    /**
     * @type {HTMLCollectionOf<HTMLElement>}
     */
    let list = document.getElementsByClassName(`div_contact`);

    for (let i = 0; i < list.length; i++) {
        const element = list[i];

        element.classList.remove(`selected`);
    }
}

/**
 * Sets the contact information to be displayed.
 * Legt die anzuzeigenden Kontaktdaten fest.
 * @param {Object} contact - The contact object containing name, email, and phoneNumber.
 */
function setContactInfo(contact) {
    /**
     * @type {HTMLElement}
     */
    let nameDiv = document.getElementById(`name_div_big`);
    /**
     * @type {HTMLElement}
     */
    let emailDiv = document.getElementById(`email_optionen`);
    /**
     * @type {HTMLElement}
     */
    let phoneDiv = document.getElementById(`phone_optionen`);
    /**
     * @type {HTMLElement}
     */
    let initialDiv = document.getElementById(`name_div_small`);

    nameDiv.innerHTML = contact.name;

    let emailLink = document.createElement('a');

    emailLink.href = `mailto:${contact.email}`;
    emailLink.textContent = contact.email;
    emailDiv.innerHTML = '';
    emailDiv.appendChild(emailLink);

    let phoneLink = document.createElement('a');

    phoneLink.href = `tel:${contact.phoneNumber}`;
    phoneLink.textContent = contact.phoneNumber; 
    phoneDiv.innerHTML = '';
    phoneDiv.appendChild(phoneLink);

    initialDiv.innerHTML = getInitials(contact.name);
}

/**
 * Opens the window for adding a new contact.
 * Öffnet das Fenster zum Hinzufügen eines neuen Kontakts.
 */
function openAddNewContactWindow() {
    document.getElementById(`new_contact_container`).style.display = "flex";
    clearInputs();
    document.body.style.overflow = "hidden";
    /**
     * @type {HTMLElement}
     */
    let contactReady = document.getElementById(`new_contact_ready`);
    contactReady.style.display = "none";
}

/**
 * Opens the window for editing a contact.
 * Öffnet das Fenster zum Bearbeiten eines Kontakts.
 */
function openEditContactWindow() {
    document.getElementById(`edit_contact_container`).style.display = "flex";
    document.body.style.overflow = "hidden";
}

/**
 * Closes the window for adding a new contact.
 * Schließt das Fenster zum Hinzufügen eines neuen Kontakts.
 */
function closeAddNewContactWindow() {
    document.getElementById(`new_contact_container`).style.display = "none";
    document.body.style.overflow = "auto";
}

/**
 * Displays a message for creating a new contact and hides it after a delay.
 * Zeigt eine Nachricht zur Erstellung eines neuen Kontakts an und blendet sie nach einer Verzögerung aus.
 * @param {string} messageID - The ID of the message element to display.
 */
function hideCreateContactMessage(messageID) {
    /**
     * @type {HTMLElement}
     */
    var messageDiv = document.getElementById(messageID);
    messageDiv.style.display = "flex";
    messageDiv.classList.add("animate");

    setTimeout(function () {
        removeClassAnimate(messageDiv);
    }, 5000);
}

/**
 * Closes the window for editing a contact.
 * Schließt das Fenster zum Bearbeiten eines Kontakts.
 */
function closeEditContactWindow() {
    document.getElementById(`edit_contact_container`).style.display = "none";
    document.body.style.overflow = "auto";
}

/**
 * Deletes a contact.
 * Löscht einen Kontakt.
 */
function deleteContact() {
    let index = contactData.findIndex(contact => contact.email == currentContact.email);
    /**
     * @type {HTMLElement}
     */
    let second_contact_infos = document.getElementById(`second_contact_infos`);
    contactData.splice(index, 1);

    second_contact_infos.style.display = "none";
    closeEditContactWindow();

    hideCreateContactMessage("delete_contact_successfully_div");
    hideMenuEditDeleteContainer();
    closeContactInfo();
    putData("contacts", contactData)
        .then(response => console.log(response))
        .catch(error => console.error(error));
    generateContactList();
}

/**
 * Hides the menu for editing and deleting contacts.
 * Blendet das Menü zum Bearbeiten und Löschen von Kontakten aus.
 */
function hideMenuEditDeleteContainer() {
    /**
     * @type {HTMLElement}
     */
    let menu_edit_delete_container = document.getElementById(`menu_edit_delete_container`);
    menu_edit_delete_container.style.display = "none";
}

/**
 * Edits a contact.
 * Bearbeitet einen Kontakt.
 */
function editContact() {
    /**
     * @type {HTMLInputElement}
     */
    let nameDiv = document.getElementById(`edit_name`);
    /**
     * @type {HTMLInputElement}
     */
    let emailDiv = document.getElementById(`edit_mail`);
    /**
     * @type {HTMLInputElement}
     */
    let phoneDiv = document.getElementById(`edit_phone`);
    /**
     * @type {HTMLElement}
     */
    let initialDiv = document.getElementById(`profil_name_initialen`);
    /**
     * @type {HTMLElement}
     */
    let contactReady = document.getElementById(`edit_contact_ready`);

    contactReady.style.display = "none";
    nameDiv.value = currentContact.name;
    emailDiv.value = currentContact.email;
    phoneDiv.value = currentContact.phoneNumber;
    initialDiv.innerHTML = getInitials(currentContact.name);

    hideMenuEditDeleteContainer();
    openEditContactWindow();
}

/**
 * Updates the details of an edited contact.
 * Aktualisiert die Details eines bearbeiteten Kontakts.
 */
function updateContact() {
    let name = document.getElementById(`edit_name`).value;
    let email = document.getElementById(`edit_mail`).value;
    let phone = document.getElementById(`edit_phone`).value;
    /**
     * @type {HTMLElement}
     */
    let contactReady = document.getElementById(`edit_contact_ready`);
    let index = contactData.findIndex(contact => contact.email == email);

    if (index != -1 && currentContact.email != email) {
        contactReady.style.display = "flex";

        return;
    }

    currentContact.name = name;
    currentContact.email = email;
    currentContact.phoneNumber = phone;

    setContactInfo(currentContact);

    hideCreateContactMessage("edit_contact_successfully_div");
    closeEditContactWindow();
    putData("contacts", contactData)
        .then(response => console.log(response))
        .catch(error => console.error(error));
    generateContactList();
}

/**
 * Closes the display of contact information.
 * Schließt die Anzeige der Kontaktdaten.
 */
function closeContactInfo() {
    /**
     * @type {HTMLElement}
     */
    let contactInfo = document.getElementById(`second_contact_container`);
    /**
     * @type {HTMLElement}
     */
    let contactList = document.getElementById(`first_contact_container`);
    clearSelect();

    contactInfo.classList.remove(`selected`);
    contactList.classList.remove(`selected`);

    hideMenuEditDeleteContainer();
}

/**
 * Toggles the display of the edit/delete menu container.
 * Schaltet die Anzeige des Containers für das Bearbeiten/Löschen-Menü um.
 */
function menu_window() {
    /**
     * @type {HTMLElement}
     */
    let menuContainer = document.getElementById(`menu_edit_delete_container`);

    if (menuContainer.style.display == "none" || menuContainer.style.display == "") {
        menuContainer.style.display = "flex";
    } else {
        menuContainer.style.display = "none";
    }
}

/**
 * Removes the "animate" class from a given element.
 * Entfernt die Klasse "animate" von einem bestimmten Element.
 * @param {HTMLElement} messageDiv - The message element to remove the class from.
 */
function removeClassAnimate(messageDiv) {
    messageDiv.style.display = "none";
    messageDiv.classList.remove("animate");
}
