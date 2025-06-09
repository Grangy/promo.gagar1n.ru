'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Define type for event items
interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', image: '' });
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Ошибка загрузки мероприятий');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Upload image and return URL
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'event');
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    const { imageUrl } = await response.json();
    return imageUrl;
  };

  // Handle form submission for creating a new event
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = newEvent.image;
      if (newImageFile) {
        imageUrl = await uploadImage(newImageFile);
      }
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEvent, image: imageUrl }),
      });
      if (response.ok) {
        const createdEvent = await response.json();
        setEvents([...events, createdEvent]);
        setNewEvent({ title: '', date: '', image: '' });
        setNewImageFile(null);
      } else {
        setError('Ошибка создания мероприятия');
      }
    } catch (err) {
      setError('Ошибка создания мероприятия');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for editing an event
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEvent) return;
    setLoading(true);
    try {
      let imageUrl = editEvent.image;
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
      }
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editEvent, image: imageUrl }),
      });
      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
        setEditEvent(null);
        setEditImageFile(null);
      } else {
        setError('Ошибка обновления мероприятия');
      }
    } catch (err) {
      setError('Ошибка обновления мероприятия');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setEvents(events.filter((e) => e.id !== id));
      } else {
        setError('Ошибка удаления мероприятия');
      }
    } catch (err) {
      setError('Ошибка удаления мероприятия');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-light text-white mb-6 text-center">Управление мероприятиями</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-white text-center">Загрузка...</p>}

      {/* Form for creating a new event */}
      <form onSubmit={handleCreate} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-xl text-white mb-4">Добавить мероприятие</h2>
        <div className="mb-4">
          <label className="block text-white mb-2">Название</label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            placeholder="Введите название"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Дата</label>
          <input
            type="text"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            placeholder="Введите дату (например, 21 апреля или Скоро)"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Изображение</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
          />
          {newEvent.image && (
            <Image
              src={newEvent.image}
              alt="Preview"
              width={100}
              height={100}
              className="mt-2 object-cover rounded"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-red-700 text-white p-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Создание...' : 'Создать'}
        </button>
      </form>

      {/* Edit Form (shown when editing) */}
      {editEvent && (
        <form onSubmit={handleEdit} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-xl text-white mb-4">Редактировать мероприятие #{editEvent.id}</h2>
          <div className="mb-4">
            <label className="block text-white mb-2">Название</label>
            <input
              type="text"
              value={editEvent.title}
              onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Дата</label>
            <input
              type="text"
              value={editEvent.date}
              onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Изображение</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            />
            <Image
              src={editEvent.image}
              alt="Current"
              width={100}
              height={100}
              className="mt-2 object-cover rounded"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-red-700 text-white p-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditEvent(null);
                setEditImageFile(null);
              }}
              className="w-full bg-gray-600 text-white p-2 rounded-md hover:bg-gray-500 transition"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Название</th>
              <th className="p-3 text-left">Дата</th>
              <th className="p-3 text-left">Изображение</th>
              <th className="p-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-400">
                  Нет мероприятий
                </td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-700">
                <td className="p-3">{event.id}</td>
                <td className="p-3">{event.title}</td>
                <td className="p-3">{event.date}</td>
                <td className="p-3">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={100}
                    height={100}
                    className="object-cover rounded"
                  />
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setEditEvent(event)}
                    className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-700 text-white p-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Удаление...' : 'Удалить'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsPage;