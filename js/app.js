import { getDomElements } from './dom.js';
import { createState } from './state.js';
import { loadItems, saveItems, clearItems } from './storage.js';
import { createNewItem, removeItem, updateItemColor, updateItemText } from './item-service.js';
import { exportItems, importItems } from './import-export.js';
import { createRenderer } from './renderer.js';
import { createDragController } from './drag.js';

const dom = getDomElements();
const state = createState();

function persistItems() {
  saveItems(state.items);
}

const render = createRenderer(dom, state, {
  onDelete(id) {
    state.items = removeItem(state.items, id);
    if (state.selectedId === id) {
      state.selectedId = null;
    }
    persistItems();
    render();
  },
  onTextInput(id, text) {
    updateItemText(state.items, id, text);
    persistItems();
  },
  onTextBlur(id, text) {
    updateItemText(state.items, id, text);
    persistItems();
  },
  onDragStart(event, id) {
    dragController.startDrag(event, id);
  },
  onSelect(id) {
    state.selectedId = id;
    render(false);
  },
});

const dragController = createDragController(dom, state, render, persistItems);

function addItem() {
  const item = createNewItem(state.items);
  state.items.push(item);
  state.selectedId = item.id;
  render();
}

function applyColor(color) {
  if (!state.selectedId) {
    return;
  }

  updateItemColor(state.items, state.selectedId, color);
  persistItems();
  render();
}

function saveLayout() {
  persistItems();
  alert('현재 배치를 저장했습니다.');
}

function resetBoard() {
  const ok = confirm('정말 전체 초기화할까요? 저장된 배치도 함께 지워집니다.');
  if (!ok) {
    return;
  }

  state.items = [];
  state.selectedId = null;
  clearItems();
  render();
}

function bindToolbarEvents() {
  dom.addItemBtn.addEventListener('click', addItem);
  dom.saveBtn.addEventListener('click', saveLayout);
  dom.exportBtn.addEventListener('click', () => exportItems(state.items));
  dom.colorButtons.forEach((button) => {
    button.addEventListener('click', () => applyColor(button.dataset.color));
  });
  dom.importInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];

    importItems(file, (items) => {
      state.items = items;
      state.selectedId = null;
      persistItems();
      render();
    });

    event.target.value = '';
  });
  dom.resetBtn.addEventListener('click', resetBoard);
}

function bindBoardEvents() {
  dom.board.addEventListener('pointermove', dragController.onPointerMove);
  dom.board.addEventListener('pointerup', dragController.endDrag);
  dom.board.addEventListener('pointercancel', dragController.endDrag);
  dom.board.addEventListener('pointerleave', (event) => {
    if (state.dragState && event.buttons === 0) {
      dragController.endDrag();
    }
  });
  dom.board.addEventListener('click', (event) => {
    if (event.target === dom.board) {
      state.selectedId = null;
      render(false);
    }
  });
}

function initialize() {
  state.items = loadItems();
  bindToolbarEvents();
  bindBoardEvents();
  render();
}

initialize();
