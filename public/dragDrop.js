// function initDragAndDrop () {
//     let draggables = document.querySelectorAll('.draggable');
//     let dropZones = document.querySelectorAll('.drop-zone');
//     initDraggables(draggables);
//     initDropZones(dropZones);
// }
// function initDraggables (draggables) {
//     for (const draggable of draggables) {
//         initDraggable(draggable)
//     }
// }
// function initDropZones (dropZones) {
//     for (const dropZone of dropZones) {
//         initDropZone(dropZone)
//     }
// }
// function initDraggable (draggable) {
//     draggable.addEventListener('dragstart', dragstartHandler);
//     draggable.addEventListener('drag', dragHandler);
//     draggable.addEventListener('dragend', dragEndHandler);
//     draggable.setAttribute('draggable', 'true');
// }
// function initDropZone (dropZone) {
//     dropZone.addEventListener('dragenter', dropZoneEnterHandler);
//     dropZone.addEventListener('dragover', dropZoneOverHandler);
//     dropZone.addEventListener('dragleave', dropZoneLeaveHandler);
//     dropZone.addEventListener('drop', dropZoneDropHandler);
// }
// function dragstartHandler(evt) {
//     setDropZonesHighlight();
//     this.classList.add('dragged');
//     evt.dataTransfer.setData('type', 'dragged');
//     evt.dataTransfer.setData('noteId', evt.target.dataset.id);
//     evt.dataTransfer.setData('catId', evt.target.dataset.catId);
// }
// function dragHandler () {
//     // can do something while in drag mode eg grey out the rest of the screen
// }
// function dragEndHandler (evt) {
//     setDropZonesHighlight(false);
// }
// function dropZoneEnterHandler(evt) {
//     if (evt.dataTransfer.types.includes('type')) {
//         this.classList.add('over-zone');
//     }
//     evt.preventDefault();
// }
// function dropZoneOverHandler (evt) {
//     evt.preventDefault();
// }
// function dropZoneLeaveHandler (evt) {
//     if (evt.dataTransfer.types.includes('type') &&
//         evt.relatedTarget !== null &&
//         evt.currentTarget !== evt.relatedTarget.closest('.drop-zone')) {
//         this.classList.remove('over-zone');
//     }
// }
// function dropZoneDropHandler (evt) {
//     let selectedCatId = evt.currentTarget.dataset.id;
//     let draggedItem = document.querySelector('.dragged')
//     let draggedElCatId = evt.dataTransfer.getData('catId');
//     let draggedElNoteId = evt.dataTransfer.getData('noteId');
//     if (selectedCatId === draggedElCatId) {
//         draggedItem.classList.remove('dragged');
//         return;
//     } else {
//         onDropChangeNoteCat(selectedCatId, draggedElNoteId);
//         onDropDelFromCurrNoteList(draggedElNoteId, draggedElCatId);
//     }
//     evt.preventDefault();
// }
// function onDropChangeNoteCat (catId, noteId) {
//     for (var i = 0; i < notes.length; i++) {
//         if (notes[i].id === noteId) {
//             notes[i].category_id = catId
//         }
//     }
//     persistData();
// }
// function onDropDelFromCurrNoteList (noteId, catId) {
//     let draggedNote = document.querySelector(`.notes__list__item[data-id="${noteId}"]`);
//     draggedNote.remove();
//     highlightFirstNote();
//     displayFirstNoteInEd(notes, catId)
// }
// function setDropZonesHighlight (highlight = true) {
//     const dropZones = document.querySelectorAll('.drop-zone');
//     for (const dropZone of dropZones) {
//         if (highlight) {
//             dropZone.classList.add('active-zone');
//         } else {
//             dropZone.classList.remove('active-zone');
//             dropZone.classList.remove('over-zone');
//         }
//     }
// }