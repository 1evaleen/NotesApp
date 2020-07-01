/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

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
const currentNote = document.querySelector('.curr-note');
console.log(currentNote);
init();

function init() {
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

function selectCategory(evt) {
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

function selectNote(evt) {
  if (evt.target.parentElement.nodeName != 'LI') {
    return;
  }

  let id = evt.target.parentElement.dataset.id;
  let selectedNote = document.querySelector('.curr-note');

  if (selectedNote) {
    selectedNote.classList.remove('curr-note');
  }

  evt.target.parentElement.classList.add('curr-note');
  renderNoteEditor(notes, id);
}

function buildCategoryListItem(catName, id, isSelected) {
  let catEl = document.createElement('li');
  let catTxt = document.createTextNode(catName);
  catEl.className = 'categories__list__item';
  catEl.classList.add('drop-zone');
  isSelected && catEl.classList.add('curr-cat');
  catEl.dataset.id = id;
  catEl.appendChild(catTxt);
  return catEl;
}

function buildNoteListItem(data, catId, isSelected) {
  let noteEl = document.createElement('li');
  let noteTitleEl = document.createElement('div');
  let noteTitleTxt = document.createTextNode(data.title);
  let noteBodyEl = document.createElement('div');
  let noteBodyTxt = document.createTextNode(data.body);
  noteEl.className = 'notes__list__item';
  noteEl.classList.add('draggable');
  noteTitleEl.className = 'notes__list__item__title';
  noteBodyEl.className = 'notes__list__item__body';
  isSelected && noteEl.classList.add('curr-note');
  noteEl.dataset.id = data.id;
  noteEl.dataset.catId = catId;
  noteEl.appendChild(noteTitleEl);
  noteTitleEl.appendChild(noteTitleTxt);
  noteEl.appendChild(noteBodyEl);
  noteBodyEl.appendChild(noteBodyTxt);
  return noteEl;
}

function buildNoteEditor(note) {
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

function renderCategoryListItems(categories) {
  categories.forEach((c, index) => {
    if (index === 0) {
      categoriesEl.appendChild(buildCategoryListItem(c.name, c.id, true));
    } else {
      categoriesEl.appendChild(buildCategoryListItem(c.name, c.id));
    }
  });
}

function renderNoteListItems(notes, catId) {
  notesListEl.innerHTML = '';
  const catNotes = notes.filter(n => n.category_id === catId);
  catNotes.forEach((n, i) => {
    if (i == 0) {
      notesListEl.appendChild(buildNoteListItem(n, catId, true));
    } else {
      notesListEl.appendChild(buildNoteListItem(n, catId));
    }
  });
}

function renderNoteEditor(notes, noteId) {
  noteEditorEl.innerHTML = '';

  for (let i = 0; i < notes.length; i++) {
    if (noteId === notes[i].id) {
      noteEditorEl.appendChild(buildNoteEditor(notes[i]));
    }
  }

  ;
}

function createNewNote() {
  noteEditorEl.innerHTML = '';
  let newNote = {
    id: generateRandomId(),
    title: 'new note title',
    body: 'new note body',
    category_id: currentCat
  };
  notes.unshift(newNote);
  renderNoteListItems(notes, currentCat);
  renderNoteEditor(notes, newNote.id);
  persistData();
}

function onClickDelete(evt) {
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

function deleteNote(notes, id) {
  return notes.filter(n => n.id != id);
}

function deleteNoteFromDom(id) {
  let noteListItem = document.querySelector(`.notes__list__item[data-id="${id}"]`);
  noteListItem.remove();
  noteEditorEl.innerHTML = '';
}

function onInputSaveNoteTitle(evt) {
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

function updateCurrentNotesListItemTitle(val) {
  let title = document.querySelector('.curr-note .notes__list__item__title');
  title.innerText = val;
}

function onInputSaveNoteBody(evt) {
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

function updateCurrentNotesListItemBody(val) {
  let body = document.querySelector('.curr-note .notes__list__item__body');
  body.innerText = val;
}

function displayFirstNoteInNoteEditor(notes, catId) {
  catId = currentCat;
  let firstNote = notes.filter(n => n.category_id === catId);

  if (notesListEl.innerHTML === '') {
    return;
  } else {
    renderNoteEditor(notes, firstNote[0].id);
  }
}

function highlightFirstNoteItem() {
  notesListEl.children[0] && notesListEl.children[0].classList.add('curr-note');
}

function searchCurrNotes(evt) {
  let currNotes = notes.filter(n => n.category_id === currentCat);
  let searchRes = currNotes.filter(n => n.title.includes(evt.target.value));
  renderNoteListItems(searchRes, currentCat);
}

function initDragAndDrop() {
  let draggables = document.querySelectorAll('.draggable');
  let dropZones = document.querySelectorAll('.drop-zone');
  initDraggables(draggables);
  initDropZones(dropZones);
}

function initDraggables(draggables) {
  for (const draggable of draggables) {
    initDraggable(draggable);
  }
}

function initDropZones(dropZones) {
  for (const dropZone of dropZones) {
    initDropZone(dropZone);
  }
}

function initDraggable(draggable) {
  draggable.addEventListener('dragstart', dragstartHandler);
  draggable.addEventListener('dragend', dragEndHandler);
  draggable.setAttribute('draggable', 'true');
}

function initDropZone(dropZone) {
  dropZone.addEventListener('dragenter', dropZoneEnterHandler);
  dropZone.addEventListener('dragover', dropZoneOverHandler);
  dropZone.addEventListener('dragleave', dropZoneLeaveHandler);
  dropZone.addEventListener('drop', dropZoneDropHandler);
}

function dragstartHandler(evt) {
  setDropZonesHighlight();
  this.classList.add('dragged');
  evt.dataTransfer.setData('type', 'dragged');
  evt.dataTransfer.setData('noteId', evt.target.dataset.id);
  evt.dataTransfer.setData('catId', evt.target.dataset.catId);
}

function dragEndHandler(evt) {
  setDropZonesHighlight(false);
}

function dropZoneEnterHandler(evt) {
  if (evt.dataTransfer.types.includes('type')) {
    this.classList.add('over-zone');
  }

  evt.preventDefault();
}

function dropZoneOverHandler(evt) {
  evt.preventDefault();
}

function dropZoneLeaveHandler(evt) {
  if (evt.dataTransfer.types.includes('type') && evt.relatedTarget !== null && evt.currentTarget !== evt.relatedTarget.closest('.drop-zone')) {
    this.classList.remove('over-zone');
  }
}

function dropZoneDropHandler(evt) {
  let selectedCatId = evt.currentTarget.dataset.id;
  let draggedItem = document.querySelector('.dragged');
  let draggedElCatId = evt.dataTransfer.getData('catId');
  let draggedElNoteId = evt.dataTransfer.getData('noteId');

  if (selectedCatId === draggedElCatId) {
    draggedItem.classList.remove('dragged');
    return;
  } else {
    onDropChangeNoteCat(selectedCatId, draggedElNoteId);
    onDropDelFromCurrNoteList(draggedElNoteId, draggedElCatId);
  }

  evt.preventDefault();
}

function onDropChangeNoteCat(catId, noteId) {
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].id === noteId) {
      notes[i].category_id = catId;
    }
  }

  persistData();
}

function onDropDelFromCurrNoteList(noteId, catId) {
  let draggedNote = document.querySelector(`.notes__list__item[data-id="${noteId}"]`);
  draggedNote.remove();
  highlightFirstNoteItem();
  displayFirstNoteInNoteEditor(notes, catId);
}

function setDropZonesHighlight(highlight = true) {
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

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIm5vdGVzIiwiY2F0ZWdvcmllc0VsIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibm90ZXNFbCIsIm5vdGVzTGlzdEVsIiwibm90ZUVkaXRvckVsIiwiYWRkTmV3Tm90ZUJ0biIsImRlbE5vdGVCdG4iLCJzZWFyY2hJbnB1dCIsImNhdE1lbnUiLCJjdXJyZW50Q2F0IiwiY2F0ZWdvcmllcyIsImlkIiwiY3VycmVudE5vdGUiLCJjb25zb2xlIiwibG9nIiwiaW5pdCIsImluaXRTdG9yYWdlIiwicmVuZGVyQ2F0ZWdvcnlMaXN0SXRlbXMiLCJyZW5kZXJOb3RlTGlzdEl0ZW1zIiwiZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvciIsImluaXREcmFnQW5kRHJvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZWxlY3RDYXRlZ29yeSIsInNlbGVjdE5vdGUiLCJjcmVhdGVOZXdOb3RlIiwib25DbGlja0RlbGV0ZSIsInNlYXJjaEN1cnJOb3RlcyIsImV2dCIsInRhcmdldCIsIm5vZGVOYW1lIiwic2VsZWN0ZWRDYXRJZCIsImRhdGFzZXQiLCJzZWxlY3RlZENhdCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsImlubmVySFRNTCIsInBhcmVudEVsZW1lbnQiLCJzZWxlY3RlZE5vdGUiLCJyZW5kZXJOb3RlRWRpdG9yIiwiYnVpbGRDYXRlZ29yeUxpc3RJdGVtIiwiY2F0TmFtZSIsImlzU2VsZWN0ZWQiLCJjYXRFbCIsImNyZWF0ZUVsZW1lbnQiLCJjYXRUeHQiLCJjcmVhdGVUZXh0Tm9kZSIsImNsYXNzTmFtZSIsImFwcGVuZENoaWxkIiwiYnVpbGROb3RlTGlzdEl0ZW0iLCJkYXRhIiwiY2F0SWQiLCJub3RlRWwiLCJub3RlVGl0bGVFbCIsIm5vdGVUaXRsZVR4dCIsInRpdGxlIiwibm90ZUJvZHlFbCIsIm5vdGVCb2R5VHh0IiwiYm9keSIsImJ1aWxkTm90ZUVkaXRvciIsIm5vdGUiLCJlZENvbnRGcmFnIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImVkVGl0bGVFbCIsInZhbHVlIiwiZWRCb2R5RWwiLCJvbklucHV0U2F2ZU5vdGVUaXRsZSIsIm9uSW5wdXRTYXZlTm90ZUJvZHkiLCJmb3JFYWNoIiwiYyIsImluZGV4IiwibmFtZSIsImNhdE5vdGVzIiwiZmlsdGVyIiwibiIsImNhdGVnb3J5X2lkIiwiaSIsIm5vdGVJZCIsImxlbmd0aCIsIm5ld05vdGUiLCJnZW5lcmF0ZVJhbmRvbUlkIiwidW5zaGlmdCIsInBlcnNpc3REYXRhIiwiZGVsZXRlTm90ZSIsImRlbGV0ZU5vdGVGcm9tRG9tIiwiaGlnaGxpZ2h0Rmlyc3ROb3RlSXRlbSIsIm5vdGVMaXN0SXRlbSIsIm5ld1RpdGxlIiwibm90ZUlEIiwidXBkYXRlQ3VycmVudE5vdGVzTGlzdEl0ZW1UaXRsZSIsInZhbCIsImlubmVyVGV4dCIsIm5ld0JvZHkiLCJ1cGRhdGVDdXJyZW50Tm90ZXNMaXN0SXRlbUJvZHkiLCJmaXJzdE5vdGUiLCJjaGlsZHJlbiIsImN1cnJOb3RlcyIsInNlYXJjaFJlcyIsImluY2x1ZGVzIiwiZHJhZ2dhYmxlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJkcm9wWm9uZXMiLCJpbml0RHJhZ2dhYmxlcyIsImluaXREcm9wWm9uZXMiLCJkcmFnZ2FibGUiLCJpbml0RHJhZ2dhYmxlIiwiZHJvcFpvbmUiLCJpbml0RHJvcFpvbmUiLCJkcmFnc3RhcnRIYW5kbGVyIiwiZHJhZ0VuZEhhbmRsZXIiLCJzZXRBdHRyaWJ1dGUiLCJkcm9wWm9uZUVudGVySGFuZGxlciIsImRyb3Bab25lT3ZlckhhbmRsZXIiLCJkcm9wWm9uZUxlYXZlSGFuZGxlciIsImRyb3Bab25lRHJvcEhhbmRsZXIiLCJzZXREcm9wWm9uZXNIaWdobGlnaHQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwidHlwZXMiLCJwcmV2ZW50RGVmYXVsdCIsInJlbGF0ZWRUYXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwiY2xvc2VzdCIsImRyYWdnZWRJdGVtIiwiZHJhZ2dlZEVsQ2F0SWQiLCJnZXREYXRhIiwiZHJhZ2dlZEVsTm90ZUlkIiwib25Ecm9wQ2hhbmdlTm90ZUNhdCIsIm9uRHJvcERlbEZyb21DdXJyTm90ZUxpc3QiLCJkcmFnZ2VkTm90ZSIsImhpZ2hsaWdodCJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFFQSxJQUFJQSxLQUFLLEdBQUcsRUFBWjtBQUNBLE1BQU1DLFlBQVksR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLG1CQUF2QixDQUFyQjtBQUNBLE1BQU1DLE9BQU8sR0FBR0YsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBQWhCO0FBQ0EsTUFBTUUsV0FBVyxHQUFHSCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBcEI7QUFDQSxNQUFNRyxZQUFZLEdBQUdKLFFBQVEsQ0FBQ0MsYUFB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LHFCQUFULENBQWdDZSxTQUFTLEdBQUcsSUFBNUMsRUFBa0Q7QUFDOUMsUUFBTTdCLFNBQVMsR0FBR3JHLFFBQVEsQ0FBQ29HLGdCQUFULENBQTBCLFlBQTFCLENBQWxCOztBQUNBLE9BQUssTUFBTU0sUUFBWCxJQUF1QkwsU0FBdkIsRUFBa0M7QUFDOUIsUUFBSTZCLFNBQUosRUFBZTtBQUNYeEIsY0FBUSxDQUFDekUsU0FBVCxDQUFtQkUsR0FBbkIsQ0FBdUIsYUFBdkI7QUFDSCxLQUZELE1BRU87QUFDSHVFLGNBQVEsQ0FBQ3pFLFNBQVQsQ0FBbUJDLE1BQW5CLENBQTBCLGFBQTFCO0FBQ0F3RSxjQUFRLENBQUN6RSxTQUFULENBQW1CQyxNQUFuQixDQUEwQixXQUExQjtBQUNIO0FBQ0o7QUFDSixDIiwiZmlsZSI6ImFwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIi8vIGltcG9ydCAnLi9kcmFnRHJvcCc7XHJcbi8vIGltcG9ydCBjYXRlZ29yaWVzIGZyb20gJy4vcHVibGljL2RhdGEuanMnO1xyXG5cclxubGV0IG5vdGVzID0gW107XHJcbmNvbnN0IGNhdGVnb3JpZXNFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzX19saXN0Jyk7XHJcbmNvbnN0IG5vdGVzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90ZXMnKTtcclxuY29uc3Qgbm90ZXNMaXN0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90ZXNfX2xpc3QnKTtcclxuY29uc3Qgbm90ZUVkaXRvckVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXRvcicpO1xyXG5jb25zdCBhZGROZXdOb3RlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVzX19hZGQtbmV3LW5vdGUtYnRuJyk7XHJcbmNvbnN0IGRlbE5vdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWJ0bicpO1xyXG5jb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub3Rlc19fc2VhcmNoX19pbnB1dCcpO1xyXG5jb25zdCBjYXRNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXNfX21lbnUtYnRuJyk7XHJcbmxldCBjdXJyZW50Q2F0ID0gY2F0ZWdvcmllc1swXS5pZDtcclxuY29uc3QgY3VycmVudE5vdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3Vyci1ub3RlJyk7XHJcbmNvbnNvbGUubG9nKGN1cnJlbnROb3RlKTtcclxuXHJcbmluaXQoKTtcclxuXHJcbmZ1bmN0aW9uIGluaXQgKCkge1xyXG4gICAgaW5pdFN0b3JhZ2UoKTtcclxuICAgIHJlbmRlckNhdGVnb3J5TGlzdEl0ZW1zKGNhdGVnb3JpZXMsIGN1cnJlbnRDYXQpO1xyXG4gICAgcmVuZGVyTm90ZUxpc3RJdGVtcyhub3RlcywgY3VycmVudENhdCk7XHJcbiAgICBkaXNwbGF5Rmlyc3ROb3RlSW5Ob3RlRWRpdG9yKG5vdGVzLCBjdXJyZW50Q2F0KTtcclxuICAgIGluaXREcmFnQW5kRHJvcCgpO1xyXG4gICAgY2F0ZWdvcmllc0VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZWN0Q2F0ZWdvcnkpO1xyXG4gICAgbm90ZXNMaXN0RWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWxlY3ROb3RlKTtcclxuICAgIGFkZE5ld05vdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjcmVhdGVOZXdOb3RlKTtcclxuICAgIGRlbE5vdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrRGVsZXRlKTtcclxuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0Jywgc2VhcmNoQ3Vyck5vdGVzKTtcclxufVxyXG5mdW5jdGlvbiBzZWxlY3RDYXRlZ29yeSAoZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LnRhcmdldC5ub2RlTmFtZSAhPSAnTEknKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHNlbGVjdGVkQ2F0SWQgPSBldnQudGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICBsZXQgc2VsZWN0ZWRDYXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3Vyci1jYXQnKTtcclxuICAgIGlmIChzZWxlY3RlZENhdCkge1xyXG4gICAgICAgIHNlbGVjdGVkQ2F0LmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnItY2F0Jyk7XHJcbiAgICB9XHJcbiAgICBjdXJyZW50Q2F0ID0gc2VsZWN0ZWRDYXRJZDtcclxuICAgIGV2dC50YXJnZXQuY2xhc3NMaXN0LmFkZCgnY3Vyci1jYXQnKTtcclxuICAgIHJlbmRlck5vdGVMaXN0SXRlbXMobm90ZXMsIHNlbGVjdGVkQ2F0SWQpO1xyXG4gICAgbm90ZUVkaXRvckVsLmlubmVySFRNTCA9ICcnO1xyXG4gICAgZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvcihub3RlcywgY3VycmVudENhdCk7XHJcbiAgICBpbml0RHJhZ0FuZERyb3AoKTtcclxufVxyXG5mdW5jdGlvbiBzZWxlY3ROb3RlIChldnQpIHtcclxuICAgIGlmIChldnQudGFyZ2V0LnBhcmVudEVsZW1lbnQubm9kZU5hbWUgIT0gJ0xJJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBpZCA9IGV2dC50YXJnZXQucGFyZW50RWxlbWVudC5kYXRhc2V0LmlkO1xyXG4gICAgbGV0IHNlbGVjdGVkTm90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyLW5vdGUnKTtcclxuICAgIGlmIChzZWxlY3RlZE5vdGUpIHtcclxuICAgICAgICBzZWxlY3RlZE5vdGUuY2xhc3NMaXN0LnJlbW92ZSgnY3Vyci1ub3RlJyk7XHJcbiAgICB9XHJcbiAgICBldnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY3Vyci1ub3RlJylcclxuICAgIHJlbmRlck5vdGVFZGl0b3Iobm90ZXMsIGlkKTtcclxufVxyXG5mdW5jdGlvbiBidWlsZENhdGVnb3J5TGlzdEl0ZW0gKGNhdE5hbWUsIGlkLCBpc1NlbGVjdGVkKSB7XHJcbiAgICBsZXQgY2F0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgbGV0IGNhdFR4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNhdE5hbWUpO1xyXG4gICAgY2F0RWwuY2xhc3NOYW1lID0gJ2NhdGVnb3JpZXNfX2xpc3RfX2l0ZW0nO1xyXG4gICAgY2F0RWwuY2xhc3NMaXN0LmFkZCgnZHJvcC16b25lJylcclxuICAgIGlzU2VsZWN0ZWQgJiYgY2F0RWwuY2xhc3NMaXN0LmFkZCgnY3Vyci1jYXQnKTtcclxuICAgIGNhdEVsLmRhdGFzZXQuaWQgPSBpZDtcclxuICAgIGNhdEVsLmFwcGVuZENoaWxkKGNhdFR4dCk7XHJcbiAgICByZXR1cm4gY2F0RWw7XHJcbn1cclxuZnVuY3Rpb24gYnVpbGROb3RlTGlzdEl0ZW0gKGRhdGEsIGNhdElkLCBpc1NlbGVjdGVkKSB7XHJcbiAgICBsZXQgbm90ZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgIGxldCBub3RlVGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbGV0IG5vdGVUaXRsZVR4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEudGl0bGUpO1xyXG4gICAgbGV0IG5vdGVCb2R5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGxldCBub3RlQm9keVR4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEuYm9keSk7XHJcbiAgICBub3RlRWwuY2xhc3NOYW1lID0gJ25vdGVzX19saXN0X19pdGVtJztcclxuICAgIG5vdGVFbC5jbGFzc0xpc3QuYWRkKCdkcmFnZ2FibGUnKTtcclxuICAgIG5vdGVUaXRsZUVsLmNsYXNzTmFtZSA9ICdub3Rlc19fbGlzdF9faXRlbV9fdGl0bGUnO1xyXG4gICAgbm90ZUJvZHlFbC5jbGFzc05hbWUgPSAnbm90ZXNfX2xpc3RfX2l0ZW1fX2JvZHknO1xyXG4gICAgaXNTZWxlY3RlZCAmJiBub3RlRWwuY2xhc3NMaXN0LmFkZCgnY3Vyci1ub3RlJyk7XHJcbiAgICBub3RlRWwuZGF0YXNldC5pZCA9IGRhdGEuaWQ7XHJcbiAgICBub3RlRWwuZGF0YXNldC5jYXRJZCA9IGNhdElkO1xyXG4gICAgbm90ZUVsLmFwcGVuZENoaWxkKG5vdGVUaXRsZUVsKTtcclxuICAgIG5vdGVUaXRsZUVsLmFwcGVuZENoaWxkKG5vdGVUaXRsZVR4dCk7XHJcbiAgICBub3RlRWwuYXBwZW5kQ2hpbGQobm90ZUJvZHlFbCk7XHJcbiAgICBub3RlQm9keUVsLmFwcGVuZENoaWxkKG5vdGVCb2R5VHh0KTtcclxuICAgIHJldHVybiBub3RlRWw7XHJcbn1cclxuZnVuY3Rpb24gYnVpbGROb3RlRWRpdG9yIChub3RlKSB7XHJcbiAgICBsZXQgZWRDb250RnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoJ2RpdicpO1xyXG4gICAgbGV0IGVkVGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICBlZFRpdGxlRWwudmFsdWUgPSBub3RlLnRpdGxlO1xyXG4gICAgbGV0IGVkQm9keUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcclxuICAgIGVkQm9keUVsLnZhbHVlID0gbm90ZS5ib2R5O1xyXG4gICAgZWRUaXRsZUVsLmNsYXNzTmFtZSA9ICdlZGl0b3JfX3RpdGxlJztcclxuICAgIGVkQm9keUVsLmNsYXNzTmFtZSA9ICdlZGl0b3JfX2JvZHknO1xyXG4gICAgZWRUaXRsZUVsLmRhdGFzZXQuaWQgPSBub3RlLmlkO1xyXG4gICAgZWRCb2R5RWwuZGF0YXNldC5pZCA9IG5vdGUuaWQ7XHJcbiAgICBlZENvbnRGcmFnLmFwcGVuZENoaWxkKGVkVGl0bGVFbCk7XHJcbiAgICBlZENvbnRGcmFnLmFwcGVuZENoaWxkKGVkQm9keUVsKTtcclxuICAgIGVkVGl0bGVFbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9uSW5wdXRTYXZlTm90ZVRpdGxlKTtcclxuICAgIGVkQm9keUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0Jywgb25JbnB1dFNhdmVOb3RlQm9keSk7XHJcbiAgICByZXR1cm4gZWRDb250RnJhZztcclxufVxyXG5mdW5jdGlvbiByZW5kZXJDYXRlZ29yeUxpc3RJdGVtcyAoY2F0ZWdvcmllcykge1xyXG4gICAgY2F0ZWdvcmllcy5mb3JFYWNoKChjLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXNFbC5hcHBlbmRDaGlsZChidWlsZENhdGVnb3J5TGlzdEl0ZW0oYy5uYW1lLCBjLmlkLCB0cnVlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2F0ZWdvcmllc0VsLmFwcGVuZENoaWxkKGJ1aWxkQ2F0ZWdvcnlMaXN0SXRlbShjLm5hbWUsIGMuaWQpKVxyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyTm90ZUxpc3RJdGVtcyAobm90ZXMsIGNhdElkKSB7XHJcbiAgICBub3Rlc0xpc3RFbC5pbm5lckhUTUwgPSAnJztcclxuICAgIGNvbnN0IGNhdE5vdGVzID0gbm90ZXMuZmlsdGVyKG4gPT4gbi5jYXRlZ29yeV9pZCA9PT0gY2F0SWQpO1xyXG4gICAgY2F0Tm90ZXMuZm9yRWFjaCgobiwgaSkgPT4ge1xyXG4gICAgICAgIGlmKGkgPT0gMCkge1xyXG4gICAgICAgICAgICBub3Rlc0xpc3RFbC5hcHBlbmRDaGlsZChidWlsZE5vdGVMaXN0SXRlbShuLCBjYXRJZCwgdHJ1ZSkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm90ZXNMaXN0RWwuYXBwZW5kQ2hpbGQoYnVpbGROb3RlTGlzdEl0ZW0obiwgY2F0SWQpKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlck5vdGVFZGl0b3IgKG5vdGVzLCBub3RlSWQpIHtcclxuICAgIG5vdGVFZGl0b3JFbC5pbm5lckhUTUwgPSAnJztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm90ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobm90ZUlkID09PSBub3Rlc1tpXS5pZCkge1xyXG4gICAgICAgICAgICBub3RlRWRpdG9yRWwuYXBwZW5kQ2hpbGQoYnVpbGROb3RlRWRpdG9yKG5vdGVzW2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVOZXdOb3RlICgpIHtcclxuICAgIG5vdGVFZGl0b3JFbC5pbm5lckhUTUwgPSAnJztcclxuICAgIGxldCBuZXdOb3RlID0ge1xyXG4gICAgICAgIGlkOiBnZW5lcmF0ZVJhbmRvbUlkKCksXHJcbiAgICAgICAgdGl0bGU6ICduZXcgbm90ZSB0aXRsZScsXHJcbiAgICAgICAgYm9keTogJ25ldyBub3RlIGJvZHknLFxyXG4gICAgICAgIGNhdGVnb3J5X2lkOiBjdXJyZW50Q2F0XHJcbiAgICB9XHJcbiAgICBub3Rlcy51bnNoaWZ0KG5ld05vdGUpO1xyXG4gICAgcmVuZGVyTm90ZUxpc3RJdGVtcyhub3RlcywgY3VycmVudENhdCk7XHJcbiAgICByZW5kZXJOb3RlRWRpdG9yKG5vdGVzLCBuZXdOb3RlLmlkKTtcclxuICAgIHBlcnNpc3REYXRhKCk7XHJcbn1cclxuZnVuY3Rpb24gb25DbGlja0RlbGV0ZSAoZXZ0KSB7XHJcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0b3JfX3RpdGxlJyk7XHJcbiAgICBjb25zdCBpZCA9IHRpdGxlLmRhdGFzZXQuaWQ7XHJcbiAgICBub3RlcyA9IGRlbGV0ZU5vdGUobm90ZXMsIGlkKTtcclxuICAgIGRlbGV0ZU5vdGVGcm9tRG9tKGlkKTtcclxuICAgIGhpZ2hsaWdodEZpcnN0Tm90ZUl0ZW0oKTtcclxuICAgIHBlcnNpc3REYXRhKCk7XHJcbiAgICBpZiAobm90ZXNMaXN0RWwuaW5uZXJIVE1MID09PSAnJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvcihub3RlcywgY3VycmVudENhdCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZGVsZXRlTm90ZSAobm90ZXMsIGlkKSB7XHJcbiAgICByZXR1cm4gbm90ZXMuZmlsdGVyKG4gPT4gbi5pZCAhPSBpZCk7XHJcbn1cclxuZnVuY3Rpb24gZGVsZXRlTm90ZUZyb21Eb20gKGlkKSB7XHJcbiAgICBsZXQgbm90ZUxpc3RJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLm5vdGVzX19saXN0X19pdGVtW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG4gICAgbm90ZUxpc3RJdGVtLnJlbW92ZSgpO1xyXG4gICAgbm90ZUVkaXRvckVsLmlubmVySFRNTCA9ICcnO1xyXG59XHJcbmZ1bmN0aW9uIG9uSW5wdXRTYXZlTm90ZVRpdGxlIChldnQpIHtcclxuICAgIGxldCBuZXdUaXRsZSA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICBsZXQgbm90ZUlEID0gZXZ0LnRhcmdldC5kYXRhc2V0LmlkO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub3Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChub3Rlc1tpXS5pZCA9PT0gbm90ZUlEKSB7XHJcbiAgICAgICAgICAgIG5vdGVzW2ldLnRpdGxlID0gbmV3VGl0bGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGVyc2lzdERhdGEoKTtcclxuICAgIHVwZGF0ZUN1cnJlbnROb3Rlc0xpc3RJdGVtVGl0bGUobmV3VGl0bGUpO1xyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnROb3Rlc0xpc3RJdGVtVGl0bGUgKHZhbCkge1xyXG4gICAgbGV0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnItbm90ZSAubm90ZXNfX2xpc3RfX2l0ZW1fX3RpdGxlJyk7XHJcbiAgICB0aXRsZS5pbm5lclRleHQgPSB2YWw7XHJcbn1cclxuZnVuY3Rpb24gb25JbnB1dFNhdmVOb3RlQm9keSAoZXZ0KSB7XHJcbiAgICBsZXQgbmV3Qm9keSA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICBsZXQgbm90ZUlEID0gZXZ0LnRhcmdldC5kYXRhc2V0LmlkO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub3Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChub3Rlc1tpXS5pZCA9PT0gbm90ZUlEKSB7XHJcbiAgICAgICAgICAgIG5vdGVzW2ldLmJvZHkgPSBuZXdCb2R5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBlcnNpc3REYXRhKCk7XHJcbiAgICB1cGRhdGVDdXJyZW50Tm90ZXNMaXN0SXRlbUJvZHkobmV3Qm9keSk7XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQ3VycmVudE5vdGVzTGlzdEl0ZW1Cb2R5ICh2YWwpIHtcclxuICAgIGxldCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnItbm90ZSAubm90ZXNfX2xpc3RfX2l0ZW1fX2JvZHknKTtcclxuICAgIGJvZHkuaW5uZXJUZXh0ID0gdmFsO1xyXG59XHJcbmZ1bmN0aW9uIGRpc3BsYXlGaXJzdE5vdGVJbk5vdGVFZGl0b3IgKG5vdGVzLCBjYXRJZCkge1xyXG4gICAgY2F0SWQgPSBjdXJyZW50Q2F0O1xyXG4gICAgbGV0IGZpcnN0Tm90ZSA9IG5vdGVzLmZpbHRlcihuID0+IChuLmNhdGVnb3J5X2lkID09PSBjYXRJZCkpO1xyXG4gICAgaWYgKG5vdGVzTGlzdEVsLmlubmVySFRNTCA9PT0gJycpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgcmVuZGVyTm90ZUVkaXRvcihub3RlcywgZmlyc3ROb3RlWzBdLmlkKVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGhpZ2hsaWdodEZpcnN0Tm90ZUl0ZW0gKCkge1xyXG4gICAgbm90ZXNMaXN0RWwuY2hpbGRyZW5bMF0gJiYgbm90ZXNMaXN0RWwuY2hpbGRyZW5bMF0uY2xhc3NMaXN0LmFkZCgnY3Vyci1ub3RlJyk7XHJcbn1cclxuZnVuY3Rpb24gc2VhcmNoQ3Vyck5vdGVzIChldnQpIHtcclxuICAgIGxldCBjdXJyTm90ZXMgPSBub3Rlcy5maWx0ZXIobiA9PiBuLmNhdGVnb3J5X2lkID09PSBjdXJyZW50Q2F0KTtcclxuICAgIGxldCBzZWFyY2hSZXMgPSBjdXJyTm90ZXMuZmlsdGVyKG4gPT4gbi50aXRsZS5pbmNsdWRlcyhldnQudGFyZ2V0LnZhbHVlKSk7XHJcbiAgICByZW5kZXJOb3RlTGlzdEl0ZW1zKHNlYXJjaFJlcywgY3VycmVudENhdCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0RHJhZ0FuZERyb3AgKCkge1xyXG4gICAgbGV0IGRyYWdnYWJsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJhZ2dhYmxlJyk7XHJcbiAgICBsZXQgZHJvcFpvbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Atem9uZScpO1xyXG4gICAgaW5pdERyYWdnYWJsZXMoZHJhZ2dhYmxlcyk7XHJcbiAgICBpbml0RHJvcFpvbmVzKGRyb3Bab25lcyk7XHJcbn1cclxuZnVuY3Rpb24gaW5pdERyYWdnYWJsZXMgKGRyYWdnYWJsZXMpIHtcclxuICAgIGZvciAoY29uc3QgZHJhZ2dhYmxlIG9mIGRyYWdnYWJsZXMpIHtcclxuICAgICAgICBpbml0RHJhZ2dhYmxlKGRyYWdnYWJsZSlcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbml0RHJvcFpvbmVzIChkcm9wWm9uZXMpIHtcclxuICAgIGZvciAoY29uc3QgZHJvcFpvbmUgb2YgZHJvcFpvbmVzKSB7XHJcbiAgICAgICAgaW5pdERyb3Bab25lKGRyb3Bab25lKVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGluaXREcmFnZ2FibGUgKGRyYWdnYWJsZSkge1xyXG4gICAgZHJhZ2dhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGRyYWdzdGFydEhhbmRsZXIpO1xyXG4gICAgZHJhZ2dhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCBkcmFnRW5kSGFuZGxlcik7XHJcbiAgICBkcmFnZ2FibGUuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCAndHJ1ZScpO1xyXG59XHJcbmZ1bmN0aW9uIGluaXREcm9wWm9uZSAoZHJvcFpvbmUpIHtcclxuICAgIGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGRyb3Bab25lRW50ZXJIYW5kbGVyKTtcclxuICAgIGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZHJvcFpvbmVPdmVySGFuZGxlcik7XHJcbiAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBkcm9wWm9uZUxlYXZlSGFuZGxlcik7XHJcbiAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZHJvcFpvbmVEcm9wSGFuZGxlcik7XHJcbn1cclxuZnVuY3Rpb24gZHJhZ3N0YXJ0SGFuZGxlcihldnQpIHtcclxuICAgIHNldERyb3Bab25lc0hpZ2hsaWdodCgpO1xyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdkcmFnZ2VkJyk7XHJcbiAgICBldnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3R5cGUnLCAnZHJhZ2dlZCcpO1xyXG4gICAgZXZ0LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdub3RlSWQnLCBldnQudGFyZ2V0LmRhdGFzZXQuaWQpO1xyXG4gICAgZXZ0LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdjYXRJZCcsIGV2dC50YXJnZXQuZGF0YXNldC5jYXRJZCk7XHJcbn1cclxuZnVuY3Rpb24gZHJhZ0VuZEhhbmRsZXIgKGV2dCkge1xyXG4gICAgc2V0RHJvcFpvbmVzSGlnaGxpZ2h0KGZhbHNlKTtcclxufVxyXG5mdW5jdGlvbiBkcm9wWm9uZUVudGVySGFuZGxlcihldnQpIHtcclxuICAgIGlmIChldnQuZGF0YVRyYW5zZmVyLnR5cGVzLmluY2x1ZGVzKCd0eXBlJykpIHtcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ292ZXItem9uZScpO1xyXG4gICAgfVxyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbn1cclxuZnVuY3Rpb24gZHJvcFpvbmVPdmVySGFuZGxlciAoZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxufVxyXG5mdW5jdGlvbiBkcm9wWm9uZUxlYXZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LmRhdGFUcmFuc2Zlci50eXBlcy5pbmNsdWRlcygndHlwZScpICYmXHJcbiAgICAgICAgZXZ0LnJlbGF0ZWRUYXJnZXQgIT09IG51bGwgJiZcclxuICAgICAgICBldnQuY3VycmVudFRhcmdldCAhPT0gZXZ0LnJlbGF0ZWRUYXJnZXQuY2xvc2VzdCgnLmRyb3Atem9uZScpKSB7XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdvdmVyLXpvbmUnKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBkcm9wWm9uZURyb3BIYW5kbGVyIChldnQpIHtcclxuICAgIGxldCBzZWxlY3RlZENhdElkID0gZXZ0LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuICAgIGxldCBkcmFnZ2VkSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcmFnZ2VkJylcclxuICAgIGxldCBkcmFnZ2VkRWxDYXRJZCA9IGV2dC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnY2F0SWQnKTtcclxuICAgIGxldCBkcmFnZ2VkRWxOb3RlSWQgPSBldnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ25vdGVJZCcpO1xyXG4gICAgaWYgKHNlbGVjdGVkQ2F0SWQgPT09IGRyYWdnZWRFbENhdElkKSB7XHJcbiAgICAgICAgZHJhZ2dlZEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dlZCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb25Ecm9wQ2hhbmdlTm90ZUNhdChzZWxlY3RlZENhdElkLCBkcmFnZ2VkRWxOb3RlSWQpO1xyXG4gICAgICAgIG9uRHJvcERlbEZyb21DdXJyTm90ZUxpc3QoZHJhZ2dlZEVsTm90ZUlkLCBkcmFnZ2VkRWxDYXRJZCk7XHJcbiAgICB9XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxufVxyXG5mdW5jdGlvbiBvbkRyb3BDaGFuZ2VOb3RlQ2F0IChjYXRJZCwgbm90ZUlkKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vdGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG5vdGVzW2ldLmlkID09PSBub3RlSWQpIHtcclxuICAgICAgICAgICAgbm90ZXNbaV0uY2F0ZWdvcnlfaWQgPSBjYXRJZFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBlcnNpc3REYXRhKCk7XHJcbn1cclxuZnVuY3Rpb24gb25Ecm9wRGVsRnJvbUN1cnJOb3RlTGlzdCAobm90ZUlkLCBjYXRJZCkge1xyXG4gICAgbGV0IGRyYWdnZWROb3RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLm5vdGVzX19saXN0X19pdGVtW2RhdGEtaWQ9XCIke25vdGVJZH1cIl1gKTtcclxuICAgIGRyYWdnZWROb3RlLnJlbW92ZSgpO1xyXG4gICAgaGlnaGxpZ2h0Rmlyc3ROb3RlSXRlbSgpO1xyXG4gICAgZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvcihub3RlcywgY2F0SWQpXHJcbn1cclxuZnVuY3Rpb24gc2V0RHJvcFpvbmVzSGlnaGxpZ2h0IChoaWdobGlnaHQgPSB0cnVlKSB7XHJcbiAgICBjb25zdCBkcm9wWm9uZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcC16b25lJyk7XHJcbiAgICBmb3IgKGNvbnN0IGRyb3Bab25lIG9mIGRyb3Bab25lcykge1xyXG4gICAgICAgIGlmIChoaWdobGlnaHQpIHtcclxuICAgICAgICAgICAgZHJvcFpvbmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlLXpvbmUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkcm9wWm9uZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUtem9uZScpO1xyXG4gICAgICAgICAgICBkcm9wWm9uZS5jbGFzc0xpc3QucmVtb3ZlKCdvdmVyLXpvbmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==