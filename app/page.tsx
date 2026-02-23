"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [events, setEvents] = useState<string[]>([]);

  function handleAddEvent() {
    if (!title) return;

    setEvents([...events, title]);
    setTitle("");
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Minha Agenda</h1>

      <input
        className="border p-2 mr-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Digite um compromisso"
      />

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={handleAddEvent}
      >
        Adicionar
      </button>

      <ul className="mt-6">
        {events.map((event, index) => (
          <li key={index} className="mb-2">
            {event}
          </li>
        ))}
      </ul>
    </div>
  );
}