function generateRandomId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function initStorage () {
  if (localStorage.getItem('notes')) {
      var json = localStorage.getItem('notes');
      notes = JSON.parse(json).notes;
  } else {
      localStorage.setItem('notes', JSON.stringify({notes}))
  }
}
function persistData () {
  localStorage.setItem('notes', JSON.stringify({notes}));
}

