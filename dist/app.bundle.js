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
  let selectedNote = document.querySelector('.selected');

  if (selectedNote) {
    selectedNote.classList.remove('selected');
  }

  evt.target.parentElement.classList.add('selected');
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
  isSelected && noteEl.classList.add('selected');
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
  let title = document.querySelector('.selected .notes__list__item__title');
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
  let body = document.querySelector('.selected .notes__list__item__body');
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
  notesListEl.children[0] && notesListEl.children[0].classList.add('selected');
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
  draggable.addEventListener('dragstart', dragStartHandler);
  draggable.addEventListener('dragend', dragEndHandler);
  draggable.setAttribute('draggable', 'true');
}

function initDropZone(dropZone) {
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
    changeNoteCat(selectedCatId, draggedElNoteId);
    removeNoteNode(draggedElNoteId);
    checkSelection(draggedElCatId);
  }

  evt.preventDefault();
}

function checkSelection(catID) {
  let selectedNote = document.querySelector('.selected');

  if (!selectedNote) {
    highlightFirstNoteItem();
    displayFirstNoteInNoteEditor(notes, catID);
  }
}

function changeNoteCat(catId, noteId) {
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].id === noteId) {
      notes[i].category_id = catId;
    }
  }

  persistData();
}

function removeNoteNode(noteId) {
  let draggedNote = document.querySelector(`.notes__list__item[data-id="${noteId}"]`);
  draggedNote.remove();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIm5vdGVzIiwiY2F0ZWdvcmllc0VsIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibm90ZXNFbCIsIm5vdGVzTGlzdEVsIiwibm90ZUVkaXRvckVsIiwiYWRkTmV3Tm90ZUJ0biIsImRlbE5vdGVCdG4iLCJzZWFyY2hJbnB1dCIsImNhdE1lbnUiLCJjdXJyZW50Q2F0IiwiY2F0ZWdvcmllcyIsImlkIiwiaW5pdCIsImluaXRTdG9yYWdlIiwicmVuZGVyQ2F0ZWdvcnlMaXN0SXRlbXMiLCJyZW5kZXJOb3RlTGlzdEl0ZW1zIiwiZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvciIsImluaXREcmFnQW5kRHJvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZWxlY3RDYXRlZ29yeSIsInNlbGVjdE5vdGUiLCJjcmVhdGVOZXdOb3RlIiwib25DbGlja0RlbGV0ZSIsInNlYXJjaEN1cnJOb3RlcyIsImV2dCIsInRhcmdldCIsIm5vZGVOYW1lIiwic2VsZWN0ZWRDYXRJZCIsImRhdGFzZXQiLCJzZWxlY3RlZENhdCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsImlubmVySFRNTCIsInBhcmVudEVsZW1lbnQiLCJzZWxlY3RlZE5vdGUiLCJyZW5kZXJOb3RlRWRpdG9yIiwiYnVpbGRDYXRlZ29yeUxpc3RJdGVtIiwiY2F0TmFtZSIsImlzU2VsZWN0ZWQiLCJjYXRFbCIsImNyZWF0ZUVsZW1lbnQiLCJjYXRUeHQiLCJjcmVhdGVUZXh0Tm9kZSIsImNsYXNzTmFtZSIsImFwcGVuZENoaWxkIiwiYnVpbGROb3RlTGlzdEl0ZW0iLCJkYXRhIiwiY2F0SWQiLCJub3RlRWwiLCJub3RlVGl0bGVFbCIsIm5vdGVUaXRsZVR4dCIsInRpdGxlIiwibm90ZUJvZHlFbCIsIm5vdGVCb2R5VHh0IiwiYm9keSIsImJ1aWxkTm90ZUVkaXRvciIsIm5vdGUiLCJlZENvbnRGcmFnIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImVkVGl0bGVFbCIsInZhbHVlIiwiZWRCb2R5RWwiLCJvbklucHV0U2F2ZU5vdGVUaXRsZSIsIm9uSW5wdXRTYXZlTm90ZUJvZHkiLCJmb3JFYWNoIiwiYyIsImluZGV4IiwibmFtZSIsImNhdE5vdGVzIiwiZmlsdGVyIiwibiIsImNhdGVnb3J5X2lkIiwiaSIsIm5vdGVJZCIsImxlbmd0aCIsIm5ld05vdGUiLCJnZW5lcmF0ZVJhbmRvbUlkIiwidW5zaGlmdCIsInBlcnNpc3REYXRhIiwiZGVsZXRlTm90ZSIsImRlbGV0ZU5vdGVGcm9tRG9tIiwiaGlnaGxpZ2h0Rmlyc3ROb3RlSXRlbSIsIm5vdGVMaXN0SXRlbSIsIm5ld1RpdGxlIiwibm90ZUlEIiwidXBkYXRlQ3VycmVudE5vdGVzTGlzdEl0ZW1UaXRsZSIsInZhbCIsImlubmVyVGV4dCIsIm5ld0JvZHkiLCJ1cGRhdGVDdXJyZW50Tm90ZXNMaXN0SXRlbUJvZHkiLCJmaXJzdE5vdGUiLCJjaGlsZHJlbiIsImN1cnJOb3RlcyIsInNlYXJjaFJlcyIsImluY2x1ZGVzIiwiZHJhZ2dhYmxlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJkcm9wWm9uZXMiLCJpbml0RHJhZ2dhYmxlcyIsImluaXREcm9wWm9uZXMiLCJkcmFnZ2FibGUiLCJpbml0RHJhZ2dhYmxlIiwiZHJvcFpvbmUiLCJpbml0RHJvcFpvbmUiLCJkcmFnU3RhcnRIYW5kbGVyIiwiZHJhZ0VuZEhhbmRsZXIiLCJzZXRBdHRyaWJ1dGUiLCJkcm9wWm9uZUVudGVySGFuZGxlciIsImRyb3Bab25lT3ZlckhhbmRsZXIiLCJkcm9wWm9uZUxlYXZlSGFuZGxlciIsImRyb3Bab25lRHJvcEhhbmRsZXIiLCJzZXREcm9wWm9uZXNIaWdobGlnaHQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwidHlwZXMiLCJwcmV2ZW50RGVmYXVsdCIsInJlbGF0ZWRUYXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwiY2xvc2VzdCIsImRyYWdnZWRJdGVtIiwiZHJhZ2dlZEVsQ2F0SWQiLCJnZXREYXRhIiwiZHJhZ2dlZEVsTm90ZUlkIiwiY2hhbmdlTm90ZUNhdCIsInJlbW92ZU5vdGVOb2RlIiwiY2hlY2tTZWxlY3Rpb24iLCJjYXRJRCIsImRyYWdnZWROb3RlIiwiaGlnaGxpZ2h0Il0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUVBLElBQUlBLEtBQUssR0FBRyxFQUFaO0FBQ0EsTUFBTUMsWUFBWSxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsbUJBQXZCLENBQXJCO0FBQ0EsTUFBTUMsT0FBTyxHQUFHRixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBaEI7QUFDQSxNQUFNRSxXQUFXLEdBQUdILFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixjQUF2QixDQUFwQjtBQUNBLE1BQU1HLFlBQVksR0FBR0osUUFBUSxDQUFDQyxhQUFULENBQXVCLFNBQXZCLENBQXJCO0FB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QUNELFNBQVNpRixxQkFBVCxDQUFnQ2lCLFNBQVMsR0FBRyxJQUE1QyxFQUFrRDtBQUM5QyxRQUFNL0IsU0FBUyxHQUFHbEcsUUFBUSxDQUFDaUcsZ0JBQVQsQ0FBMEIsWUFBMUIsQ0FBbEI7O0FBQ0EsT0FBSyxNQUFNTSxRQUFYLElBQXVCTCxTQUF2QixFQUFrQztBQUM5QixRQUFJK0IsU0FBSixFQUFlO0FBQ1gxQixjQUFRLENBQUN6RSxTQUFULENBQW1CRSxHQUFuQixDQUF1QixhQUF2QjtBQUNILEtBRkQsTUFFTztBQUNIdUUsY0FBUSxDQUFDekUsU0FBVCxDQUFtQkMsTUFBbkIsQ0FBMEIsYUFBMUI7QUFDQXdFLGNBQVEsQ0FBQ3pFLFNBQVQsQ0FBbUJDLE1BQW5CLENBQTBCLFdBQTFCO0FBQ0g7QUFDSjtBQUNKLEMiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLy8gaW1wb3J0ICcuL2RyYWdEcm9wJztcclxuLy8gaW1wb3J0IGNhdGVnb3JpZXMgZnJvbSAnLi9wdWJsaWMvZGF0YS5qcyc7XHJcblxyXG5sZXQgbm90ZXMgPSBbXTtcclxuY29uc3QgY2F0ZWdvcmllc0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhdGVnb3JpZXNfX2xpc3QnKTtcclxuY29uc3Qgbm90ZXNFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub3RlcycpO1xyXG5jb25zdCBub3Rlc0xpc3RFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub3Rlc19fbGlzdCcpO1xyXG5jb25zdCBub3RlRWRpdG9yRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdG9yJyk7XHJcbmNvbnN0IGFkZE5ld05vdGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90ZXNfX2FkZC1uZXctbm90ZS1idG4nKTtcclxuY29uc3QgZGVsTm90ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGUtYnRuJyk7XHJcbmNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVzX19zZWFyY2hfX2lucHV0Jyk7XHJcbmNvbnN0IGNhdE1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcmllc19fbWVudS1idG4nKTtcclxubGV0IGN1cnJlbnRDYXQgPSBjYXRlZ29yaWVzWzBdLmlkO1xyXG5cclxuaW5pdCgpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCAoKSB7XHJcbiAgICBpbml0U3RvcmFnZSgpO1xyXG4gICAgcmVuZGVyQ2F0ZWdvcnlMaXN0SXRlbXMoY2F0ZWdvcmllcywgY3VycmVudENhdCk7XHJcbiAgICByZW5kZXJOb3RlTGlzdEl0ZW1zKG5vdGVzLCBjdXJyZW50Q2F0KTtcclxuICAgIGRpc3BsYXlGaXJzdE5vdGVJbk5vdGVFZGl0b3Iobm90ZXMsIGN1cnJlbnRDYXQpO1xyXG4gICAgaW5pdERyYWdBbmREcm9wKCk7XHJcbiAgICBjYXRlZ29yaWVzRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWxlY3RDYXRlZ29yeSk7XHJcbiAgICBub3Rlc0xpc3RFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdE5vdGUpO1xyXG4gICAgYWRkTmV3Tm90ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNyZWF0ZU5ld05vdGUpO1xyXG4gICAgZGVsTm90ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tEZWxldGUpO1xyXG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBzZWFyY2hDdXJyTm90ZXMpO1xyXG59XHJcbmZ1bmN0aW9uIHNlbGVjdENhdGVnb3J5IChldnQpIHtcclxuICAgIGlmIChldnQudGFyZ2V0Lm5vZGVOYW1lICE9ICdMSScpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgc2VsZWN0ZWRDYXRJZCA9IGV2dC50YXJnZXQuZGF0YXNldC5pZDtcclxuICAgIGxldCBzZWxlY3RlZENhdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyLWNhdCcpO1xyXG4gICAgaWYgKHNlbGVjdGVkQ2F0KSB7XHJcbiAgICAgICAgc2VsZWN0ZWRDYXQuY2xhc3NMaXN0LnJlbW92ZSgnY3Vyci1jYXQnKTtcclxuICAgIH1cclxuICAgIGN1cnJlbnRDYXQgPSBzZWxlY3RlZENhdElkO1xyXG4gICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdjdXJyLWNhdCcpO1xyXG4gICAgcmVuZGVyTm90ZUxpc3RJdGVtcyhub3Rlcywgc2VsZWN0ZWRDYXRJZCk7XHJcbiAgICBub3RlRWRpdG9yRWwuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBkaXNwbGF5Rmlyc3ROb3RlSW5Ob3RlRWRpdG9yKG5vdGVzLCBjdXJyZW50Q2F0KTtcclxuICAgIGluaXREcmFnQW5kRHJvcCgpO1xyXG59XHJcbmZ1bmN0aW9uIHNlbGVjdE5vdGUgKGV2dCkge1xyXG4gICAgaWYgKGV2dC50YXJnZXQucGFyZW50RWxlbWVudC5ub2RlTmFtZSAhPSAnTEknKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGlkID0gZXZ0LnRhcmdldC5wYXJlbnRFbGVtZW50LmRhdGFzZXQuaWQ7XHJcbiAgICBsZXQgc2VsZWN0ZWROb3RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJyk7XHJcbiAgICBpZiAoc2VsZWN0ZWROb3RlKSB7XHJcbiAgICAgICAgc2VsZWN0ZWROb3RlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgICBldnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgcmVuZGVyTm90ZUVkaXRvcihub3RlcywgaWQpO1xyXG59XHJcbmZ1bmN0aW9uIGJ1aWxkQ2F0ZWdvcnlMaXN0SXRlbSAoY2F0TmFtZSwgaWQsIGlzU2VsZWN0ZWQpIHtcclxuICAgIGxldCBjYXRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICBsZXQgY2F0VHh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2F0TmFtZSk7XHJcbiAgICBjYXRFbC5jbGFzc05hbWUgPSAnY2F0ZWdvcmllc19fbGlzdF9faXRlbSc7XHJcbiAgICBjYXRFbC5jbGFzc0xpc3QuYWRkKCdkcm9wLXpvbmUnKVxyXG4gICAgaXNTZWxlY3RlZCAmJiBjYXRFbC5jbGFzc0xpc3QuYWRkKCdjdXJyLWNhdCcpO1xyXG4gICAgY2F0RWwuZGF0YXNldC5pZCA9IGlkO1xyXG4gICAgY2F0RWwuYXBwZW5kQ2hpbGQoY2F0VHh0KTtcclxuICAgIHJldHVybiBjYXRFbDtcclxufVxyXG5mdW5jdGlvbiBidWlsZE5vdGVMaXN0SXRlbSAoZGF0YSwgY2F0SWQsIGlzU2VsZWN0ZWQpIHtcclxuICAgIGxldCBub3RlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgbGV0IG5vdGVUaXRsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBsZXQgbm90ZVRpdGxlVHh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YS50aXRsZSk7XHJcbiAgICBsZXQgbm90ZUJvZHlFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbGV0IG5vdGVCb2R5VHh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YS5ib2R5KTtcclxuICAgIG5vdGVFbC5jbGFzc05hbWUgPSAnbm90ZXNfX2xpc3RfX2l0ZW0nO1xyXG4gICAgbm90ZUVsLmNsYXNzTGlzdC5hZGQoJ2RyYWdnYWJsZScpO1xyXG4gICAgbm90ZVRpdGxlRWwuY2xhc3NOYW1lID0gJ25vdGVzX19saXN0X19pdGVtX190aXRsZSc7XHJcbiAgICBub3RlQm9keUVsLmNsYXNzTmFtZSA9ICdub3Rlc19fbGlzdF9faXRlbV9fYm9keSc7XHJcbiAgICBpc1NlbGVjdGVkICYmIG5vdGVFbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgbm90ZUVsLmRhdGFzZXQuaWQgPSBkYXRhLmlkO1xyXG4gICAgbm90ZUVsLmRhdGFzZXQuY2F0SWQgPSBjYXRJZDtcclxuICAgIG5vdGVFbC5hcHBlbmRDaGlsZChub3RlVGl0bGVFbCk7XHJcbiAgICBub3RlVGl0bGVFbC5hcHBlbmRDaGlsZChub3RlVGl0bGVUeHQpO1xyXG4gICAgbm90ZUVsLmFwcGVuZENoaWxkKG5vdGVCb2R5RWwpO1xyXG4gICAgbm90ZUJvZHlFbC5hcHBlbmRDaGlsZChub3RlQm9keVR4dCk7XHJcbiAgICByZXR1cm4gbm90ZUVsO1xyXG59XHJcbmZ1bmN0aW9uIGJ1aWxkTm90ZUVkaXRvciAobm90ZSkge1xyXG4gICAgbGV0IGVkQ29udEZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCdkaXYnKTtcclxuICAgIGxldCBlZFRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xyXG4gICAgZWRUaXRsZUVsLnZhbHVlID0gbm90ZS50aXRsZTtcclxuICAgIGxldCBlZEJvZHlFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICBlZEJvZHlFbC52YWx1ZSA9IG5vdGUuYm9keTtcclxuICAgIGVkVGl0bGVFbC5jbGFzc05hbWUgPSAnZWRpdG9yX190aXRsZSc7XHJcbiAgICBlZEJvZHlFbC5jbGFzc05hbWUgPSAnZWRpdG9yX19ib2R5JztcclxuICAgIGVkVGl0bGVFbC5kYXRhc2V0LmlkID0gbm90ZS5pZDtcclxuICAgIGVkQm9keUVsLmRhdGFzZXQuaWQgPSBub3RlLmlkO1xyXG4gICAgZWRDb250RnJhZy5hcHBlbmRDaGlsZChlZFRpdGxlRWwpO1xyXG4gICAgZWRDb250RnJhZy5hcHBlbmRDaGlsZChlZEJvZHlFbCk7XHJcbiAgICBlZFRpdGxlRWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBvbklucHV0U2F2ZU5vdGVUaXRsZSk7XHJcbiAgICBlZEJvZHlFbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9uSW5wdXRTYXZlTm90ZUJvZHkpO1xyXG4gICAgcmV0dXJuIGVkQ29udEZyYWc7XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyQ2F0ZWdvcnlMaXN0SXRlbXMgKGNhdGVnb3JpZXMpIHtcclxuICAgIGNhdGVnb3JpZXMuZm9yRWFjaCgoYywgaW5kZXgpID0+IHtcclxuICAgICAgICBpZihpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yaWVzRWwuYXBwZW5kQ2hpbGQoYnVpbGRDYXRlZ29yeUxpc3RJdGVtKGMubmFtZSwgYy5pZCwgdHJ1ZSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXNFbC5hcHBlbmRDaGlsZChidWlsZENhdGVnb3J5TGlzdEl0ZW0oYy5uYW1lLCBjLmlkKSlcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlck5vdGVMaXN0SXRlbXMgKG5vdGVzLCBjYXRJZCkge1xyXG4gICAgbm90ZXNMaXN0RWwuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBjb25zdCBjYXROb3RlcyA9IG5vdGVzLmZpbHRlcihuID0+IG4uY2F0ZWdvcnlfaWQgPT09IGNhdElkKTtcclxuICAgIGNhdE5vdGVzLmZvckVhY2goKG4sIGkpID0+IHtcclxuICAgICAgICBpZihpID09IDApIHtcclxuICAgICAgICAgICAgbm90ZXNMaXN0RWwuYXBwZW5kQ2hpbGQoYnVpbGROb3RlTGlzdEl0ZW0obiwgY2F0SWQsIHRydWUpKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vdGVzTGlzdEVsLmFwcGVuZENoaWxkKGJ1aWxkTm90ZUxpc3RJdGVtKG4sIGNhdElkKSlcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiByZW5kZXJOb3RlRWRpdG9yIChub3Rlcywgbm90ZUlkKSB7XHJcbiAgICBub3RlRWRpdG9yRWwuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vdGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG5vdGVJZCA9PT0gbm90ZXNbaV0uaWQpIHtcclxuICAgICAgICAgICAgbm90ZUVkaXRvckVsLmFwcGVuZENoaWxkKGJ1aWxkTm90ZUVkaXRvcihub3Rlc1tpXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlTmV3Tm90ZSAoKSB7XHJcbiAgICBub3RlRWRpdG9yRWwuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBsZXQgbmV3Tm90ZSA9IHtcclxuICAgICAgICBpZDogZ2VuZXJhdGVSYW5kb21JZCgpLFxyXG4gICAgICAgIHRpdGxlOiAnbmV3IG5vdGUgdGl0bGUnLFxyXG4gICAgICAgIGJvZHk6ICduZXcgbm90ZSBib2R5JyxcclxuICAgICAgICBjYXRlZ29yeV9pZDogY3VycmVudENhdFxyXG4gICAgfVxyXG4gICAgbm90ZXMudW5zaGlmdChuZXdOb3RlKTtcclxuICAgIHJlbmRlck5vdGVMaXN0SXRlbXMobm90ZXMsIGN1cnJlbnRDYXQpO1xyXG4gICAgcmVuZGVyTm90ZUVkaXRvcihub3RlcywgbmV3Tm90ZS5pZCk7XHJcbiAgICBwZXJzaXN0RGF0YSgpO1xyXG59XHJcbmZ1bmN0aW9uIG9uQ2xpY2tEZWxldGUgKGV2dCkge1xyXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdG9yX190aXRsZScpO1xyXG4gICAgY29uc3QgaWQgPSB0aXRsZS5kYXRhc2V0LmlkO1xyXG4gICAgbm90ZXMgPSBkZWxldGVOb3RlKG5vdGVzLCBpZCk7XHJcbiAgICBkZWxldGVOb3RlRnJvbURvbShpZCk7XHJcbiAgICBoaWdobGlnaHRGaXJzdE5vdGVJdGVtKCk7XHJcbiAgICBwZXJzaXN0RGF0YSgpO1xyXG4gICAgaWYgKG5vdGVzTGlzdEVsLmlubmVySFRNTCA9PT0gJycpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRpc3BsYXlGaXJzdE5vdGVJbk5vdGVFZGl0b3Iobm90ZXMsIGN1cnJlbnRDYXQpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGRlbGV0ZU5vdGUgKG5vdGVzLCBpZCkge1xyXG4gICAgcmV0dXJuIG5vdGVzLmZpbHRlcihuID0+IG4uaWQgIT0gaWQpO1xyXG59XHJcbmZ1bmN0aW9uIGRlbGV0ZU5vdGVGcm9tRG9tIChpZCkge1xyXG4gICAgbGV0IG5vdGVMaXN0SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5ub3Rlc19fbGlzdF9faXRlbVtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcclxuICAgIG5vdGVMaXN0SXRlbS5yZW1vdmUoKTtcclxuICAgIG5vdGVFZGl0b3JFbC5pbm5lckhUTUwgPSAnJztcclxufVxyXG5mdW5jdGlvbiBvbklucHV0U2F2ZU5vdGVUaXRsZSAoZXZ0KSB7XHJcbiAgICBsZXQgbmV3VGl0bGUgPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgbGV0IG5vdGVJRCA9IGV2dC50YXJnZXQuZGF0YXNldC5pZDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm90ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobm90ZXNbaV0uaWQgPT09IG5vdGVJRCkge1xyXG4gICAgICAgICAgICBub3Rlc1tpXS50aXRsZSA9IG5ld1RpdGxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBlcnNpc3REYXRhKCk7XHJcbiAgICB1cGRhdGVDdXJyZW50Tm90ZXNMaXN0SXRlbVRpdGxlKG5ld1RpdGxlKTtcclxufVxyXG5mdW5jdGlvbiB1cGRhdGVDdXJyZW50Tm90ZXNMaXN0SXRlbVRpdGxlICh2YWwpIHtcclxuICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCAubm90ZXNfX2xpc3RfX2l0ZW1fX3RpdGxlJyk7XHJcbiAgICB0aXRsZS5pbm5lclRleHQgPSB2YWw7XHJcbn1cclxuZnVuY3Rpb24gb25JbnB1dFNhdmVOb3RlQm9keSAoZXZ0KSB7XHJcbiAgICBsZXQgbmV3Qm9keSA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICBsZXQgbm90ZUlEID0gZXZ0LnRhcmdldC5kYXRhc2V0LmlkO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub3Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChub3Rlc1tpXS5pZCA9PT0gbm90ZUlEKSB7XHJcbiAgICAgICAgICAgIG5vdGVzW2ldLmJvZHkgPSBuZXdCb2R5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBlcnNpc3REYXRhKCk7XHJcbiAgICB1cGRhdGVDdXJyZW50Tm90ZXNMaXN0SXRlbUJvZHkobmV3Qm9keSk7XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQ3VycmVudE5vdGVzTGlzdEl0ZW1Cb2R5ICh2YWwpIHtcclxuICAgIGxldCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkIC5ub3Rlc19fbGlzdF9faXRlbV9fYm9keScpO1xyXG4gICAgYm9keS5pbm5lclRleHQgPSB2YWw7XHJcbn1cclxuZnVuY3Rpb24gZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvciAobm90ZXMsIGNhdElkKSB7XHJcbiAgICBjYXRJZCA9IGN1cnJlbnRDYXQ7XHJcbiAgICBsZXQgZmlyc3ROb3RlID0gbm90ZXMuZmlsdGVyKG4gPT4gKG4uY2F0ZWdvcnlfaWQgPT09IGNhdElkKSk7XHJcbiAgICBpZiAobm90ZXNMaXN0RWwuaW5uZXJIVE1MID09PSAnJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICByZW5kZXJOb3RlRWRpdG9yKG5vdGVzLCBmaXJzdE5vdGVbMF0uaWQpXHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaGlnaGxpZ2h0Rmlyc3ROb3RlSXRlbSAoKSB7XHJcbiAgICBub3Rlc0xpc3RFbC5jaGlsZHJlblswXSAmJiBub3Rlc0xpc3RFbC5jaGlsZHJlblswXS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG59XHJcbmZ1bmN0aW9uIHNlYXJjaEN1cnJOb3RlcyAoZXZ0KSB7XHJcbiAgICBsZXQgY3Vyck5vdGVzID0gbm90ZXMuZmlsdGVyKG4gPT4gbi5jYXRlZ29yeV9pZCA9PT0gY3VycmVudENhdCk7XHJcbiAgICBsZXQgc2VhcmNoUmVzID0gY3Vyck5vdGVzLmZpbHRlcihuID0+IG4udGl0bGUuaW5jbHVkZXMoZXZ0LnRhcmdldC52YWx1ZSkpO1xyXG4gICAgcmVuZGVyTm90ZUxpc3RJdGVtcyhzZWFyY2hSZXMsIGN1cnJlbnRDYXQpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaW5pdERyYWdBbmREcm9wICgpIHtcclxuICAgIGxldCBkcmFnZ2FibGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyYWdnYWJsZScpO1xyXG4gICAgbGV0IGRyb3Bab25lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wLXpvbmUnKTtcclxuICAgIGluaXREcmFnZ2FibGVzKGRyYWdnYWJsZXMpO1xyXG4gICAgaW5pdERyb3Bab25lcyhkcm9wWm9uZXMpO1xyXG59XHJcbmZ1bmN0aW9uIGluaXREcmFnZ2FibGVzIChkcmFnZ2FibGVzKSB7XHJcbiAgICBmb3IgKGNvbnN0IGRyYWdnYWJsZSBvZiBkcmFnZ2FibGVzKSB7XHJcbiAgICAgICAgaW5pdERyYWdnYWJsZShkcmFnZ2FibGUpXHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5pdERyb3Bab25lcyAoZHJvcFpvbmVzKSB7XHJcbiAgICBmb3IgKGNvbnN0IGRyb3Bab25lIG9mIGRyb3Bab25lcykge1xyXG4gICAgICAgIGluaXREcm9wWm9uZShkcm9wWm9uZSlcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbml0RHJhZ2dhYmxlIChkcmFnZ2FibGUpIHtcclxuICAgIGRyYWdnYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBkcmFnU3RhcnRIYW5kbGVyKTtcclxuICAgIGRyYWdnYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgZHJhZ0VuZEhhbmRsZXIpO1xyXG4gICAgZHJhZ2dhYmxlLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgJ3RydWUnKTtcclxufVxyXG5mdW5jdGlvbiBpbml0RHJvcFpvbmUgKGRyb3Bab25lKSB7XHJcbiAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBkcm9wWm9uZUVudGVySGFuZGxlcik7XHJcbiAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGRyb3Bab25lT3ZlckhhbmRsZXIpO1xyXG4gICAgZHJvcFpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZHJvcFpvbmVMZWF2ZUhhbmRsZXIpO1xyXG4gICAgZHJvcFpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGRyb3Bab25lRHJvcEhhbmRsZXIpO1xyXG59XHJcbmZ1bmN0aW9uIGRyYWdTdGFydEhhbmRsZXIoZXZ0KSB7XHJcbiAgICBzZXREcm9wWm9uZXNIaWdobGlnaHQoKTtcclxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnZHJhZ2dlZCcpO1xyXG4gICAgZXZ0LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0eXBlJywgJ2RyYWdnZWQnKTtcclxuICAgIGV2dC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnbm90ZUlkJywgZXZ0LnRhcmdldC5kYXRhc2V0LmlkKTtcclxuICAgIGV2dC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnY2F0SWQnLCBldnQudGFyZ2V0LmRhdGFzZXQuY2F0SWQpO1xyXG59XHJcbmZ1bmN0aW9uIGRyYWdFbmRIYW5kbGVyIChldnQpIHtcclxuICAgIHNldERyb3Bab25lc0hpZ2hsaWdodChmYWxzZSk7XHJcbn1cclxuZnVuY3Rpb24gZHJvcFpvbmVFbnRlckhhbmRsZXIoZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LmRhdGFUcmFuc2Zlci50eXBlcy5pbmNsdWRlcygndHlwZScpKSB7XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdvdmVyLXpvbmUnKTtcclxuICAgIH1cclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59XHJcbmZ1bmN0aW9uIGRyb3Bab25lT3ZlckhhbmRsZXIgKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbn1cclxuZnVuY3Rpb24gZHJvcFpvbmVMZWF2ZUhhbmRsZXIgKGV2dCkge1xyXG4gICAgaWYgKGV2dC5kYXRhVHJhbnNmZXIudHlwZXMuaW5jbHVkZXMoJ3R5cGUnKSAmJlxyXG4gICAgICAgIGV2dC5yZWxhdGVkVGFyZ2V0ICE9PSBudWxsICYmXHJcbiAgICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQgIT09IGV2dC5yZWxhdGVkVGFyZ2V0LmNsb3Nlc3QoJy5kcm9wLXpvbmUnKSkge1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnb3Zlci16b25lJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZHJvcFpvbmVEcm9wSGFuZGxlciAoZXZ0KSB7XHJcbiAgICBsZXQgc2VsZWN0ZWRDYXRJZCA9IGV2dC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICBsZXQgZHJhZ2dlZEl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJhZ2dlZCcpXHJcbiAgICBsZXQgZHJhZ2dlZEVsQ2F0SWQgPSBldnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2NhdElkJyk7XHJcbiAgICBsZXQgZHJhZ2dlZEVsTm90ZUlkID0gZXZ0LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdub3RlSWQnKTtcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWRDYXRJZCA9PT0gZHJhZ2dlZEVsQ2F0SWQpIHtcclxuICAgICAgICBkcmFnZ2VkSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2VkJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjaGFuZ2VOb3RlQ2F0KHNlbGVjdGVkQ2F0SWQsIGRyYWdnZWRFbE5vdGVJZCk7XHJcbiAgICAgICAgcmVtb3ZlTm90ZU5vZGUoZHJhZ2dlZEVsTm90ZUlkKTtcclxuICAgICAgICBjaGVja1NlbGVjdGlvbihkcmFnZ2VkRWxDYXRJZCk7XHJcbiAgICBcclxuICAgIH1cclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrU2VsZWN0aW9uIChjYXRJRCkge1xyXG4gICAgbGV0IHNlbGVjdGVkTm90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpO1xyXG4gICAgaWYgKCFzZWxlY3RlZE5vdGUpIHtcclxuICAgICAgICBoaWdobGlnaHRGaXJzdE5vdGVJdGVtKCk7XHJcbiAgICAgICAgZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvcihub3RlcywgY2F0SUQpXHJcbiAgICB9XHJcblxyXG59XHJcbmZ1bmN0aW9uIGNoYW5nZU5vdGVDYXQgKGNhdElkLCBub3RlSWQpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm90ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobm90ZXNbaV0uaWQgPT09IG5vdGVJZCkge1xyXG4gICAgICAgICAgICBub3Rlc1tpXS5jYXRlZ29yeV9pZCA9IGNhdElkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGVyc2lzdERhdGEoKTtcclxufVxyXG5mdW5jdGlvbiByZW1vdmVOb3RlTm9kZSAobm90ZUlkKSB7XHJcbiAgICBsZXQgZHJhZ2dlZE5vdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAubm90ZXNfX2xpc3RfX2l0ZW1bZGF0YS1pZD1cIiR7bm90ZUlkfVwiXWApO1xyXG4gICAgZHJhZ2dlZE5vdGUucmVtb3ZlKCk7XHJcblxyXG59XHJcbmZ1bmN0aW9uIHNldERyb3Bab25lc0hpZ2hsaWdodCAoaGlnaGxpZ2h0ID0gdHJ1ZSkge1xyXG4gICAgY29uc3QgZHJvcFpvbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Atem9uZScpO1xyXG4gICAgZm9yIChjb25zdCBkcm9wWm9uZSBvZiBkcm9wWm9uZXMpIHtcclxuICAgICAgICBpZiAoaGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgIGRyb3Bab25lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZS16b25lJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZHJvcFpvbmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlLXpvbmUnKTtcclxuICAgICAgICAgICAgZHJvcFpvbmUuY2xhc3NMaXN0LnJlbW92ZSgnb3Zlci16b25lJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=