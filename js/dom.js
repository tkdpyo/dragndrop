export function getDomElements() {
  return {
    board: document.getElementById('board'),
    emptyState: document.getElementById('emptyState'),
    addItemBtn: document.getElementById('addItemBtn'),
    saveBtn: document.getElementById('saveBtn'),
    exportBtn: document.getElementById('exportBtn'),
    importInput: document.getElementById('importInput'),
    resetBtn: document.getElementById('resetBtn'),
    colorButtons: document.querySelectorAll('.color-swatch'),
  };
}
