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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIm5vdGVzIiwiY2F0ZWdvcmllc0VsIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibm90ZXNFbCIsIm5vdGVzTGlzdEVsIiwibm90ZUVkaXRvckVsIiwiYWRkTmV3Tm90ZUJ0biIsImRlbE5vdGVCdG4iLCJzZWFyY2hJbnB1dCIsImNhdE1lbnUiLCJjdXJyZW50Q2F0IiwiY2F0ZWdvcmllcyIsImlkIiwiaW5pdCIsImluaXRTdG9yYWdlIiwicmVuZGVyQ2F0ZWdvcnlMaXN0SXRlbXMiLCJyZW5kZXJOb3RlTGlzdEl0ZW1zIiwiZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvciIsImluaXREcmFnQW5kRHJvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZWxlY3RDYXRlZ29yeSIsInNlbGVjdE5vdGUiLCJjcmVhdGVOZXdOb3RlIiwib25DbGlja0RlbGV0ZSIsInNlYXJjaEN1cnJOb3RlcyIsImV2dCIsInRhcmdldCIsIm5vZGVOYW1lIiwic2VsZWN0ZWRDYXRJZCIsImRhdGFzZXQiLCJzZWxlY3RlZENhdCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsImlubmVySFRNTCIsInBhcmVudEVsZW1lbnQiLCJzZWxlY3RlZE5vdGUiLCJyZW5kZXJOb3RlRWRpdG9yIiwiYnVpbGRDYXRlZ29yeUxpc3RJdGVtIiwiY2F0TmFtZSIsImlzU2VsZWN0ZWQiLCJjYXRFbCIsImNyZWF0ZUVsZW1lbnQiLCJjYXRUeHQiLCJjcmVhdGVUZXh0Tm9kZSIsImNsYXNzTmFtZSIsImFwcGVuZENoaWxkIiwiYnVpbGROb3RlTGlzdEl0ZW0iLCJkYXRhIiwiY2F0SWQiLCJub3RlRWwiLCJub3RlVGl0bGVFbCIsIm5vdGVUaXRsZVR4dCIsInRpdGxlIiwibm90ZUJvZHlFbCIsIm5vdGVCb2R5VHh0IiwiYm9keSIsImJ1aWxkTm90ZUVkaXRvciIsIm5vdGUiLCJlZENvbnRGcmFnIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImVkVGl0bGVFbCIsInZhbHVlIiwiZWRCb2R5RWwiLCJvbklucHV0U2F2ZU5vdGVUaXRsZSIsIm9uSW5wdXRTYXZlTm90ZUJvZHkiLCJmb3JFYWNoIiwiYyIsImluZGV4IiwibmFtZSIsImNhdE5vdGVzIiwiZmlsdGVyIiwibiIsImNhdGVnb3J5X2lkIiwiaSIsIm5vdGVJZCIsImxlbmd0aCIsIm5ld05vdGUiLCJnZW5lcmF0ZVJhbmRvbUlkIiwidW5zaGlmdCIsInBlcnNpc3REYXRhIiwiZGVsZXRlTm90ZSIsImRlbGV0ZU5vdGVGcm9tRG9tIiwiaGlnaGxpZ2h0Rmlyc3ROb3RlSXRlbSIsIm5vdGVMaXN0SXRlbSIsIm5ld1RpdGxlIiwibm90ZUlEIiwidXBkYXRlQ3VycmVudE5vdGVzTGlzdEl0ZW1UaXRsZSIsInZhbCIsImlubmVyVGV4dCIsIm5ld0JvZHkiLCJ1cGRhdGVDdXJyZW50Tm90ZXNMaXN0SXRlbUJvZHkiLCJmaXJzdE5vdGUiLCJjaGlsZHJlbiIsImN1cnJOb3RlcyIsInNlYXJjaFJlcyIsImluY2x1ZGVzIiwiZHJhZ2dhYmxlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJkcm9wWm9uZXMiLCJpbml0RHJhZ2dhYmxlcyIsImluaXREcm9wWm9uZXMiLCJkcmFnZ2FibGUiLCJpbml0RHJhZ2dhYmxlIiwiZHJvcFpvbmUiLCJpbml0RHJvcFpvbmUiLCJkcmFnU3RhcnRIYW5kbGVyIiwiZHJhZ0VuZEhhbmRsZXIiLCJzZXRBdHRyaWJ1dGUiLCJkcm9wWm9uZUVudGVySGFuZGxlciIsImRyb3Bab25lT3ZlckhhbmRsZXIiLCJkcm9wWm9uZUxlYXZlSGFuZGxlciIsImRyb3Bab25lRHJvcEhhbmRsZXIiLCJzZXREcm9wWm9uZXNIaWdobGlnaHQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwidHlwZXMiLCJwcmV2ZW50RGVmYXVsdCIsInJlbGF0ZWRUYXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwiY2xvc2VzdCIsImRyYWdnZWRJdGVtIiwiZHJhZ2dlZEVsQ2F0SWQiLCJnZXREYXRhIiwiZHJhZ2dlZEVsTm90ZUlkIiwiY2hhbmdlTm90ZUNhdCIsInJlbW92ZU5vdGVOb2RlIiwiY2hlY2tTZWxlY3Rpb24iLCJjYXRJRCIsImRyYWdnZWROb3RlIiwiaGlnaGxpZ2h0Il0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNoRkEsSUFBSUEsS0FBSyxHQUFHLEVBQVo7QUFDQSxNQUFNQyxZQUFZLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixtQkFBdkIsQ0FBckI7QUFDQSxNQUFNQyxPQUFPLEdBQUdGLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQUFoQjtBQUNBLE1BQU1FLFdBQVcsR0FBR0gsUUFBUSxDQUFDQyxhQUFULENBQXVCLGNBQXZCLENBQXBCO0FBQ0EsTUFBTUcsWUFBWSxHQUFHSixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsU0FBdkIsQ0FBckI7QUFDQSxNQUFNSSxhQUFhLEdBQUdMLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QiwwQkFBdkIsQ0FBdEI7QUFDQSxNQUFNSyxVQUFVLEdBQUdOLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixhQUF2QixDQUFuQjtBQUNBLE1BQU1NLFdBQVcsR0FBR1AsUUFBUSxDQUFDQyxhQUFULENBQXVCLHVCQUF2QixDQUFwQjtBQUNBLE1BQU1PLE9BQU8sR0FBR1IsUUFBUSxDQUFDQyxhQUFULENBQXVCLHVCQUF2QixDQUFoQjtBQUNBLElBQUlRLFVBQVUsR0FBR0MsVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjQyxFQUEvQjtBQUVBQyxJQUFJOztBQUVKLFNBQVNBLElBQVQsR0FBaUI7QUFDYkMsYUFBVztBQUNYQyx5QkFBdUIsQ0FBQ0osVUFBRCxFQUFhRCxVQUFiLENBQXZCO0FBQ0FNLHFCQUFtQixDQUFDakIsS0FBRCxFQUFRVyxVQUFSLENBQW5CO0FBQ0FPLDhCQUE0QixDQUFDbEIsS0FBRCxFQUFRVyxVQUFSLENBQTVCO0FBQ0FRLGlCQUFlO0FBQ2ZsQixjQUFZLENBQUNtQixnQkFBYixDQUE4QixPQUE5QixFQUF1Q0MsY0FBdkM7QUFDQWhCLGFBQVcsQ0FBQ2UsZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0NFLFVBQXRDO0FBQ0FmLGVBQWEsQ0FBQ2EsZ0JBQWQsQ0FBK0IsT0FBL0IsRUFBd0NHLGFBQXhDO0FBQ0FmLFlBQVUsQ0FBQ1ksZ0JBQVgsQ0FBNEIsT0FBNUIsRUFBcUNJLGFBQXJDO0FBQ0FmLGFBQVcsQ0FBQ1csZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0NLLGVBQXRDO0FBQ0g7O0FBQ0QsU0FBU0osY0FBVCxDQUF5QkssR0FBekIsRUFBOEI7QUFDMUIsTUFBSUEsR0FBRyxDQUFDQyxNQUFKLENBQVdDLFFBQVgsSUFBdUIsSUFBM0IsRUFBaUM7QUFDN0I7QUFDSDs7QUFDRCxNQUFJQyxhQUFhLEdBQUdILEdBQUcsQ0FBQ0MsTUFBSixDQUFXRyxPQUFYLENBQW1CakIsRUFBdkM7QUFDQSxNQUFJa0IsV0FBVyxHQUFHN0IsUUFBUSxDQUFDQyxhQUFULENBQXVCLFdBQXZCLENBQWxCOztBQUNBLE1BQUk0QixXQUFKLEVBQWlCO0FBQ2JBLGVBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsTUFBdEIsQ0FBNkIsVUFBN0I7QUFDSDs7QUFDRHRCLFlBQVUsR0FBR2tCLGFBQWI7QUFDQUgsS0FBRyxDQUFDQyxNQUFKLENBQVdLLFNBQVgsQ0FBcUJFLEdBQXJCLENBQXlCLFVBQXpCO0FBQ0FqQixxQkFBbUIsQ0FBQ2pCLEtBQUQsRUFBUTZCLGFBQVIsQ0FBbkI7QUFDQXZCLGNBQVksQ0FBQzZCLFNBQWIsR0FBeUIsRUFBekI7QUFDQWpCLDhCQUE0QixDQUFDbEIsS0FBRCxFQUFRVyxVQUFSLENBQTVCO0FBQ0FRLGlCQUFlO0FBQ2xCOztBQUNELFNBQVNHLFVBQVQsQ0FBcUJJLEdBQXJCLEVBQTBCO0FBQ3RCLE1BQUlBLEdBQUcsQ0FBQ0MsTUFBSixDQUFXUyxhQUFYLENBQXlCUixRQUF6QixJQUFxQyxJQUF6QyxFQUErQztBQUMzQztBQUNIOztBQUNELE1BQUlmLEVBQUUsR0FBR2EsR0FBRyxDQUFDQyxNQUFKLENBQVdTLGFBQVgsQ0FBeUJOLE9BQXpCLENBQWlDakIsRUFBMUM7QUFDQSxNQUFJd0IsWUFBWSxHQUFHbkMsUUFBUSxDQUFDQyxhQUFULENBQXVCLFdBQXZCLENBQW5COztBQUNBLE1BQUlrQyxZQUFKLEVBQWtCO0FBQ2RBLGdCQUFZLENBQUNMLFNBQWIsQ0FBdUJDLE1BQXZCLENBQThCLFVBQTlCO0FBQ0g7O0FBQ0RQLEtBQUcsQ0FBQ0MsTUFBSixDQUFXUyxhQUFYLENBQXlCSixTQUF6QixDQUFtQ0UsR0FBbkMsQ0FBdUMsVUFBdkM7QUFDQUksa0JBQWdCLENBQUN0QyxLQUFELEVBQVFhLEVBQVIsQ0FBaEI7QUFDSDs7QUFDRCxTQUFTMEIscUJBQVQsQ0FBZ0NDLE9BQWhDLEVBQXlDM0IsRUFBekMsRUFBNkM0QixVQUE3QyxFQUF5RDtBQUNyRCxNQUFJQyxLQUFLLEdBQUd4QyxRQUFRLENBQUN5QyxhQUFULENBQXVCLElBQXZCLENBQVo7QUFDQSxNQUFJQyxNQUFNLEdBQUcxQyxRQUFRLENBQUMyQyxjQUFULENBQXdCTCxPQUF4QixDQUFiO0FBQ0FFLE9BQUssQ0FBQ0ksU0FBTixHQUFrQix3QkFBbEI7QUFDQUosT0FBSyxDQUFDVixTQUFOLENBQWdCRSxHQUFoQixDQUFvQixXQUFwQjtBQUNBTyxZQUFVLElBQUlDLEtBQUssQ0FBQ1YsU0FBTixDQUFnQkUsR0FBaEIsQ0FBb0IsVUFBcEIsQ0FBZDtBQUNBUSxPQUFLLENBQUNaLE9BQU4sQ0FBY2pCLEVBQWQsR0FBbUJBLEVBQW5CO0FBQ0E2QixPQUFLLENBQUNLLFdBQU4sQ0FBa0JILE1BQWxCO0FBQ0EsU0FBT0YsS0FBUDtBQUNIOztBQUNELFNBQVNNLGlCQUFULENBQTRCQyxJQUE1QixFQUFrQ0MsS0FBbEMsRUFBeUNULFVBQXpDLEVBQXFEO0FBQ2pELE1BQUlVLE1BQU0sR0FBR2pELFFBQVEsQ0FBQ3lDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBYjtBQUNBLE1BQUlTLFdBQVcsR0FBR2xELFFBQVEsQ0FBQ3lDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbEI7QUFDQSxNQUFJVSxZQUFZLEdBQUduRCxRQUFRLENBQUMyQyxjQUFULENBQXdCSSxJQUFJLENBQUNLLEtBQTdCLENBQW5CO0FBQ0EsTUFBSUMsVUFBVSxHQUFHckQsUUFBUSxDQUFDeUMsYUFBVCxDQUF1QixLQUF2QixDQUFqQjtBQUNBLE1BQUlhLFdBQVcsR0FBR3RELFFBQVEsQ0FBQzJDLGNBQVQsQ0FBd0JJLElBQUksQ0FBQ1EsSUFBN0IsQ0FBbEI7QUFDQU4sUUFBTSxDQUFDTCxTQUFQLEdBQW1CLG1CQUFuQjtBQUNBSyxRQUFNLENBQUNuQixTQUFQLENBQWlCRSxHQUFqQixDQUFxQixXQUFyQjtBQUNBa0IsYUFBVyxDQUFDTixTQUFaLEdBQXdCLDBCQUF4QjtBQUNBUyxZQUFVLENBQUNULFNBQVgsR0FBdUIseUJBQXZCO0FBQ0FMLFlBQVUsSUFBSVUsTUFBTSxDQUFDbkIsU0FBUCxDQUFpQkUsR0FBakIsQ0FBcUIsVUFBckIsQ0FBZDtBQUNBaUIsUUFBTSxDQUFDckIsT0FBUCxDQUFlakIsRUFBZixHQUFvQm9DLElBQUksQ0FBQ3BDLEVBQXpCO0FBQ0FzQyxRQUFNLENBQUNyQixPQUFQLENBQWVvQixLQUFmLEdBQXVCQSxLQUF2QjtBQUNBQyxRQUFNLENBQUNKLFdBQVAsQ0FBbUJLLFdBQW5CO0FBQ0FBLGFBQVcsQ0FBQ0wsV0FBWixDQUF3Qk0sWUFBeEI7QUFDQUYsUUFBTSxDQUFDSixXQUFQLENBQW1CUSxVQUFuQjtBQUNBQSxZQUFVLENBQUNSLFdBQVgsQ0FBdUJTLFdBQXZCO0FBQ0EsU0FBT0wsTUFBUDtBQUNIOztBQUNELFNBQVNPLGVBQVQsQ0FBMEJDLElBQTFCLEVBQWdDO0FBQzVCLE1BQUlDLFVBQVUsR0FBRzFELFFBQVEsQ0FBQzJELHNCQUFULENBQWdDLEtBQWhDLENBQWpCO0FBQ0EsTUFBSUMsU0FBUyxHQUFHNUQsUUFBUSxDQUFDeUMsYUFBVCxDQUF1QixVQUF2QixDQUFoQjtBQUNBbUIsV0FBUyxDQUFDQyxLQUFWLEdBQWtCSixJQUFJLENBQUNMLEtBQXZCO0FBQ0EsTUFBSVUsUUFBUSxHQUFHOUQsUUFBUSxDQUFDeUMsYUFBVCxDQUF1QixVQUF2QixDQUFmO0FBQ0FxQixVQUFRLENBQUNELEtBQVQsR0FBaUJKLElBQUksQ0FBQ0YsSUFBdEI7QUFDQUssV0FBUyxDQUFDaEIsU0FBVixHQUFzQixlQUF0QjtBQUNBa0IsVUFBUSxDQUFDbEIsU0FBVCxHQUFxQixjQUFyQjtBQUNBZ0IsV0FBUyxDQUFDaEMsT0FBVixDQUFrQmpCLEVBQWxCLEdBQXVCOEMsSUFBSSxDQUFDOUMsRUFBNUI7QUFDQW1ELFVBQVEsQ0FBQ2xDLE9BQVQsQ0FBaUJqQixFQUFqQixHQUFzQjhDLElBQUksQ0FBQzlDLEVBQTNCO0FBQ0ErQyxZQUFVLENBQUNiLFdBQVgsQ0FBdUJlLFNBQXZCO0FBQ0FGLFlBQVUsQ0FBQ2IsV0FBWCxDQUF1QmlCLFFBQXZCO0FBQ0FGLFdBQVMsQ0FBQzFDLGdCQUFWLENBQTJCLE9BQTNCLEVBQW9DNkMsb0JBQXBDO0FBQ0FELFVBQVEsQ0FBQzVDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DOEMsbUJBQW5DO0FBQ0EsU0FBT04sVUFBUDtBQUNIOztBQUNELFNBQVM1Qyx1QkFBVCxDQUFrQ0osVUFBbEMsRUFBOEM7QUFDMUNBLFlBQVUsQ0FBQ3VELE9BQVgsQ0FBbUIsQ0FBQ0MsQ0FBRCxFQUFJQyxLQUFKLEtBQWM7QUFDN0IsUUFBR0EsS0FBSyxLQUFLLENBQWIsRUFBZ0I7QUFDWnBFLGtCQUFZLENBQUM4QyxXQUFiLENBQXlCUixxQkFBcUIsQ0FBQzZCLENBQUMsQ0FBQ0UsSUFBSCxFQUFTRixDQUFDLENBQUN2RCxFQUFYLEVBQWUsSUFBZixDQUE5QztBQUNILEtBRkQsTUFFTztBQUNIWixrQkFBWSxDQUFDOEMsV0FBYixDQUF5QlIscUJBQXFCLENBQUM2QixDQUFDLENBQUNFLElBQUgsRUFBU0YsQ0FBQyxDQUFDdkQsRUFBWCxDQUE5QztBQUNIO0FBQ0osR0FORDtBQU9IOztBQUNELFNBQVNJLG1CQUFULENBQThCakIsS0FBOUIsRUFBcUNrRCxLQUFyQyxFQUE0QztBQUN4QzdDLGFBQVcsQ0FBQzhCLFNBQVosR0FBd0IsRUFBeEI7QUFDQSxRQUFNb0MsUUFBUSxHQUFHdkUsS0FBSyxDQUFDd0UsTUFBTixDQUFhQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0MsV0FBRixLQUFrQnhCLEtBQXBDLENBQWpCO0FBQ0FxQixVQUFRLENBQUNKLE9BQVQsQ0FBaUIsQ0FBQ00sQ0FBRCxFQUFJRSxDQUFKLEtBQVU7QUFDdkIsUUFBR0EsQ0FBQyxJQUFJLENBQVIsRUFBVztBQUNQdEUsaUJBQVcsQ0FBQzBDLFdBQVosQ0FBd0JDLGlCQUFpQixDQUFDeUIsQ0FBRCxFQUFJdkIsS0FBSixFQUFXLElBQVgsQ0FBekM7QUFDSCxLQUZELE1BRU87QUFDSDdDLGlCQUFXLENBQUMwQyxXQUFaLENBQXdCQyxpQkFBaUIsQ0FBQ3lCLENBQUQsRUFBSXZCLEtBQUosQ0FBekM7QUFDSDtBQUNKLEdBTkQ7QUFPSDs7QUFDRCxTQUFTWixnQkFBVCxDQUEyQnRDLEtBQTNCLEVBQWtDNEUsTUFBbEMsRUFBMEM7QUFDdEN0RSxjQUFZLENBQUM2QixTQUFiLEdBQXlCLEVBQXpCOztBQUNBLE9BQUssSUFBSXdDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUczRSxLQUFLLENBQUM2RSxNQUExQixFQUFrQ0YsQ0FBQyxFQUFuQyxFQUF1QztBQUNuQyxRQUFJQyxNQUFNLEtBQUs1RSxLQUFLLENBQUMyRSxDQUFELENBQUwsQ0FBUzlELEVBQXhCLEVBQTRCO0FBQ3hCUCxrQkFBWSxDQUFDeUMsV0FBYixDQUF5QlcsZUFBZSxDQUFDMUQsS0FBSyxDQUFDMkUsQ0FBRCxDQUFOLENBQXhDO0FBQ0g7QUFDSjs7QUFBQTtBQUNKOztBQUNELFNBQVNwRCxhQUFULEdBQTBCO0FBQ3RCakIsY0FBWSxDQUFDNkIsU0FBYixHQUF5QixFQUF6QjtBQUNBLE1BQUkyQyxPQUFPLEdBQUc7QUFDVmpFLE1BQUUsRUFBRWtFLGdCQUFnQixFQURWO0FBRVZ6QixTQUFLLEVBQUUsZ0JBRkc7QUFHVkcsUUFBSSxFQUFFLGVBSEk7QUFJVmlCLGVBQVcsRUFBRS9EO0FBSkgsR0FBZDtBQU1BWCxPQUFLLENBQUNnRixPQUFOLENBQWNGLE9BQWQ7QUFDQTdELHFCQUFtQixDQUFDakIsS0FBRCxFQUFRVyxVQUFSLENBQW5CO0FBQ0EyQixrQkFBZ0IsQ0FBQ3RDLEtBQUQsRUFBUThFLE9BQU8sQ0FBQ2pFLEVBQWhCLENBQWhCO0FBQ0FvRSxhQUFXO0FBQ2Q7O0FBQ0QsU0FBU3pELGFBQVQsQ0FBd0JFLEdBQXhCLEVBQTZCO0FBQ3pCLFFBQU00QixLQUFLLEdBQUdwRCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQWQ7QUFDQSxRQUFNVSxFQUFFLEdBQUd5QyxLQUFLLENBQUN4QixPQUFOLENBQWNqQixFQUF6QjtBQUNBYixPQUFLLEdBQUdrRixVQUFVLENBQUNsRixLQUFELEVBQVFhLEVBQVIsQ0FBbEI7QUFDQXNFLG1CQUFpQixDQUFDdEUsRUFBRCxDQUFqQjtBQUNBdUUsd0JBQXNCO0FBQ3RCSCxhQUFXOztBQUNYLE1BQUk1RSxXQUFXLENBQUM4QixTQUFaLEtBQTBCLEVBQTlCLEVBQWtDO0FBQzlCO0FBQ0gsR0FGRCxNQUVPO0FBQ0hqQixnQ0FBNEIsQ0FBQ2xCLEtBQUQsRUFBUVcsVUFBUixDQUE1QjtBQUNIO0FBQ0o7O0FBQ0QsU0FBU3VFLFVBQVQsQ0FBcUJsRixLQUFyQixFQUE0QmEsRUFBNUIsRUFBZ0M7QUFDNUIsU0FBT2IsS0FBSyxDQUFDd0UsTUFBTixDQUFhQyxDQUFDLElBQUlBLENBQUMsQ0FBQzVELEVBQUYsSUFBUUEsRUFBMUIsQ0FBUDtBQUNIOztBQUNELFNBQVNzRSxpQkFBVCxDQUE0QnRFLEVBQTVCLEVBQWdDO0FBQzVCLE1BQUl3RSxZQUFZLEdBQUduRixRQUFRLENBQUNDLGFBQVQsQ0FBd0IsK0JBQThCVSxFQUFHLElBQXpELENBQW5CO0FBQ0F3RSxjQUFZLENBQUNwRCxNQUFiO0FBQ0EzQixjQUFZLENBQUM2QixTQUFiLEdBQXlCLEVBQXpCO0FBQ0g7O0FBQ0QsU0FBUzhCLG9CQUFULENBQStCdkMsR0FBL0IsRUFBb0M7QUFDaEMsTUFBSTRELFFBQVEsR0FBRzVELEdBQUcsQ0FBQ0MsTUFBSixDQUFXb0MsS0FBMUI7QUFDQSxNQUFJd0IsTUFBTSxHQUFHN0QsR0FBRyxDQUFDQyxNQUFKLENBQVdHLE9BQVgsQ0FBbUJqQixFQUFoQzs7QUFDQSxPQUFLLElBQUk4RCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHM0UsS0FBSyxDQUFDNkUsTUFBMUIsRUFBa0NGLENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsUUFBSTNFLEtBQUssQ0FBQzJFLENBQUQsQ0FBTCxDQUFTOUQsRUFBVCxLQUFnQjBFLE1BQXBCLEVBQTRCO0FBQ3hCdkYsV0FBSyxDQUFDMkUsQ0FBRCxDQUFMLENBQVNyQixLQUFULEdBQWlCZ0MsUUFBakI7QUFDSDtBQUNKOztBQUNETCxhQUFXO0FBQ1hPLGlDQUErQixDQUFDRixRQUFELENBQS9CO0FBQ0g7O0FBQ0QsU0FBU0UsK0JBQVQsQ0FBMENDLEdBQTFDLEVBQStDO0FBQzNDLE1BQUluQyxLQUFLLEdBQUdwRCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIscUNBQXZCLENBQVo7QUFDQW1ELE9BQUssQ0FBQ29DLFNBQU4sR0FBa0JELEdBQWxCO0FBQ0g7O0FBQ0QsU0FBU3ZCLG1CQUFULENBQThCeEMsR0FBOUIsRUFBbUM7QUFDL0IsTUFBSWlFLE9BQU8sR0FBR2pFLEdBQUcsQ0FBQ0MsTUFBSixDQUFXb0MsS0FBekI7QUFDQSxNQUFJd0IsTUFBTSxHQUFHN0QsR0FBRyxDQUFDQyxNQUFKLENBQVdHLE9BQVgsQ0FBbUJqQixFQUFoQzs7QUFDQSxPQUFLLElBQUk4RCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHM0UsS0FBSyxDQUFDNkUsTUFBMUIsRUFBa0NGLENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsUUFBSTNFLEtBQUssQ0FBQzJFLENBQUQsQ0FBTCxDQUFTOUQsRUFBVCxLQUFnQjBFLE1BQXBCLEVBQTRCO0FBQ3hCdkYsV0FBSyxDQUFDMkUsQ0FBRCxDQUFMLENBQVNsQixJQUFULEdBQWdCa0MsT0FBaEI7QUFDSDtBQUNKOztBQUNEVixhQUFXO0FBQ1hXLGdDQUE4QixDQUFDRCxPQUFELENBQTlCO0FBQ0g7O0FBQ0QsU0FBU0MsOEJBQVQsQ0FBeUNILEdBQXpDLEVBQThDO0FBQzFDLE1BQUloQyxJQUFJLEdBQUd2RCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsb0NBQXZCLENBQVg7QUFDQXNELE1BQUksQ0FBQ2lDLFNBQUwsR0FBaUJELEdBQWpCO0FBQ0g7O0FBQ0QsU0FBU3ZFLDRCQUFULENBQXVDbEIsS0FBdkMsRUFBOENrRCxLQUE5QyxFQUFxRDtBQUNqREEsT0FBSyxHQUFHdkMsVUFBUjtBQUNBLE1BQUlrRixTQUFTLEdBQUc3RixLQUFLLENBQUN3RSxNQUFOLENBQWFDLENBQUMsSUFBS0EsQ0FBQyxDQUFDQyxXQUFGLEtBQWtCeEIsS0FBckMsQ0FBaEI7O0FBQ0EsTUFBSTdDLFdBQVcsQ0FBQzhCLFNBQVosS0FBMEIsRUFBOUIsRUFBa0M7QUFDOUI7QUFDSCxHQUZELE1BRU87QUFDUEcsb0JBQWdCLENBQUN0QyxLQUFELEVBQVE2RixTQUFTLENBQUMsQ0FBRCxDQUFULENBQWFoRixFQUFyQixDQUFoQjtBQUNDO0FBQ0o7O0FBQ0QsU0FBU3VFLHNCQUFULEdBQW1DO0FBQy9CL0UsYUFBVyxDQUFDeUYsUUFBWixDQUFxQixDQUFyQixLQUEyQnpGLFdBQVcsQ0FBQ3lGLFFBQVosQ0FBcUIsQ0FBckIsRUFBd0I5RCxTQUF4QixDQUFrQ0UsR0FBbEMsQ0FBc0MsVUFBdEMsQ0FBM0I7QUFDSDs7QUFDRCxTQUFTVCxlQUFULENBQTBCQyxHQUExQixFQUErQjtBQUMzQixNQUFJcUUsU0FBUyxHQUFHL0YsS0FBSyxDQUFDd0UsTUFBTixDQUFhQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0MsV0FBRixLQUFrQi9ELFVBQXBDLENBQWhCO0FBQ0EsTUFBSXFGLFNBQVMsR0FBR0QsU0FBUyxDQUFDdkIsTUFBVixDQUFpQkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNuQixLQUFGLENBQVEyQyxRQUFSLENBQWlCdkUsR0FBRyxDQUFDQyxNQUFKLENBQVdvQyxLQUE1QixDQUF0QixDQUFoQjtBQUNBOUMscUJBQW1CLENBQUMrRSxTQUFELEVBQVlyRixVQUFaLENBQW5CO0FBQ0g7O0FBR0QsU0FBU1EsZUFBVCxHQUE0QjtBQUN4QixNQUFJK0UsVUFBVSxHQUFHaEcsUUFBUSxDQUFDaUcsZ0JBQVQsQ0FBMEIsWUFBMUIsQ0FBakI7QUFDQSxNQUFJQyxTQUFTLEdBQUdsRyxRQUFRLENBQUNpRyxnQkFBVCxDQUEwQixZQUExQixDQUFoQjtBQUNBRSxnQkFBYyxDQUFDSCxVQUFELENBQWQ7QUFDQUksZUFBYSxDQUFDRixTQUFELENBQWI7QUFDSDs7QUFDRCxTQUFTQyxjQUFULENBQXlCSCxVQUF6QixFQUFxQztBQUNqQyxPQUFLLE1BQU1LLFNBQVgsSUFBd0JMLFVBQXhCLEVBQW9DO0FBQ2hDTSxpQkFBYSxDQUFDRCxTQUFELENBQWI7QUFDSDtBQUNKOztBQUNELFNBQVNELGFBQVQsQ0FBd0JGLFNBQXhCLEVBQW1DO0FBQy9CLE9BQUssTUFBTUssUUFBWCxJQUF1QkwsU0FBdkIsRUFBa0M7QUFDOUJNLGdCQUFZLENBQUNELFFBQUQsQ0FBWjtBQUNIO0FBQ0o7O0FBQ0QsU0FBU0QsYUFBVCxDQUF3QkQsU0FBeEIsRUFBbUM7QUFDL0JBLFdBQVMsQ0FBQ25GLGdCQUFWLENBQTJCLFdBQTNCLEVBQXdDdUYsZ0JBQXhDO0FBQ0FKLFdBQVMsQ0FBQ25GLGdCQUFWLENBQTJCLFNBQTNCLEVBQXNDd0YsY0FBdEM7QUFDQUwsV0FBUyxDQUFDTSxZQUFWLENBQXVCLFdBQXZCLEVBQW9DLE1BQXBDO0FBQ0g7O0FBQ0QsU0FBU0gsWUFBVCxDQUF1QkQsUUFBdkIsRUFBaUM7QUFDN0JBLFVBQVEsQ0FBQ3JGLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDMEYsb0JBQXZDO0FBQ0FMLFVBQVEsQ0FBQ3JGLGdCQUFULENBQTBCLFVBQTFCLEVBQXNDMkYsbUJBQXRDO0FBQ0FOLFVBQVEsQ0FBQ3JGLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDNEYsb0JBQXZDO0FBQ0FQLFVBQVEsQ0FBQ3JGLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDNkYsbUJBQWxDO0FBQ0g7O0FBQ0QsU0FBU04sZ0JBQVQsQ0FBMEJqRixHQUExQixFQUErQjtBQUMzQndGLHVCQUFxQjtBQUNyQixPQUFLbEYsU0FBTCxDQUFlRSxHQUFmLENBQW1CLFNBQW5CO0FBQ0FSLEtBQUcsQ0FBQ3lGLFlBQUosQ0FBaUJDLE9BQWpCLENBQXlCLE1BQXpCLEVBQWlDLFNBQWpDO0FBQ0ExRixLQUFHLENBQUN5RixZQUFKLENBQWlCQyxPQUFqQixDQUF5QixRQUF6QixFQUFtQzFGLEdBQUcsQ0FBQ0MsTUFBSixDQUFXRyxPQUFYLENBQW1CakIsRUFBdEQ7QUFDQWEsS0FBRyxDQUFDeUYsWUFBSixDQUFpQkMsT0FBakIsQ0FBeUIsT0FBekIsRUFBa0MxRixHQUFHLENBQUNDLE1BQUosQ0FBV0csT0FBWCxDQUFtQm9CLEtBQXJEO0FBQ0g7O0FBQ0QsU0FBUzBELGNBQVQsQ0FBeUJsRixHQUF6QixFQUE4QjtBQUMxQndGLHVCQUFxQixDQUFDLEtBQUQsQ0FBckI7QUFDSDs7QUFDRCxTQUFTSixvQkFBVCxDQUE4QnBGLEdBQTlCLEVBQW1DO0FBQy9CLE1BQUlBLEdBQUcsQ0FBQ3lGLFlBQUosQ0FBaUJFLEtBQWpCLENBQXVCcEIsUUFBdkIsQ0FBZ0MsTUFBaEMsQ0FBSixFQUE2QztBQUN6QyxTQUFLakUsU0FBTCxDQUFlRSxHQUFmLENBQW1CLFdBQW5CO0FBQ0g7O0FBQ0RSLEtBQUcsQ0FBQzRGLGNBQUo7QUFDSDs7QUFDRCxTQUFTUCxtQkFBVCxDQUE4QnJGLEdBQTlCLEVBQW1DO0FBQy9CQSxLQUFHLENBQUM0RixjQUFKO0FBQ0g7O0FBQ0QsU0FBU04sb0JBQVQsQ0FBK0J0RixHQUEvQixFQUFvQztBQUNoQyxNQUFJQSxHQUFHLENBQUN5RixZQUFKLENBQWlCRSxLQUFqQixDQUF1QnBCLFFBQXZCLENBQWdDLE1BQWhDLEtBQ0F2RSxHQUFHLENBQUM2RixhQUFKLEtBQXNCLElBRHRCLElBRUE3RixHQUFHLENBQUM4RixhQUFKLEtBQXNCOUYsR0FBRyxDQUFDNkYsYUFBSixDQUFrQkUsT0FBbEIsQ0FBMEIsWUFBMUIsQ0FGMUIsRUFFbUU7QUFDL0QsU0FBS3pGLFNBQUwsQ0FBZUMsTUFBZixDQUFzQixXQUF0QjtBQUNIO0FBQ0o7O0FBQ0QsU0FBU2dGLG1CQUFULENBQThCdkYsR0FBOUIsRUFBbUM7QUFDL0IsTUFBSUcsYUFBYSxHQUFHSCxHQUFHLENBQUM4RixhQUFKLENBQWtCMUYsT0FBbEIsQ0FBMEJqQixFQUE5QztBQUNBLE1BQUk2RyxXQUFXLEdBQUd4SCxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBbEI7QUFDQSxNQUFJd0gsY0FBYyxHQUFHakcsR0FBRyxDQUFDeUYsWUFBSixDQUFpQlMsT0FBakIsQ0FBeUIsT0FBekIsQ0FBckI7QUFDQSxNQUFJQyxlQUFlLEdBQUduRyxHQUFHLENBQUN5RixZQUFKLENBQWlCUyxPQUFqQixDQUF5QixRQUF6QixDQUF0Qjs7QUFFQSxNQUFJL0YsYUFBYSxLQUFLOEYsY0FBdEIsRUFBc0M7QUFDbENELGVBQVcsQ0FBQzFGLFNBQVosQ0FBc0JDLE1BQXRCLENBQTZCLFNBQTdCO0FBQ0E7QUFDSCxHQUhELE1BR087QUFDSDZGLGlCQUFhLENBQUNqRyxhQUFELEVBQWdCZ0csZUFBaEIsQ0FBYjtBQUNBRSxrQkFBYyxDQUFDRixlQUFELENBQWQ7QUFDQUcsa0JBQWMsQ0FBQ0wsY0FBRCxDQUFkO0FBQ0g7O0FBQ0RqRyxLQUFHLENBQUM0RixjQUFKO0FBQ0g7O0FBQ0QsU0FBU1UsY0FBVCxDQUF5QkMsS0FBekIsRUFBZ0M7QUFDNUIsTUFBSTVGLFlBQVksR0FBR25DLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixXQUF2QixDQUFuQjs7QUFDQSxNQUFJLENBQUNrQyxZQUFMLEVBQW1CO0FBQ2YrQywwQkFBc0I7QUFDdEJsRSxnQ0FBNEIsQ0FBQ2xCLEtBQUQsRUFBUWlJLEtBQVIsQ0FBNUI7QUFDSDtBQUVKOztBQUNELFNBQVNILGFBQVQsQ0FBd0I1RSxLQUF4QixFQUErQjBCLE1BQS9CLEVBQXVDO0FBQ25DLE9BQUssSUFBSUQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzNFLEtBQUssQ0FBQzZFLE1BQTFCLEVBQWtDRixDQUFDLEVBQW5DLEVBQXVDO0FBQ25DLFFBQUkzRSxLQUFLLENBQUMyRSxDQUFELENBQUwsQ0FBUzlELEVBQVQsS0FBZ0IrRCxNQUFwQixFQUE0QjtBQUN4QjVFLFdBQUssQ0FBQzJFLENBQUQsQ0FBTCxDQUFTRCxXQUFULEdBQXVCeEIsS0FBdkI7QUFDSDtBQUNKOztBQUNEK0IsYUFBVztBQUNkOztBQUNELFNBQVM4QyxjQUFULENBQXlCbkQsTUFBekIsRUFBaUM7QUFDN0IsTUFBSXNELFdBQVcsR0FBR2hJLFFBQVEsQ0FBQ0MsYUFBVCxDQUF3QiwrQkFBOEJ5RSxNQUFPLElBQTdELENBQWxCO0FBQ0FzRCxhQUFXLENBQUNqRyxNQUFaO0FBRUg7O0FBQ0QsU0FBU2lGLHFCQUFULENBQWdDaUIsU0FBUyxHQUFHLElBQTVDLEVBQWtEO0FBQzlDLFFBQU0vQixTQUFTLEdBQUdsRyxRQUFRLENBQUNpRyxnQkFBVCxDQUEwQixZQUExQixDQUFsQjs7QUFDQSxPQUFLLE1BQU1NLFFBQVgsSUFBdUJMLFNBQXZCLEVBQWtDO0FBQzlCLFFBQUkrQixTQUFKLEVBQWU7QUFDWDFCLGNBQVEsQ0FBQ3pFLFNBQVQsQ0FBbUJFLEdBQW5CLENBQXVCLGFBQXZCO0FBQ0gsS0FGRCxNQUVPO0FBQ0h1RSxjQUFRLENBQUN6RSxTQUFULENBQW1CQyxNQUFuQixDQUEwQixhQUExQjtBQUNBd0UsY0FBUSxDQUFDekUsU0FBVCxDQUFtQkMsTUFBbkIsQ0FBMEIsV0FBMUI7QUFDSDtBQUNKO0FBQ0osQyIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJcclxuXHJcbmxldCBub3RlcyA9IFtdO1xyXG5jb25zdCBjYXRlZ29yaWVzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcmllc19fbGlzdCcpO1xyXG5jb25zdCBub3Rlc0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVzJyk7XHJcbmNvbnN0IG5vdGVzTGlzdEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVzX19saXN0Jyk7XHJcbmNvbnN0IG5vdGVFZGl0b3JFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0b3InKTtcclxuY29uc3QgYWRkTmV3Tm90ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub3Rlc19fYWRkLW5ldy1ub3RlLWJ0bicpO1xyXG5jb25zdCBkZWxOb3RlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1idG4nKTtcclxuY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90ZXNfX3NlYXJjaF9faW5wdXQnKTtcclxuY29uc3QgY2F0TWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yaWVzX19tZW51LWJ0bicpO1xyXG5sZXQgY3VycmVudENhdCA9IGNhdGVnb3JpZXNbMF0uaWQ7XHJcblxyXG5pbml0KCk7XHJcblxyXG5mdW5jdGlvbiBpbml0ICgpIHtcclxuICAgIGluaXRTdG9yYWdlKCk7XHJcbiAgICByZW5kZXJDYXRlZ29yeUxpc3RJdGVtcyhjYXRlZ29yaWVzLCBjdXJyZW50Q2F0KTtcclxuICAgIHJlbmRlck5vdGVMaXN0SXRlbXMobm90ZXMsIGN1cnJlbnRDYXQpO1xyXG4gICAgZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvcihub3RlcywgY3VycmVudENhdCk7XHJcbiAgICBpbml0RHJhZ0FuZERyb3AoKTtcclxuICAgIGNhdGVnb3JpZXNFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNlbGVjdENhdGVnb3J5KTtcclxuICAgIG5vdGVzTGlzdEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZWN0Tm90ZSk7XHJcbiAgICBhZGROZXdOb3RlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY3JlYXRlTmV3Tm90ZSk7XHJcbiAgICBkZWxOb3RlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0RlbGV0ZSk7XHJcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHNlYXJjaEN1cnJOb3Rlcyk7XHJcbn1cclxuZnVuY3Rpb24gc2VsZWN0Q2F0ZWdvcnkgKGV2dCkge1xyXG4gICAgaWYgKGV2dC50YXJnZXQubm9kZU5hbWUgIT0gJ0xJJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBzZWxlY3RlZENhdElkID0gZXZ0LnRhcmdldC5kYXRhc2V0LmlkO1xyXG4gICAgbGV0IHNlbGVjdGVkQ2F0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnItY2F0Jyk7XHJcbiAgICBpZiAoc2VsZWN0ZWRDYXQpIHtcclxuICAgICAgICBzZWxlY3RlZENhdC5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyLWNhdCcpO1xyXG4gICAgfVxyXG4gICAgY3VycmVudENhdCA9IHNlbGVjdGVkQ2F0SWQ7XHJcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2N1cnItY2F0Jyk7XHJcbiAgICByZW5kZXJOb3RlTGlzdEl0ZW1zKG5vdGVzLCBzZWxlY3RlZENhdElkKTtcclxuICAgIG5vdGVFZGl0b3JFbC5pbm5lckhUTUwgPSAnJztcclxuICAgIGRpc3BsYXlGaXJzdE5vdGVJbk5vdGVFZGl0b3Iobm90ZXMsIGN1cnJlbnRDYXQpO1xyXG4gICAgaW5pdERyYWdBbmREcm9wKCk7XHJcbn1cclxuZnVuY3Rpb24gc2VsZWN0Tm90ZSAoZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LnRhcmdldC5wYXJlbnRFbGVtZW50Lm5vZGVOYW1lICE9ICdMSScpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgaWQgPSBldnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuZGF0YXNldC5pZDtcclxuICAgIGxldCBzZWxlY3RlZE5vdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQnKTtcclxuICAgIGlmIChzZWxlY3RlZE5vdGUpIHtcclxuICAgICAgICBzZWxlY3RlZE5vdGUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICAgIGV2dC50YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICByZW5kZXJOb3RlRWRpdG9yKG5vdGVzLCBpZCk7XHJcbn1cclxuZnVuY3Rpb24gYnVpbGRDYXRlZ29yeUxpc3RJdGVtIChjYXROYW1lLCBpZCwgaXNTZWxlY3RlZCkge1xyXG4gICAgbGV0IGNhdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgIGxldCBjYXRUeHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjYXROYW1lKTtcclxuICAgIGNhdEVsLmNsYXNzTmFtZSA9ICdjYXRlZ29yaWVzX19saXN0X19pdGVtJztcclxuICAgIGNhdEVsLmNsYXNzTGlzdC5hZGQoJ2Ryb3Atem9uZScpXHJcbiAgICBpc1NlbGVjdGVkICYmIGNhdEVsLmNsYXNzTGlzdC5hZGQoJ2N1cnItY2F0Jyk7XHJcbiAgICBjYXRFbC5kYXRhc2V0LmlkID0gaWQ7XHJcbiAgICBjYXRFbC5hcHBlbmRDaGlsZChjYXRUeHQpO1xyXG4gICAgcmV0dXJuIGNhdEVsO1xyXG59XHJcbmZ1bmN0aW9uIGJ1aWxkTm90ZUxpc3RJdGVtIChkYXRhLCBjYXRJZCwgaXNTZWxlY3RlZCkge1xyXG4gICAgbGV0IG5vdGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICBsZXQgbm90ZVRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGxldCBub3RlVGl0bGVUeHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhLnRpdGxlKTtcclxuICAgIGxldCBub3RlQm9keUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBsZXQgbm90ZUJvZHlUeHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhLmJvZHkpO1xyXG4gICAgbm90ZUVsLmNsYXNzTmFtZSA9ICdub3Rlc19fbGlzdF9faXRlbSc7XHJcbiAgICBub3RlRWwuY2xhc3NMaXN0LmFkZCgnZHJhZ2dhYmxlJyk7XHJcbiAgICBub3RlVGl0bGVFbC5jbGFzc05hbWUgPSAnbm90ZXNfX2xpc3RfX2l0ZW1fX3RpdGxlJztcclxuICAgIG5vdGVCb2R5RWwuY2xhc3NOYW1lID0gJ25vdGVzX19saXN0X19pdGVtX19ib2R5JztcclxuICAgIGlzU2VsZWN0ZWQgJiYgbm90ZUVsLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICBub3RlRWwuZGF0YXNldC5pZCA9IGRhdGEuaWQ7XHJcbiAgICBub3RlRWwuZGF0YXNldC5jYXRJZCA9IGNhdElkO1xyXG4gICAgbm90ZUVsLmFwcGVuZENoaWxkKG5vdGVUaXRsZUVsKTtcclxuICAgIG5vdGVUaXRsZUVsLmFwcGVuZENoaWxkKG5vdGVUaXRsZVR4dCk7XHJcbiAgICBub3RlRWwuYXBwZW5kQ2hpbGQobm90ZUJvZHlFbCk7XHJcbiAgICBub3RlQm9keUVsLmFwcGVuZENoaWxkKG5vdGVCb2R5VHh0KTtcclxuICAgIHJldHVybiBub3RlRWw7XHJcbn1cclxuZnVuY3Rpb24gYnVpbGROb3RlRWRpdG9yIChub3RlKSB7XHJcbiAgICBsZXQgZWRDb250RnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoJ2RpdicpO1xyXG4gICAgbGV0IGVkVGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICBlZFRpdGxlRWwudmFsdWUgPSBub3RlLnRpdGxlO1xyXG4gICAgbGV0IGVkQm9keUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcclxuICAgIGVkQm9keUVsLnZhbHVlID0gbm90ZS5ib2R5O1xyXG4gICAgZWRUaXRsZUVsLmNsYXNzTmFtZSA9ICdlZGl0b3JfX3RpdGxlJztcclxuICAgIGVkQm9keUVsLmNsYXNzTmFtZSA9ICdlZGl0b3JfX2JvZHknO1xyXG4gICAgZWRUaXRsZUVsLmRhdGFzZXQuaWQgPSBub3RlLmlkO1xyXG4gICAgZWRCb2R5RWwuZGF0YXNldC5pZCA9IG5vdGUuaWQ7XHJcbiAgICBlZENvbnRGcmFnLmFwcGVuZENoaWxkKGVkVGl0bGVFbCk7XHJcbiAgICBlZENvbnRGcmFnLmFwcGVuZENoaWxkKGVkQm9keUVsKTtcclxuICAgIGVkVGl0bGVFbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9uSW5wdXRTYXZlTm90ZVRpdGxlKTtcclxuICAgIGVkQm9keUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0Jywgb25JbnB1dFNhdmVOb3RlQm9keSk7XHJcbiAgICByZXR1cm4gZWRDb250RnJhZztcclxufVxyXG5mdW5jdGlvbiByZW5kZXJDYXRlZ29yeUxpc3RJdGVtcyAoY2F0ZWdvcmllcykge1xyXG4gICAgY2F0ZWdvcmllcy5mb3JFYWNoKChjLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXNFbC5hcHBlbmRDaGlsZChidWlsZENhdGVnb3J5TGlzdEl0ZW0oYy5uYW1lLCBjLmlkLCB0cnVlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2F0ZWdvcmllc0VsLmFwcGVuZENoaWxkKGJ1aWxkQ2F0ZWdvcnlMaXN0SXRlbShjLm5hbWUsIGMuaWQpKVxyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyTm90ZUxpc3RJdGVtcyAobm90ZXMsIGNhdElkKSB7XHJcbiAgICBub3Rlc0xpc3RFbC5pbm5lckhUTUwgPSAnJztcclxuICAgIGNvbnN0IGNhdE5vdGVzID0gbm90ZXMuZmlsdGVyKG4gPT4gbi5jYXRlZ29yeV9pZCA9PT0gY2F0SWQpO1xyXG4gICAgY2F0Tm90ZXMuZm9yRWFjaCgobiwgaSkgPT4ge1xyXG4gICAgICAgIGlmKGkgPT0gMCkge1xyXG4gICAgICAgICAgICBub3Rlc0xpc3RFbC5hcHBlbmRDaGlsZChidWlsZE5vdGVMaXN0SXRlbShuLCBjYXRJZCwgdHJ1ZSkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm90ZXNMaXN0RWwuYXBwZW5kQ2hpbGQoYnVpbGROb3RlTGlzdEl0ZW0obiwgY2F0SWQpKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlck5vdGVFZGl0b3IgKG5vdGVzLCBub3RlSWQpIHtcclxuICAgIG5vdGVFZGl0b3JFbC5pbm5lckhUTUwgPSAnJztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm90ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobm90ZUlkID09PSBub3Rlc1tpXS5pZCkge1xyXG4gICAgICAgICAgICBub3RlRWRpdG9yRWwuYXBwZW5kQ2hpbGQoYnVpbGROb3RlRWRpdG9yKG5vdGVzW2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVOZXdOb3RlICgpIHtcclxuICAgIG5vdGVFZGl0b3JFbC5pbm5lckhUTUwgPSAnJztcclxuICAgIGxldCBuZXdOb3RlID0ge1xyXG4gICAgICAgIGlkOiBnZW5lcmF0ZVJhbmRvbUlkKCksXHJcbiAgICAgICAgdGl0bGU6ICduZXcgbm90ZSB0aXRsZScsXHJcbiAgICAgICAgYm9keTogJ25ldyBub3RlIGJvZHknLFxyXG4gICAgICAgIGNhdGVnb3J5X2lkOiBjdXJyZW50Q2F0XHJcbiAgICB9XHJcbiAgICBub3Rlcy51bnNoaWZ0KG5ld05vdGUpO1xyXG4gICAgcmVuZGVyTm90ZUxpc3RJdGVtcyhub3RlcywgY3VycmVudENhdCk7XHJcbiAgICByZW5kZXJOb3RlRWRpdG9yKG5vdGVzLCBuZXdOb3RlLmlkKTtcclxuICAgIHBlcnNpc3REYXRhKCk7XHJcbn1cclxuZnVuY3Rpb24gb25DbGlja0RlbGV0ZSAoZXZ0KSB7XHJcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0b3JfX3RpdGxlJyk7XHJcbiAgICBjb25zdCBpZCA9IHRpdGxlLmRhdGFzZXQuaWQ7XHJcbiAgICBub3RlcyA9IGRlbGV0ZU5vdGUobm90ZXMsIGlkKTtcclxuICAgIGRlbGV0ZU5vdGVGcm9tRG9tKGlkKTtcclxuICAgIGhpZ2hsaWdodEZpcnN0Tm90ZUl0ZW0oKTtcclxuICAgIHBlcnNpc3REYXRhKCk7XHJcbiAgICBpZiAobm90ZXNMaXN0RWwuaW5uZXJIVE1MID09PSAnJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvcihub3RlcywgY3VycmVudENhdCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZGVsZXRlTm90ZSAobm90ZXMsIGlkKSB7XHJcbiAgICByZXR1cm4gbm90ZXMuZmlsdGVyKG4gPT4gbi5pZCAhPSBpZCk7XHJcbn1cclxuZnVuY3Rpb24gZGVsZXRlTm90ZUZyb21Eb20gKGlkKSB7XHJcbiAgICBsZXQgbm90ZUxpc3RJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLm5vdGVzX19saXN0X19pdGVtW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG4gICAgbm90ZUxpc3RJdGVtLnJlbW92ZSgpO1xyXG4gICAgbm90ZUVkaXRvckVsLmlubmVySFRNTCA9ICcnO1xyXG59XHJcbmZ1bmN0aW9uIG9uSW5wdXRTYXZlTm90ZVRpdGxlIChldnQpIHtcclxuICAgIGxldCBuZXdUaXRsZSA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICBsZXQgbm90ZUlEID0gZXZ0LnRhcmdldC5kYXRhc2V0LmlkO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub3Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChub3Rlc1tpXS5pZCA9PT0gbm90ZUlEKSB7XHJcbiAgICAgICAgICAgIG5vdGVzW2ldLnRpdGxlID0gbmV3VGl0bGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGVyc2lzdERhdGEoKTtcclxuICAgIHVwZGF0ZUN1cnJlbnROb3Rlc0xpc3RJdGVtVGl0bGUobmV3VGl0bGUpO1xyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnROb3Rlc0xpc3RJdGVtVGl0bGUgKHZhbCkge1xyXG4gICAgbGV0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkIC5ub3Rlc19fbGlzdF9faXRlbV9fdGl0bGUnKTtcclxuICAgIHRpdGxlLmlubmVyVGV4dCA9IHZhbDtcclxufVxyXG5mdW5jdGlvbiBvbklucHV0U2F2ZU5vdGVCb2R5IChldnQpIHtcclxuICAgIGxldCBuZXdCb2R5ID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgIGxldCBub3RlSUQgPSBldnQudGFyZ2V0LmRhdGFzZXQuaWQ7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vdGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG5vdGVzW2ldLmlkID09PSBub3RlSUQpIHtcclxuICAgICAgICAgICAgbm90ZXNbaV0uYm9keSA9IG5ld0JvZHk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGVyc2lzdERhdGEoKTtcclxuICAgIHVwZGF0ZUN1cnJlbnROb3Rlc0xpc3RJdGVtQm9keShuZXdCb2R5KTtcclxufVxyXG5mdW5jdGlvbiB1cGRhdGVDdXJyZW50Tm90ZXNMaXN0SXRlbUJvZHkgKHZhbCkge1xyXG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQgLm5vdGVzX19saXN0X19pdGVtX19ib2R5Jyk7XHJcbiAgICBib2R5LmlubmVyVGV4dCA9IHZhbDtcclxufVxyXG5mdW5jdGlvbiBkaXNwbGF5Rmlyc3ROb3RlSW5Ob3RlRWRpdG9yIChub3RlcywgY2F0SWQpIHtcclxuICAgIGNhdElkID0gY3VycmVudENhdDtcclxuICAgIGxldCBmaXJzdE5vdGUgPSBub3Rlcy5maWx0ZXIobiA9PiAobi5jYXRlZ29yeV9pZCA9PT0gY2F0SWQpKTtcclxuICAgIGlmIChub3Rlc0xpc3RFbC5pbm5lckhUTUwgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgIHJlbmRlck5vdGVFZGl0b3Iobm90ZXMsIGZpcnN0Tm90ZVswXS5pZClcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBoaWdobGlnaHRGaXJzdE5vdGVJdGVtICgpIHtcclxuICAgIG5vdGVzTGlzdEVsLmNoaWxkcmVuWzBdICYmIG5vdGVzTGlzdEVsLmNoaWxkcmVuWzBdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbn1cclxuZnVuY3Rpb24gc2VhcmNoQ3Vyck5vdGVzIChldnQpIHtcclxuICAgIGxldCBjdXJyTm90ZXMgPSBub3Rlcy5maWx0ZXIobiA9PiBuLmNhdGVnb3J5X2lkID09PSBjdXJyZW50Q2F0KTtcclxuICAgIGxldCBzZWFyY2hSZXMgPSBjdXJyTm90ZXMuZmlsdGVyKG4gPT4gbi50aXRsZS5pbmNsdWRlcyhldnQudGFyZ2V0LnZhbHVlKSk7XHJcbiAgICByZW5kZXJOb3RlTGlzdEl0ZW1zKHNlYXJjaFJlcywgY3VycmVudENhdCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0RHJhZ0FuZERyb3AgKCkge1xyXG4gICAgbGV0IGRyYWdnYWJsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJhZ2dhYmxlJyk7XHJcbiAgICBsZXQgZHJvcFpvbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Atem9uZScpO1xyXG4gICAgaW5pdERyYWdnYWJsZXMoZHJhZ2dhYmxlcyk7XHJcbiAgICBpbml0RHJvcFpvbmVzKGRyb3Bab25lcyk7XHJcbn1cclxuZnVuY3Rpb24gaW5pdERyYWdnYWJsZXMgKGRyYWdnYWJsZXMpIHtcclxuICAgIGZvciAoY29uc3QgZHJhZ2dhYmxlIG9mIGRyYWdnYWJsZXMpIHtcclxuICAgICAgICBpbml0RHJhZ2dhYmxlKGRyYWdnYWJsZSlcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbml0RHJvcFpvbmVzIChkcm9wWm9uZXMpIHtcclxuICAgIGZvciAoY29uc3QgZHJvcFpvbmUgb2YgZHJvcFpvbmVzKSB7XHJcbiAgICAgICAgaW5pdERyb3Bab25lKGRyb3Bab25lKVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGluaXREcmFnZ2FibGUgKGRyYWdnYWJsZSkge1xyXG4gICAgZHJhZ2dhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGRyYWdTdGFydEhhbmRsZXIpO1xyXG4gICAgZHJhZ2dhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCBkcmFnRW5kSGFuZGxlcik7XHJcbiAgICBkcmFnZ2FibGUuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCAndHJ1ZScpO1xyXG59XHJcbmZ1bmN0aW9uIGluaXREcm9wWm9uZSAoZHJvcFpvbmUpIHtcclxuICAgIGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGRyb3Bab25lRW50ZXJIYW5kbGVyKTtcclxuICAgIGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZHJvcFpvbmVPdmVySGFuZGxlcik7XHJcbiAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBkcm9wWm9uZUxlYXZlSGFuZGxlcik7XHJcbiAgICBkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZHJvcFpvbmVEcm9wSGFuZGxlcik7XHJcbn1cclxuZnVuY3Rpb24gZHJhZ1N0YXJ0SGFuZGxlcihldnQpIHtcclxuICAgIHNldERyb3Bab25lc0hpZ2hsaWdodCgpO1xyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdkcmFnZ2VkJyk7XHJcbiAgICBldnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ3R5cGUnLCAnZHJhZ2dlZCcpO1xyXG4gICAgZXZ0LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdub3RlSWQnLCBldnQudGFyZ2V0LmRhdGFzZXQuaWQpO1xyXG4gICAgZXZ0LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdjYXRJZCcsIGV2dC50YXJnZXQuZGF0YXNldC5jYXRJZCk7XHJcbn1cclxuZnVuY3Rpb24gZHJhZ0VuZEhhbmRsZXIgKGV2dCkge1xyXG4gICAgc2V0RHJvcFpvbmVzSGlnaGxpZ2h0KGZhbHNlKTtcclxufVxyXG5mdW5jdGlvbiBkcm9wWm9uZUVudGVySGFuZGxlcihldnQpIHtcclxuICAgIGlmIChldnQuZGF0YVRyYW5zZmVyLnR5cGVzLmluY2x1ZGVzKCd0eXBlJykpIHtcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ292ZXItem9uZScpO1xyXG4gICAgfVxyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbn1cclxuZnVuY3Rpb24gZHJvcFpvbmVPdmVySGFuZGxlciAoZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxufVxyXG5mdW5jdGlvbiBkcm9wWm9uZUxlYXZlSGFuZGxlciAoZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LmRhdGFUcmFuc2Zlci50eXBlcy5pbmNsdWRlcygndHlwZScpICYmXHJcbiAgICAgICAgZXZ0LnJlbGF0ZWRUYXJnZXQgIT09IG51bGwgJiZcclxuICAgICAgICBldnQuY3VycmVudFRhcmdldCAhPT0gZXZ0LnJlbGF0ZWRUYXJnZXQuY2xvc2VzdCgnLmRyb3Atem9uZScpKSB7XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdvdmVyLXpvbmUnKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBkcm9wWm9uZURyb3BIYW5kbGVyIChldnQpIHtcclxuICAgIGxldCBzZWxlY3RlZENhdElkID0gZXZ0LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZDtcclxuICAgIGxldCBkcmFnZ2VkSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcmFnZ2VkJylcclxuICAgIGxldCBkcmFnZ2VkRWxDYXRJZCA9IGV2dC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnY2F0SWQnKTtcclxuICAgIGxldCBkcmFnZ2VkRWxOb3RlSWQgPSBldnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ25vdGVJZCcpO1xyXG5cclxuICAgIGlmIChzZWxlY3RlZENhdElkID09PSBkcmFnZ2VkRWxDYXRJZCkge1xyXG4gICAgICAgIGRyYWdnZWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnZWQnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNoYW5nZU5vdGVDYXQoc2VsZWN0ZWRDYXRJZCwgZHJhZ2dlZEVsTm90ZUlkKTtcclxuICAgICAgICByZW1vdmVOb3RlTm9kZShkcmFnZ2VkRWxOb3RlSWQpO1xyXG4gICAgICAgIGNoZWNrU2VsZWN0aW9uKGRyYWdnZWRFbENhdElkKTtcclxuICAgIH1cclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrU2VsZWN0aW9uIChjYXRJRCkge1xyXG4gICAgbGV0IHNlbGVjdGVkTm90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpO1xyXG4gICAgaWYgKCFzZWxlY3RlZE5vdGUpIHtcclxuICAgICAgICBoaWdobGlnaHRGaXJzdE5vdGVJdGVtKCk7XHJcbiAgICAgICAgZGlzcGxheUZpcnN0Tm90ZUluTm90ZUVkaXRvcihub3RlcywgY2F0SUQpXHJcbiAgICB9XHJcblxyXG59XHJcbmZ1bmN0aW9uIGNoYW5nZU5vdGVDYXQgKGNhdElkLCBub3RlSWQpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm90ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobm90ZXNbaV0uaWQgPT09IG5vdGVJZCkge1xyXG4gICAgICAgICAgICBub3Rlc1tpXS5jYXRlZ29yeV9pZCA9IGNhdElkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGVyc2lzdERhdGEoKTtcclxufVxyXG5mdW5jdGlvbiByZW1vdmVOb3RlTm9kZSAobm90ZUlkKSB7XHJcbiAgICBsZXQgZHJhZ2dlZE5vdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAubm90ZXNfX2xpc3RfX2l0ZW1bZGF0YS1pZD1cIiR7bm90ZUlkfVwiXWApO1xyXG4gICAgZHJhZ2dlZE5vdGUucmVtb3ZlKCk7XHJcblxyXG59XHJcbmZ1bmN0aW9uIHNldERyb3Bab25lc0hpZ2hsaWdodCAoaGlnaGxpZ2h0ID0gdHJ1ZSkge1xyXG4gICAgY29uc3QgZHJvcFpvbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Atem9uZScpO1xyXG4gICAgZm9yIChjb25zdCBkcm9wWm9uZSBvZiBkcm9wWm9uZXMpIHtcclxuICAgICAgICBpZiAoaGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgIGRyb3Bab25lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZS16b25lJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZHJvcFpvbmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlLXpvbmUnKTtcclxuICAgICAgICAgICAgZHJvcFpvbmUuY2xhc3NMaXN0LnJlbW92ZSgnb3Zlci16b25lJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=