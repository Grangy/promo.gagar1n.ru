'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

interface Offer {
  id: number;
  type: string;
  color: string;
  image: string;
}

const OFFER_TYPES = [
  { label: 'Фитнес', value: 'Фитнес', color: 'bg-red-800' },
  { label: 'Карты', value: 'Карты', color: 'bg-green-800' },
  { label: 'СПА', value: 'СПА', color: 'bg-yellow-700' },
  { label: 'Дети', value: 'Дети', color: 'bg-blue-800' },
];

const Dropzone = ({ onDrop }: { onDrop: (file: File) => void }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles[0]),
    multiple: false,
    accept: { 'image/*': [] },
  });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-md cursor-pointer transition text-center ${
        isDragActive ? 'border-red-500 bg-gray-700' : 'border-gray-600 bg-gray-800'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-white">Отпустите файл здесь...</p>
      ) : (
        <p className="text-gray-400">Перетащите изображение сюда или кликните для выбора</p>
      )}
    </div>
  );
};

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newOffer, setNewOffer] = useState({ type: '', color: '', image: '' });
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/offers');
        if (!res.ok) throw new Error('Fetch error');
        const data = await res.json();
        setOffers(data);
      } catch (err) {
        setError('Ошибка загрузки предложений');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'offer');
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload error');
    const { imageUrl } = await response.json();
    return imageUrl;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = newOffer.image;
      if (newImageFile) imageUrl = await uploadImage(newImageFile);
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newOffer, image: imageUrl }),
      });
      if (!response.ok) throw new Error('Create error');
      const created = await response.json();
      setOffers([...offers, created]);
      setNewOffer({ type: '', color: '', image: '' });
      setNewImageFile(null);
    } catch (err) {
      setError('Ошибка создания предложения');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOffer) return;
    setLoading(true);
    try {
      let imageUrl = editOffer.image;
      if (editImageFile) imageUrl = await uploadImage(editImageFile);
      const response = await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editOffer, image: imageUrl }),
      });
      if (!response.ok) throw new Error('Update error');
      const updated = await response.json();
      setOffers(offers.map((o) => (o.id === updated.id ? updated : o)));
      setEditOffer(null);
      setEditImageFile(null);
    } catch (err) {
      console.log(err);
      setError('Ошибка обновления предложения');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/offers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Delete error');
      setOffers(offers.filter((o) => o.id !== id));
    } catch (err) {
      console.log(err);
      setError('Ошибка удаления предложения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-light text-center mb-6">Управление предложениями</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center">Загрузка...</p>}

      {/* Режим редактирования */}
      {editOffer && (
        <form onSubmit={handleEdit} className="bg-gray-900 p-6 rounded-xl max-w-xl mx-auto mb-8">
          <h2 className="text-xl mb-4">Редактировать предложение #{editOffer.id}</h2>

          <div className="mb-4">
            <label className="block mb-2">Тип</label>
            <select
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
              value={editOffer.type}
              onChange={(e) => {
                const selected = OFFER_TYPES.find((t) => t.value === e.target.value);
                if (selected) {
                  setEditOffer({ ...editOffer, type: selected.value, color: selected.color });
                }
              }}
              required
            >
              <option value="">Выберите тип</option>
              {OFFER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Изображение</label>
            <Dropzone onDrop={(file) => setEditImageFile(file)} />
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-1">Текущее изображение:</p>
              <Image
                src={editImageFile ? URL.createObjectURL(editImageFile) : editOffer.image}
                alt="Preview"
                width={120}
                height={120}
                className="rounded border border-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md"
              onClick={() => setEditOffer(null)}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Обновление...' : 'Обновить'}
            </button>
          </div>
        </form>
      )}

      {/* Форма создания */}
      {!editOffer && (
        <form onSubmit={handleCreate} className="bg-gray-900 p-6 rounded-xl max-w-xl mx-auto mb-8">
          <h2 className="text-xl mb-4">Добавить предложение</h2>
          <div className="mb-4">
            <label className="block mb-2">Тип</label>
            <select
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
              value={newOffer.type}
              onChange={(e) => {
                const selected = OFFER_TYPES.find((t) => t.value === e.target.value);
                if (selected) {
                  setNewOffer({ ...newOffer, type: selected.value, color: selected.color });
                }
              }}
              required
            >
              <option value="">Выберите тип</option>
              {OFFER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Изображение</label>
            <Dropzone onDrop={(file) => setNewImageFile(file)} />
            {newImageFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-1">Превью:</p>
                <Image
                  src={URL.createObjectURL(newImageFile)}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="rounded border border-gray-700"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 p-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать'}
          </button>
        </form>
      )}

      {/* Таблица предложений */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Тип</th>
              <th className="p-3 text-left">Цвет</th>
              <th className="p-3 text-left">Изображение</th>
              <th className="p-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className="border-b border-gray-800">
                <td className="p-3">{offer.id}</td>
                <td className="p-3">{offer.type}</td>
                <td className="p-3">
                  <span className={`inline-block px-3 py-1 rounded ${offer.color}`}>{offer.color}</span>
                </td>
                <td className="p-3">
                  <Image src={offer.image} alt="Offer" width={80} height={80} className="rounded" />
                </td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded"
                    onClick={() => setEditOffer(offer)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded"
                    onClick={() => handleDelete(offer.id)}
                    disabled={loading}
                  >
                    Удалить
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

export default OffersPage;
