"use strict";

// Add the storage key as an app-wide constant
const STORAGE_KEY = "friend-app-notes";

let state = {
  selectedView: { name: "home" },
};

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
  const notesListElement = document.querySelector('notes-list');
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

function getAllNotes() {
  // Get the string of notes from localStorage
  const data = window.localStorage.getItem(STORAGE_KEY);

  // If no notes were stored, default to an empty array
  // otherwise, return the stored data as parsed JSON
  const notes = data ? JSON.parse(data) : [];

  return notes;
}

function renderRecentNotes() {
  // get the parsed string of notes, or an empty array.
  const notes = getAllNotes();

  // exit if there are no notes
  if (notes.length === 0) {
    return;
  }

  // Clear the list of past notes, since we're going to re-render it.
  recentNotesContainer.innerHTML = "";

  const recentNotesHeader = document.createElement("h2");
  recentNotesHeader.textContent = "Recent notes";

  const recentNotesList = document.createElement("ul");

  // Loop over all notes and render them.
  notes.forEach((note) => {
    const noteEl = document.createElement("li");
    // TODO Fix horrible security hole of rendering unsanitized HTML
    noteEl.innerHTML = `
      <p><strong>${note.contact}</strong> <time>${formatDate(
      note.date
    )}</time> <em>${note.type}</em></p>
      <p>${note.text}</p>`;
    recentNotesList.appendChild(noteEl);
  });

  recentNotesContainer.appendChild(recentNotesHeader);
  recentNotesContainer.appendChild(recentNotesList);
}

function formatDate(dateString) {
  // Convert the date string to a Date object.
  const date = new Date(dateString);

  // Format the date into a locale-specific string.
  // include your locale for better user experience
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

function navigateToView(target) {
  const { name, params } = target;
  // Hide all views
  document.querySelectorAll("main > *").forEach((view) => {
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
      state.selectedView = { name: "contact", params };
      document.querySelector("#contact-view").style.display = "block";
      const contactDetails = document.querySelector("contact-details");
      contactDetails.name = params.name; // update the displayed contact
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

function getFriends() {
  return [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" },
    { name: "David" },
  ];
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
    // Fetch recent notes and render them
    const notes = getAllNotes();
    this.innerHTML = notes
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
  connectedCallback() {
    this.updateComponent();
  }

  updateComponent() {
    // Fetch friends and render them
    const friends = getFriends();
    this.innerHTML = `<div class="friend-grid">${friends
      .map((friend) => `<div>
        <a href="#" onclick="navigateToView({ name: 'contact', params: { name: '${friend.name}' }}); return false;">
          <svg viewBox="0 0 86 86" style="width:80%;"><ellipse style="fill:#FFD6AF;" cx="43" cy="43" rx="40" ry="40"></ellipse>
          </svg>
          <p style="margin:0.5rem 0">${friend.name}</p>
        </a></div>`)
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
    // Fetch contact and render them
    this.innerHTML = `<div class="contact-details">
      <header><h2>${this.name}</h2>
      </div>`;
  }
}
customElements.define("contact-details", ContactDetails);

class NotesList extends HTMLElement {
  connectedCallback() {
    this.updateComponent();
  }

  updateComponent() {
    // Fetch notes and render them
    const notes = getAllNotes();
    this.innerHTML = `<div class="notes-list">${notes
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
