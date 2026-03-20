export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isBoardItem(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    typeof item.x === 'number' &&
    typeof item.y === 'number' &&
    (item.color === undefined ||
      item.color === 'pink' ||
      item.color === 'green' ||
      item.color === 'blue')
  );
}
