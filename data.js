/**
 * The URL for storing data.
 * Die URL zum Speichern von Daten.
 * @type {string}
 */
const STORAGE_URL = "https://join-8aa83-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * An array containing contact data.
 * Ein Array, das Kontaktdaten enthält.
 * @type {Array<Object>}
 */
let contactData = [
    {
        'name': 'Anton Mayer',
        'email': 'a.mayer@gmail.com',
        'phoneNumber': '+49 1111 111 11 1'
    },
    // ... weitere Kontaktobjekte ...
];

/**
 * An array containing task data.
 * Ein Array, das Aufgabendaten enthält.
 * @type {Array<Object>}
 */
let tasks = [
    {
        'title': 'Contact Form & Imprint',
        'description': 'Create a contact form and imprint page...',
        'assignedTo': ['Anja Schulz', 'David Eisenberg', 'Eva Fischer'],
        // ... weitere Aufgabenobjekte ...
    },
    // ... weitere Aufgabenobjekte ...
];

/**
 * An array containing color codes for UI elements.
 * Ein Array, das Farbcodes für UI-Elemente enthält.
 * @type {Array<string>}
 */
const colorPool = [
    '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8',
    '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701',
    '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
];

/**
 * Sends data to the specified path.
 * Sendet Daten an den angegebenen Pfad.
 * @param {string} path - The path where the data will be stored. Der Pfad, unter dem die Daten gespeichert werden.
 * @param {Object} data - The data to be stored. Die zu speichernden Daten.
 * @returns {Promise<Object>} - A promise containing the response data. Ein Promise mit den Antwortdaten.
 */
async function putData(path = "", data = {}) {
    try {
        let response = await fetch(STORAGE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error sending data: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error sending data: ${error.message}`);
    }
}

/**
 * Loads data from the specified path.
 * Lädt Daten aus dem angegebenen Pfad.
 * @param {string} path - The path from where the data will be loaded. Der Pfad, aus dem die Daten geladen werden.
 * @returns {Promise<void>} - A promise indicating the completion of data loading. Ein Promise, das das Abschließen des Datenladens angibt.
 */
async function loadData(path = "") {
    let response = await fetch(STORAGE_URL + path + ".json");
    let responseAsJson = await response.json();

    // Load contact data
    contactData = responseAsJson;
    /* Further code to be loaded */
    tasks = responseAsJson;

    /* *********************** */
    console.log(responseAsJson);
}

/**
 * Initializes shared elements on the page.
 * Initialisiert gemeinsame Elemente auf der Seite.
 */
function sharedInit() {
    let loginInitial = document.getElementById(`nav_right_menu`);
    loginInitial.innerHTML = getInitials(`Max Mustermann`);
}

/**
 * Returns the initials of a given string.
 * Gibt die Initialen eines gegebenen Strings zurück.
 * @param {string} inputString - The input string from which to generate initials. Der Eingabestring, aus dem Initialen generiert werden sollen.
 * @returns {string} - The initials of the input string. Die Initialen des Eingabestrings.
 */
function getInitials(inputString) {
    const words = inputString.split(` `);
    let initials = "";

    for (const word of words) {
        if (initials.length < 2) {
            initials += word.charAt(0);
        }
    }

    return initials.toUpperCase();
}

/**
 * Toggles the visibility of the jura container.
 * Schaltet die Sichtbarkeit des Jura-Containers um.
 */
function jura_window() {
    let juraContainer = document.getElementById(`jura_container`);

    if (juraContainer.style.display == "none" || juraContainer.style.display == "") {
        juraContainer.style.display = "flex";
    } else {
        juraContainer.style.display = "none";
    }
}

/**
 * Redirects the user to the previous page.
 * Leitet den Benutzer zur vorherigen Seite weiter.
 */
function goBack() {
    window.location.href = '/summary';
}

/**
 * Redirects the user to the login page.
 * Leitet den Benutzer zur Anmeldeseite weiter.
 */
function goBackLogin() {
    window.location.href = '/';
}
