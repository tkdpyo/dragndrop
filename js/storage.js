import { STORAGE_KEY } from './constants.js';
import { isBoardItem } from './utils.js';

export function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isBoardItem) : [];
  } catch (error) {
    console.error('저장 데이터를 불러오지 못했습니다.', error);
    return [];
  }
}

export function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function clearItems() {
  localStorage.removeItem(STORAGE_KEY);
}
