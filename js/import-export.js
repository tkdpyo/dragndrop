import { isBoardItem } from './utils.js';

export function exportItems(items) {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'drag-drop-board.json';
  anchor.click();

  URL.revokeObjectURL(url);
}

export function importItems(file, onSuccess) {
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed)) {
        alert('올바른 JSON 배열 형식이 아닙니다.');
        return;
      }

      onSuccess(parsed.filter(isBoardItem));
    } catch (error) {
      alert('JSON 파일을 읽는 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  reader.readAsText(file);
}
