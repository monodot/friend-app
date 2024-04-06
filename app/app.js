// Add the storage key as an app-wide constant
const STORAGE_KEY = "friend-app-notes";

// create constants for the form and the form controls
const recentNotesContainer = document.getElementById("recent-notes");
const newNoteFormE = document.getElementsByTagName("form")[0];
const noteContactSelectE = document.getElementById("note-contact");
const noteDateInputE = document.getElementById("note-date");
const noteTypeSelectE = document.getElementById("note-type");
const noteTextInputE = document.getElementById("note-text");

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

  // Store the new period in our client-side storage.
  storeNewNote(note);
  // storeNewPeriod(startDate, endDate);

  // Refresh the UI.
  renderRecentNotes();

  // Reset the form.
  newNoteFormE.reset();
});


function storeNewNote(note) {
  // Get data from storage.
  const notes = getAllNotes();

  // Add the new note object to the end of the array of period objects.
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
  // get the parsed string of periods, or an empty array.
  const notes = getAllNotes();

  // exit if there are no periods
  if (notes.length === 0) {
    return;
  }

  // Clear the list of past periods, since we're going to re-render it.
  recentNotesContainer.innerHTML = "";

  const recentNotesHeader = document.createElement("h2");
  recentNotesHeader.textContent = "Recent notes";

  const recentNotesList = document.createElement("ul");

  // Loop over all periods and render them.
  notes.forEach((note) => {
    const noteEl = document.createElement("li");
    // TODO Fix horrible security hole of rendering unsanitized HTML
    noteEl.innerHTML = `
      <p><strong>${note.contact}</strong> <time>${formatDate(note.date)}</time> <em>${note.type}</em></p>
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

// Start the app by rendering the recent notes.
renderRecentNotes();

