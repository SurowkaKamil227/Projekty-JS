document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('note-form');
    const notesContainer = document.getElementById('notes-container');
    const search = document.getElementById('search');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const color = document.getElementById('color').value;
        const pin = document.getElementById('pin').checked;
        const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
        const date = new Date().toISOString();
        const reminder = document.getElementById('reminder').value;
        const listItems = document.getElementById('list-items').value.split(',').map(item => item.trim());

        const note = { title, content, color, pin, tags, date, reminder, listItems, doneItems: [] };
        saveNoteToLocalStorage(note);
        displayNotes();
        form.reset();
    });

    search.addEventListener('input', displayNotes);

    function saveNoteToLocalStorage(note) {
        const notes = getNotesFromLocalStorage();
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function getNotesFromLocalStorage() {
        const notes = localStorage.getItem('notes');
        return notes ? JSON.parse(notes) : [];
    }

    function displayNotes() {
        notesContainer.innerHTML = '';
        const notes = getNotesFromLocalStorage();
        const searchTerm = search.value.toLowerCase();
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        filteredNotes.sort((a, b) => b.pin - a.pin);
        filteredNotes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.style.backgroundColor = note.color;
            const now = new Date();
            const reminderDate = new Date(note.reminder);
            const isReminderDue = reminderDate && reminderDate <= now;

            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <small>${new Date(note.date).toLocaleString()}</small>
                <p>Tagi: ${note.tags.join(', ')}</p>
                ${note.reminder ? `<p>Przypomnienie: ${new Date(note.reminder).toLocaleString()}</p>` : ''}
                ${isReminderDue ? '<p class="reminder">Przypomnienie!</p>' : ''}
                <ul>
                    ${note.listItems.map((item, i) => `
                        <li onclick="markAsDone(${index}, ${i})">${item}</li>
                    `).join('')}
                </ul>
                <h3>Wykonane</h3>
                <ul>
                    ${note.doneItems.map((item, i) => `
                        <li>${item}</li>
                    `).join('')}
                </ul>
                <button onclick="deleteNote(${index})">Usuń</button>
                <button class="pin" onclick="togglePin(${index})">${note.pin ? 'Odepnij' : 'Przypnij'}</button>
            `;
            notesContainer.appendChild(noteElement);
        });
    }

    window.deleteNote = function(index) {
        const notes = getNotesFromLocalStorage();
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }

    window.togglePin = function(index) {
        const notes = getNotesFromLocalStorage();
        notes[index].pin = !notes[index].pin;
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }

    window.markAsDone = function(noteIndex, itemIndex) {
        const notes = getNotesFromLocalStorage();
        const note = notes[noteIndex];
        const doneItem = note.listItems.splice(itemIndex, 1);
        note.doneItems.push(doneItem);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }

    displayNotes();
});
