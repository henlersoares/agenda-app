"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import {
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CircleIcon,
} from "lucide-react";

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDateTime, setEditDateTime] = useState(new Date());

  useEffect(() => {
    const eventosSalvos = localStorage.getItem("events");
    if (eventosSalvos) {
      const parsedEvents = JSON.parse(eventosSalvos);
      const eventsWithDates = parsedEvents.map((event: any) => ({
        ...event,
        dateTime: new Date(event.dateTime),
      }));
      setEvents(eventsWithDates);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  function handleAddEvent() {
    if (!title.trim()) {
      toast.error("Digite um compromisso!");
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

    toast.success("Compromisso adicionado!", {
      description: `${title} - ${selectedDateTime.toLocaleDateString("pt-BR")}`,
    });
  }

  function handleEditEvent() {
    if (!editingEvent) return;

    if (!editTitle.trim()) {
      toast.error("Digite um título!");
      return;
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === editingEvent.id
          ? { ...event, title: editTitle, dateTime: editDateTime }
          : event
      )
    );

    setEditingEvent(null);
    toast.success("Compromisso editado!");
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
    const event = events.find((e) => e.id === id);

    setEvents((prev) => prev.filter((event) => event.id !== id));

    toast.warning("Compromisso removido!", {
      description: event?.title,
    });
  }

  function filterEventsByMonth(month: number | null) {
    if (month === null) return events;
    return events.filter((event) => event.dateTime.getMonth() === month);
  }

  function getMonthName(month: number) {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[month];
  }

  const monthsWithEvents = [
    ...new Set(events.map((event) => event.dateTime.getMonth())),
  ];
  const filteredEvents = filterEventsByMonth(selectedMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Minha Agenda
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Aqui você verifica todos os seus compromissos
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setSelectedMonth(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedMonth === null
                  ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Todos
            </button>

            {monthsWithEvents.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedMonth === month
                    ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {getMonthName(month)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="O que você precisa fazer?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />

              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleAddEvent}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          {isCalendarOpen && (
            <div className="absolute mt-2 z-50 shadow-xl rounded-xl overflow-hidden bg-white border border-gray-200">
              <DatePicker
                selected={selectedDateTime}
                onChange={(date: Date | null) =>
                  date && setSelectedDateTime(date)
                }
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                inline
                timeFormat="HH:mm"
                timeIntervals={15}
              />

              <div className="p-2 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-400">
                {selectedMonth !== null
                  ? `Nenhum compromisso em ${getMonthName(selectedMonth)}`
                  : "Nenhum compromisso por aqui"}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                Adicione seu primeiro compromisso!
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleComplete(event.id)}
                      className="text-gray-400 hover:text-green-500 transition-colors"
                    >
                      {event.completed ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <CircleIcon className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <p
                        className={`font-medium ${
                          event.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {event.dateTime.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                        })}{" "}
                        •{" "}
                        {event.dateTime.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingEvent(event);
                        setEditTitle(event.title);
                        setEditDateTime(event.dateTime);
                      }}
                      className="text-gray-400 hover:text-yellow-500 p-2 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleRemoveEvent(event.id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {events.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              {events.length} compromisso(s) •{" "}
              {events.filter((e) => e.completed).length} concluídos •{" "}
              {events.filter((e) => !e.completed).length} pendentes
            </p>
          </div>
        )}
      </div>

      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ✏️ Editar compromisso
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <DatePicker
                selected={editDateTime}
                onChange={(date: Date | null) => date && setEditDateTime(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={15}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingEvent(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={handleEditEvent}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}