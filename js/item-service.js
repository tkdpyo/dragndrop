import { generateId } from './utils.js';

export function createNewItem(items) {
  const count = items.length + 1;

  return {
    id: generateId(),
    text: `새 요소 ${count}`,
    x: 40 + (count % 5) * 24,
    y: 40 + (count % 5) * 24,
  };
}

export function updateItemText(items, id, text) {
  const target = items.find((item) => item.id === id);
  if (!target) {
    return;
  }

  target.text = text.trim() || '빈 요소';
}

export function removeItem(items, id) {
  return items.filter((item) => item.id !== id);
}
