'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Ошибка загрузки мероприятий');
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  // Don't render section if no events
  if (error || events.length === 0) return null;

  return (
    <section className="px-6 pb-12 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-light mb-6">МЕРОПРИЯТИЯ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-800 hover:opacity-90 transition-opacity duration-300"
          >
            <Image
              src={event.image}
              alt={event.title}
              width={800}
              height={450}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-red-800 text-white text-xs font-bold px-3 py-1 rounded-full">
              {event.date}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;