// import getDbClient from './dbClient.js';

"use strict";

// Add the storage key as an app-wide constant
const STORAGE_KEY = "friend-app-notes";
const DATABASE_NAME = "friendapp";
const FRIENDS_TABLE_NAME = "friends";
const NOTES_TABLE_NAME = "notes";
const DB_VERSION = 1;

let state = {
  selectedView: { name: "home" },
};

let db;

const dbPromise = new Promise((resolve, reject) => {
  const openRequest = indexedDB.open(DATABASE_NAME, DB_VERSION);

  openRequest.onupgradeneeded = function (e) {
    // Perform database upgrade.
    const db = e.target.result;
    if (!db.objectStoreNames.contains(FRIENDS_TABLE_NAME)) {
      const friends = db.createObjectStore(FRIENDS_TABLE_NAME, {
        autoIncrement: true,
      });
      const notes = db.createObjectStore(NOTES_TABLE_NAME, {
        autoIncrement: true,
      });
      notes.createIndex("name", "name", { unique: false });

      friends.add({ name: "Alice" });
      friends.add({ name: "Bob" });
      friends.add({ name: "Charlie" });
      friends.add({ name: "David" });

      notes.add({
        name: "Alice",
        date: "2021-01-01",
        type: "call",
        text: "Called Alice",
      });
      notes.add({
        name: "Alice",
        date: "2021-01-02",
        type: "meetup",
        text: "Went for a drink at the cafe. Chatted about Hemingway.",
      });
      notes.add({
        name: "Bob",
        date: "2021-01-02",
        type: "email",
        text: "Emailed Bob",
      });
      notes.add({
        name: "Charlie",
        date: "2021-01-03",
        type: "meeting",
        text: "Met Charlie",
      });
      notes.add({
        name: "David",
        date: "2021-01-04",
        type: "call",
        text: "Called David",
      });
    }
  };

  openRequest.onsuccess = function (e) {
    db = e.target.result;
    resolve(db);
  };

  openRequest.onerror = function (e) {
    console.error("IndexedDB error:", e.target.errorCode);
    reject(e.target.errorCode);
  };
});

async function initData() {
  try {
    const circle = document.querySelector("friends-circle");
    circle.friends = await getFriends();
  } catch (error) {
    console.error("Could not initialize database:", error);
    // Handle failure: Maybe fallback to a different storage or notify the user
  }
}

initData();

// create constants for the form and the form controls
const recentNotesContainer = document.getElementById("recent-notes");
const newNoteFormE = document.getElementsByTagName("form")[0];
const noteContactSelectE = document.getElementById("note-contact");
const noteDateInputE = document.getElementById("note-date");
const noteTypeSelectE = document.getElementById("note-type");
const noteTextInputE = document.getElementById("note-text");

const canvasContainer = document.getElementById("canvas");

// Listen to form submissions.
newNoteFormE.addEventListener("submit", (event) => {
  // Prevent the form from submitting to the server
  // since everything is client-side.
  event.preventDefault();

  // Get the start and end dates from the form.
  const noteDate = noteDateInputE.value;
  const noteType = noteTypeSelectE.value;
  const noteText = noteTextInputE.value;
  const noteContact = noteContactSelectE.value;

  // TODO: Do some validation here.

  const note = {
    contact: noteContact,
    date: noteDate,
    type: noteType,
    text: noteText,
  };

  // Store the new note in our client-side storage.
  storeNewNote(note);

  // Refresh the UI.
  const notesListElement = document.querySelector("notes-list");
  notesListElement.updateComponent();

  // Reset the form.
  newNoteFormE.reset();

  hidePopover();
});

function storeNewNote(note) {
  // Get data from storage.
  const notes = getAllNotes();

  // Add the new note object to the end of the array of note objects.
  notes.push(note);

  // Store the updated array back in the storage.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function showError(message) {
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.style.color = "red";
  const errorBanner = document.querySelector("#error-banner");
  errorBanner.appendChild(errorElement);
  errorBanner.style.display = "block";
}

function formatDate(dateString) {
  // Convert the date string to a Date object.
  const date = new Date(dateString);

  // Format the date into a locale-specific string.
  // include your locale for better user experience
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

async function navigateToView(target) {
  const { name, params } = target;
  // Hide all views
  document.querySelectorAll("main > div.view").forEach((view) => {
    view.style.display = "none";
  });
  switch (name) {
    case "home":
      state.selectedView = { name: "home" };
      // document.querySelector("#home-view").classList.remove("hidden");
      document.querySelector("#home-view").style.display = "block";
      break;
    case "new-note":
      state.selectedView = { name: "new-note" };
      // document.querySelector("#new-note-view").classList.remove("hidden");
      document.querySelector("#new-note-view").style.display = "block";
      break;
    case "contact":
      const notes = await getNotesForUser(params.name);
      const contactDetails = document.querySelector("contact-details");
      contactDetails.name = params.name; // update the displayed contact
      const notesList = document.querySelector("notes-list");
      notesList.notes = notes;

      state.selectedView = { name: "contact", params };
      document.querySelector("#contact-view").style.display = "block";
      break;
    default:
      break;
  }
}

function showPopover() {
  document.querySelector("#edit-note-view").style.display = "block";
}
function hidePopover() {
  document.querySelector("#edit-note-view").style.display = "none";
}

// STATE ----------------------------------------------

async function getNotesForUser(name) {
  try {
    const db = await dbPromise;
    const transaction = db.transaction(NOTES_TABLE_NAME, "readonly");
    const store = transaction.objectStore(NOTES_TABLE_NAME);
    // const index = store.index("name");
    const request = store.index("name").getAll(name);

    // Return a Promise so the caller can await it
    return new Promise((resolve, reject) => {
      request.onsuccess = function (event) {
        const notes = event.target.result;
        resolve(notes);
      };
      request.onerror = function (event) { //  THIS SEEMS WRONG
        reject("Error getting notes");
      };
    });
  } catch (error) {
    console.error("Could not initialize database:", error);
    showError("No database connection.");
    return [];
  }
}

async function getFriends() {
  try {
    const db = await dbPromise;
    const transaction = db.transaction(FRIENDS_TABLE_NAME, "readonly");
    const store = transaction.objectStore(FRIENDS_TABLE_NAME);
    const request = store.getAll();

    // Return a Promise so the caller can await it
    return new Promise((resolve, reject) => {
      request.onsuccess = function (event) {
        const friends = event.target.result;
        resolve(friends);
      };
      request.onerror = function (event) {
        reject("Error getting friends");
      };
    });
  } catch (error) {
    console.error("Could not initialize database:", error);
    // Handle failure: Maybe fallback to a different storage or notify the user
    showError("No database connection.");
    return [];
  }
}

// COMPONENTS ----------------------------------------------

class RecentNotes extends HTMLElement {
  set notes(value) {
    this._notes = value;
    this.updateComponent();
  }

  get notes() {
    return this._notes;
  }

  connectedCallback() {
    this.updateComponent();
  }

  updateComponent() {
    if (!this.notes) {
      return;
    }
    this.innerHTML = this.notes
      .map(
        (note) => `
          <p><strong>${note.contact}</strong> <time>${formatDate(
          note.date
        )}</time> <em>${note.type}</em></p>
            <p>${note.text}</p>
        `
      )
      .join("");
  }
}
customElements.define("recent-notes", RecentNotes);

class FriendsCircle extends HTMLElement {
  set friends(value) {
    this._friends = value;
    this.updateComponent();
  }

  get friends() {
    return this._friends;
  }

  connectedCallback() {
    this.updateComponent();
  }

  async updateComponent() {
    if (!this.friends) {
      return;
    }
    this.innerHTML = `<div class="friend-grid">${this.friends
      .map(
        (friend) => `<div>
        <a href="#" onclick="navigateToView({ name: 'contact', params: { name: '${friend.name}' }}); return false;">
          <svg viewBox="0 0 86 86" style="width:80%;"><ellipse style="fill:#FFD6AF;" cx="43" cy="43" rx="40" ry="40"></ellipse>
          </svg>
          <p style="margin:0.5rem 0">${friend.name}</p>
        </a></div>`
      )
      .join("")}</div>`;
  }
}
customElements.define("friends-circle", FriendsCircle);

class ContactDetails extends HTMLElement {
  set name(value) {
    this._name = value;
    this.updateComponent();
  }

  get name() {
    return this._name;
  }

  connectedCallback() {
    this.updateComponent();
  }

  updateComponent() {
    this.innerHTML = `<div class="contact-details">
      <header><h2>${this.name}</h2>
      </div>`;
  }
}
customElements.define("contact-details", ContactDetails);

class NotesList extends HTMLElement {
  set notes(value) {
    this._notes = value;
    this.updateComponent();
  }

  get notes() {
    return this._notes;
  }

  connectedCallback() {
    this.updateComponent();
  }

  updateComponent() {
    if (!this.notes) {
      return;
    }
    this.innerHTML = `<div class="notes-list">${this.notes
      .map(
        (note) => `<div>
          <p><strong>${note.contact}</strong> <time>${formatDate(
          note.date
        )}</time> <em>${note.type}</em></p>
            <p>${note.text}</p>
        </div>`
      )
      .join("")}</div>`;
  }
}
customElements.define("notes-list", NotesList);
