import { clamp } from './utils.js';

export function createDragController(dom, state, render, persistItems) {
  function startDrag(event, id) {
    const item = state.items.find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    const element = event.currentTarget;
    const boardRect = dom.board.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();

    state.selectedId = id;
    state.dragState = {
      id,
      pointerOffsetX: event.clientX - itemRect.left,
      pointerOffsetY: event.clientY - itemRect.top,
      itemWidth: itemRect.width,
      itemHeight: itemRect.height,
      boardRect,
    };

    element.setPointerCapture(event.pointerId);
    render();
  }

  function onPointerMove(event) {
    if (!state.dragState) {
      return;
    }

    const item = state.items.find((entry) => entry.id === state.dragState.id);
    if (!item) {
      return;
    }

    const nextX = event.clientX - state.dragState.boardRect.left - state.dragState.pointerOffsetX;
    const nextY = event.clientY - state.dragState.boardRect.top - state.dragState.pointerOffsetY;

    item.x = clamp(nextX, 0, state.dragState.boardRect.width - state.dragState.itemWidth);
    item.y = clamp(nextY, 0, state.dragState.boardRect.height - state.dragState.itemHeight);

    render(false);
  }

  function endDrag() {
    if (!state.dragState) {
      return;
    }

    state.dragState = null;
    persistItems();
    render();
  }

  return {
    startDrag,
    onPointerMove,
    endDrag,
  };
}
