import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [dragActive, setDragActive] = useState(false);

  // Загрузка списка файлов
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/files`);
      if (!response.ok) throw new Error('Ошибка загрузки файлов');
      const data = await response.json();
      setFiles(data.files || []);
      setMessage({ text: '', type: '' });
    } catch (error) {
      setMessage({ text: `Ошибка: ${error.message}`, type: 'error' });
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка файла
  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки файла');
      
      setMessage({ text: `Файл "${file.name}" успешно загружен!`, type: 'success' });
      fetchFiles(); // Обновляем список
    } catch (error) {
      setMessage({ text: `Ошибка загрузки: ${error.message}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  // Скачивание файла
  const downloadFile = async (filename) => {
    try {
      const response = await fetch(`${API_BASE}/download/${encodeURIComponent(filename)}`);
      if (!response.ok) throw new Error('Ошибка скачивания файла');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setMessage({ text: `Файл "${filename}" скачан!`, type: 'success' });
    } catch (error) {
      setMessage({ text: `Ошибка скачивания: ${error.message}`, type: 'error' });
    }
  };

  // Удаление файла
  const deleteFile = async (filename) => {
    if (!window.confirm(`Удалить файл "${filename}"?`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/delete/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Ошибка удаления файла');
      
      setMessage({ text: `Файл "${filename}" удален!`, type: 'success' });
      fetchFiles(); // Обновляем список
    } catch (error) {
      setMessage({ text: `Ошибка удаления: ${error.message}`, type: 'error' });
    }
  };

  // Обработка загрузки через input
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
    e.target.value = ''; // Сброс input
  };

  // Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  // Определение иконки файла
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return <span className="text-blue-500 text-lg">🖼️</span>;
    } else if (['txt', 'md', 'doc', 'docx', 'pdf'].includes(ext)) {
      return <span className="text-green-500 text-lg">📄</span>;
    }
    return <span className="text-gray-500 text-lg">📁</span>;
  };

  // Автоматическое скрытие сообщений
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Загрузка файлов при монтировании
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Файловый менеджер</h1>
          <p className="text-gray-600">Загружайте, скачивайте и управляйте файлами</p>
        </div>

        {/* Сообщения */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'error' 
              ? 'bg-red-100 border border-red-300 text-red-700' 
              : 'bg-green-100 border border-green-300 text-green-700'
          }`}>
            <span className="text-lg">
              {message.type === 'error' ? '❌' : '✅'}
            </span>
            {message.text}
          </div>
        )}

        {/* Зона загрузки */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-6xl mb-4">📤</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Поддерживаются любые типы файлов
            </p>
            <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <span>📤</span>
              {uploading ? 'Загрузка...' : 'Выбрать файл'}
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Список файлов */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Файлы</h2>
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Загрузка...' : 'Обновить'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Загрузка файлов...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-gray-500">Файлы не найдены</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {files.map((filename) => (
                <div key={filename} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {getFileIcon(filename)}
                    <span className="font-medium text-gray-800">{filename}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadFile(filename)}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <span>📥</span>
                      Скачать
                    </button>
                    <button
                      onClick={() => deleteFile(filename)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <span>🗑️</span>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}