const API_BASE = 'http://localhost:8080'; // Подставь свой адрес

// const getTelegramId = () => window.Telegram.WebApp.initDataUnsafe.user?.id?.toString();

export async function listFiles() {
  const res = await fetch(`${API_BASE}/files`);
  if (!res.ok) throw new Error('Ошибка загрузки списка');
  return res.json();
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Ошибка загрузки файла');
}

export function downloadUrl(filename) {
  return `${API_BASE}/download/${encodeURIComponent(filename)}`;
}

export async function deleteFile(filename) {
  const res = await fetch(`${API_BASE}/delete/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Ошибка удаления файла');
}
