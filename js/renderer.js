export function createRenderer(dom, state, handlers) {
  function updateEmptyState() {
    dom.emptyState.style.display = state.items.length === 0 ? 'flex' : 'none';
  }

  function updateItemPosition(element, item) {
    element.style.left = `${item.x}px`;
    element.style.top = `${item.y}px`;
    element.classList.toggle('selected', item.id === state.selectedId);
    element.classList.toggle('dragging', state.dragState?.id === item.id);
  }

  function createItemElement(item) {
    const element = document.createElement('div');
    element.className = 'item';
    element.dataset.id = item.id;
    updateItemPosition(element, item);

    const header = document.createElement('div');
    header.className = 'item-header';

    const idLabel = document.createElement('span');
    idLabel.textContent = item.id;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'item-delete';
    deleteButton.type = 'button';
    deleteButton.textContent = 'x';
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      handlers.onDelete(item.id);
    });

    header.append(deleteButton);

    const content = document.createElement('div');
    content.className = 'item-content';
    content.contentEditable = 'true';
    content.spellcheck = false;
    content.textContent = item.text;

    content.addEventListener('pointerdown', (event) => event.stopPropagation());
    content.addEventListener('input', () => handlers.onTextInput(item.id, content.textContent || ''));
    content.addEventListener('blur', () => {
      content.textContent = (content.textContent || '').trim() || '빈 요소';
      handlers.onTextBlur(item.id, content.textContent);
    });

    element.addEventListener('pointerdown', (event) => handlers.onDragStart(event, item.id));
    element.addEventListener('click', () => handlers.onSelect(item.id));
    element.append(header, content);

    return element;
  }

  return function render(shouldRebuild = true) {
    updateEmptyState();

    if (!shouldRebuild) {
      state.items.forEach((item) => {
        const element = dom.board.querySelector(`[data-id="${item.id}"]`);
        if (element) {
          updateItemPosition(element, item);
        }
      });
      return;
    }

    dom.board.querySelectorAll('.item').forEach((element) => element.remove());
    state.items.forEach((item) => {
      dom.board.appendChild(createItemElement(item));
    });
  };
}
