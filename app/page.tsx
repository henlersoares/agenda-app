"use client";

import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EventType {
  id: number;
  title: string;
  completed: boolean;
  dateTime: Date;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [events, setEvents] = useState<EventType[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // ← CONSTANTE AQUI!
  const datePickerRef = useRef(null); // ← REFERÊNCIA AQUI!

  useEffect(() => {
    const eventosSalvos = localStorage.getItem("events");
    if (eventosSalvos) {
      const parsedEvents = JSON.parse(eventosSalvos);
      const eventsWithDates = parsedEvents.map((event: any) => ({
        ...event,
        dateTime: new Date(event.dateTime)
      }));
      setEvents(eventsWithDates);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  function handleAddEvent() {
    if (!title) {
      alert("Digite um compromisso!");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title,
      completed: false,
      dateTime: selectedDateTime,
    };

    setEvents([...events, newEvent]);
    setTitle("");
    setSelectedDateTime(new Date());
  }

  function handleEditEvent(id: number, newTitle: string) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, title: newTitle } : event
      )
    );
  }

  function toggleComplete(id: number) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, completed: !event.completed }
          : event
      )
    );
  }

  function handleRemoveEvent(id: number) {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-10">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Minha Agenda</h1>

        <div className="relative">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <input
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 pr-10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite um compromisso"
                onKeyPress={(e) => e.key === 'Enter' && handleAddEvent()}
              />

              {/* Botão do calendário (ícone) */}
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                📅
              </button>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded font-semibold"
              onClick={handleAddEvent}
            >
              Adicionar
            </button>
          </div>

          {/* Calendário flutuante que aparece quando clica no ícone */}
          {isCalendarOpen && (
            <div className="absolute left-0 mt-2 z-50 shadow-lg rounded overflow-hidden bg-gray-800">
              <DatePicker
                selected={selectedDateTime}
                onChange={(date: Date | null) => {
                  if (date) setSelectedDateTime(date);
                  // Removeu o setIsCalendarOpen(false)
                }}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                inline
                timeFormat="HH:mm"
                timeIntervals={15}
              />
              <div className="text-right p-2 border-t border-gray-700">
                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        <ul className="mt-6 space-y-3">
          {events.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Não há compromissos agendados.
            </p>
          ) : (
            events.map((event) => (
              <li
                key={event.id}
                className="flex justify-between items-center bg-gray-800 p-3 rounded hover:bg-gray-750 transition-colors"
              >
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={event.completed}
                      onChange={() => toggleComplete(event.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span
                      className={`${event.completed ? "line-through text-gray-400" : ""}`}
                    >
                      {event.title}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 ml-6">
                    📅 {event.dateTime.toLocaleDateString('pt-BR')} ⏰ {event.dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors"
                    onClick={() => {
                      const newTitle = prompt("Editar tarefa:", event.title);
                      if (newTitle) handleEditEvent(event.id, newTitle);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
                    onClick={() => handleRemoveEvent(event.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {events.length > 0 && (
          <div className="mt-4 text-sm text-gray-400 text-center">
            Total: {events.length} compromisso(s) |
            Pendentes: {events.filter(e => !e.completed).length}
          </div>
        )}
      </div>
    </div>
  );
}