// import './dragDrop';
// import categories from './public/data.js';

let notes = [];
const categoriesEl = document.querySelector('.categories__list');
const notesEl = document.querySelector('.notes');
const notesListEl = document.querySelector('.notes__list');
const noteEditorEl = document.querySelector('.editor');
const addNewNoteBtn = document.querySelector('.notes__add-new-note-btn');
const delNoteBtn = document.querySelector('.delete-btn');
const searchInput = document.querySelector('.notes__search__input');
const catMenu = document.querySelector('.categories__menu-btn');
let currentCat = categories[0].id;

init();

function init () {
    initStorage();
    renderCategoryListItems(categories, currentCat);
    renderNoteListItems(notes, currentCat);
    displayFirstNoteInNoteEditor(notes, currentCat);
    initDragAndDrop();
    categoriesEl.addEventListener('click', selectCategory);
    notesListEl.addEventListener('click', selectNote);
    addNewNoteBtn.addEventListener('click', createNewNote);
    delNoteBtn.addEventListener('click', onClickDelete);
    searchInput.addEventListener('input', searchCurrNotes);
}
function selectCategory (evt) {
    if (evt.target.nodeName != 'LI') {
        return;
    }
    let selectedCatId = evt.target.dataset.id;
    let selectedCat = document.querySelector('.curr-cat');
    if (selectedCat) {
        selectedCat.classList.remove('curr-cat');
    }
    currentCat = selectedCatId;
    evt.target.classList.add('curr-cat');
    renderNoteListItems(notes, selectedCatId);
    noteEditorEl.innerHTML = '';
    displayFirstNoteInNoteEditor(notes, currentCat);
    initDragAndDrop();
}
function selectNote (evt) {
    if (evt.target.parentElement.nodeName != 'LI') {
        return;
    }
    let id = evt.target.parentElement.dataset.id;
    let selectedNote = document.querySelector('.selected');
    if (selectedNote) {
        selectedNote.classList.remove('selected');
    }
    evt.target.parentElement.classList.add('selected')
    renderNoteEditor(notes, id);
}
function buildCategoryListItem (catName, id, isSelected) {
    let catEl = document.createElement('li');
    let catTxt = document.createTextNode(catName);
    catEl.className = 'categories__list__item';
    catEl.classList.add('drop-zone')
    isSelected && catEl.classList.add('curr-cat');
    catEl.dataset.id = id;
    catEl.appendChild(catTxt);
    return catEl;
}
function buildNoteListItem (data, catId, isSelected) {
    let noteEl = document.createElement('li');
    let noteTitleEl = document.createElement('div');
    let noteTitleTxt = document.createTextNode(data.title);
    let noteBodyEl = document.createElement('div');
    let noteBodyTxt = document.createTextNode(data.body);
    noteEl.className = 'notes__list__item';
    noteEl.classList.add('draggable');
    noteTitleEl.className = 'notes__list__item__title';
    noteBodyEl.className = 'notes__list__item__body';
    isSelected && noteEl.classList.add('selected');
    noteEl.dataset.id = data.id;
    noteEl.dataset.catId = catId;
    noteEl.appendChild(noteTitleEl);
    noteTitleEl.appendChild(noteTitleTxt);
    noteEl.appendChild(noteBodyEl);
    noteBodyEl.appendChild(noteBodyTxt);
    return noteEl;
}
function buildNoteEditor (note) {
    let edContFrag = document.createDocumentFragment('div');
    let edTitleEl = document.createElement('textarea');
    edTitleEl.value = note.title;
    let edBodyEl = document.createElement('textarea');
    edBodyEl.value = note.body;
    edTitleEl.className = 'editor__title';
    edBodyEl.className = 'editor__body';
    edTitleEl.dataset.id = note.id;
    edBodyEl.dataset.id = note.id;
    edContFrag.appendChild(edTitleEl);
    edContFrag.appendChild(edBodyEl);
    edTitleEl.addEventListener('input', onInputSaveNoteTitle);
    edBodyEl.addEventListener('input', onInputSaveNoteBody);
    return edContFrag;
}
function renderCategoryListItems (categories) {
    categories.forEach((c, index) => {
        if(index === 0) {
            categoriesEl.appendChild(buildCategoryListItem(c.name, c.id, true));
        } else {
            categoriesEl.appendChild(buildCategoryListItem(c.name, c.id))
        }        
    });
}
function renderNoteListItems (notes, catId) {
    notesListEl.innerHTML = '';
    const catNotes = notes.filter(n => n.category_id === catId);
    catNotes.forEach((n, i) => {
        if(i == 0) {
            notesListEl.appendChild(buildNoteListItem(n, catId, true))
        } else {
            notesListEl.appendChild(buildNoteListItem(n, catId))
        }
    });
}
function renderNoteEditor (notes, noteId) {
    noteEditorEl.innerHTML = '';
    for (let i = 0; i < notes.length; i++) {
        if (noteId === notes[i].id) {
            noteEditorEl.appendChild(buildNoteEditor(notes[i]));
        }
    };
}
function createNewNote () {
    noteEditorEl.innerHTML = '';
    let newNote = {
        id: generateRandomId(),
        title: 'new note title',
        body: 'new note body',
        category_id: currentCat
    }
    notes.unshift(newNote);
    renderNoteListItems(notes, currentCat);
    renderNoteEditor(notes, newNote.id);
    persistData();
}
function onClickDelete (evt) {
    const title = document.querySelector('.editor__title');
    const id = title.dataset.id;
    notes = deleteNote(notes, id);
    deleteNoteFromDom(id);
    highlightFirstNoteItem();
    persistData();
    if (notesListEl.innerHTML === '') {
        return;
    } else {
        displayFirstNoteInNoteEditor(notes, currentCat);
    }
}
function deleteNote (notes, id) {
    return notes.filter(n => n.id != id);
}
function deleteNoteFromDom (id) {
    let noteListItem = document.querySelector(`.notes__list__item[data-id="${id}"]`);
    noteListItem.remove();
    noteEditorEl.innerHTML = '';
}
function onInputSaveNoteTitle (evt) {
    let newTitle = evt.target.value;
    let noteID = evt.target.dataset.id;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === noteID) {
            notes[i].title = newTitle;
        }
    }
    persistData();
    updateCurrentNotesListItemTitle(newTitle);
}
function updateCurrentNotesListItemTitle (val) {
    let title = document.querySelector('.selected .notes__list__item__title');
    title.innerText = val;
}
function onInputSaveNoteBody (evt) {
    let newBody = evt.target.value;
    let noteID = evt.target.dataset.id;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === noteID) {
            notes[i].body = newBody;
        }
    }
    persistData();
    updateCurrentNotesListItemBody(newBody);
}
function updateCurrentNotesListItemBody (val) {
    let body = document.querySelector('.selected .notes__list__item__body');
    body.innerText = val;
}
function displayFirstNoteInNoteEditor (notes, catId) {
    catId = currentCat;
    let firstNote = notes.filter(n => (n.category_id === catId));
    if (notesListEl.innerHTML === '') {
        return;
    } else {
    renderNoteEditor(notes, firstNote[0].id)
    }
}
function highlightFirstNoteItem () {
    notesListEl.children[0] && notesListEl.children[0].classList.add('selected');
}
function searchCurrNotes (evt) {
    let currNotes = notes.filter(n => n.category_id === currentCat);
    let searchRes = currNotes.filter(n => n.title.includes(evt.target.value));
    renderNoteListItems(searchRes, currentCat);
}


function initDragAndDrop () {
    let draggables = document.querySelectorAll('.draggable');
    let dropZones = document.querySelectorAll('.drop-zone');
    initDraggables(draggables);
    initDropZones(dropZones);
}
function initDraggables (draggables) {
    for (const draggable of draggables) {
        initDraggable(draggable)
    }
}
function initDropZones (dropZones) {
    for (const dropZone of dropZones) {
        initDropZone(dropZone)
    }
}
function initDraggable (draggable) {
    draggable.addEventListener('dragstart', dragStartHandler);
    draggable.addEventListener('dragend', dragEndHandler);
    draggable.setAttribute('draggable', 'true');
}
function initDropZone (dropZone) {
    dropZone.addEventListener('dragenter', dropZoneEnterHandler);
    dropZone.addEventListener('dragover', dropZoneOverHandler);
    dropZone.addEventListener('dragleave', dropZoneLeaveHandler);
    dropZone.addEventListener('drop', dropZoneDropHandler);
}
function dragStartHandler(evt) {
    setDropZonesHighlight();
    this.classList.add('dragged');
    evt.dataTransfer.setData('type', 'dragged');
    evt.dataTransfer.setData('noteId', evt.target.dataset.id);
    evt.dataTransfer.setData('catId', evt.target.dataset.catId);
}
function dragEndHandler (evt) {
    setDropZonesHighlight(false);
}
function dropZoneEnterHandler(evt) {
    if (evt.dataTransfer.types.includes('type')) {
        this.classList.add('over-zone');
    }
    evt.preventDefault();
}
function dropZoneOverHandler (evt) {
    evt.preventDefault();
}
function dropZoneLeaveHandler (evt) {
    if (evt.dataTransfer.types.includes('type') &&
        evt.relatedTarget !== null &&
        evt.currentTarget !== evt.relatedTarget.closest('.drop-zone')) {
        this.classList.remove('over-zone');
    }
}
function dropZoneDropHandler (evt) {
    let selectedCatId = evt.currentTarget.dataset.id;
    let draggedItem = document.querySelector('.dragged')
    let draggedElCatId = evt.dataTransfer.getData('catId');
    let draggedElNoteId = evt.dataTransfer.getData('noteId');

    if (selectedCatId === draggedElCatId) {
        draggedItem.classList.remove('dragged');
        return;
    } else {
        changeNoteCat(selectedCatId, draggedElNoteId);
        removeNoteNode(draggedElNoteId);
        checkSelection(draggedElCatId);
    }
    evt.preventDefault();
}
function checkSelection (catID) {
    let selectedNote = document.querySelector('.selected');
    if (!selectedNote) {
        highlightFirstNoteItem();
        displayFirstNoteInNoteEditor(notes, catID)
    }

}
function changeNoteCat (catId, noteId) {
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === noteId) {
            notes[i].category_id = catId
        }
    }
    persistData();
}
function removeNoteNode (noteId) {
    let draggedNote = document.querySelector(`.notes__list__item[data-id="${noteId}"]`);
    draggedNote.remove();

}
function setDropZonesHighlight (highlight = true) {
    const dropZones = document.querySelectorAll('.drop-zone');
    for (const dropZone of dropZones) {
        if (highlight) {
            dropZone.classList.add('active-zone');
        } else {
            dropZone.classList.remove('active-zone');
            dropZone.classList.remove('over-zone');
        }
    }
}
