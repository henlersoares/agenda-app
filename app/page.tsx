"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  XIcon,
  BellIcon,
  RepeatIcon,
  UsersIcon,
  FileTextIcon,
  TagIcon,
} from "lucide-react";

interface EventType {
  id: number;
  title: string;
  completed: boolean;
  dateTime: Date;
  reminder?: boolean;
  repeat?: "none" | "daily" | "weekly" | "monthly";
  category?: string;
  description?: string;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [events, setEvents] = useState<EventType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDateTime, setEditDateTime] = useState(new Date());
  const [editTime, setEditTime] = useState("12:00");

  const [reminder, setReminder] = useState(false);
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [editReminder, setEditReminder] = useState(false);
  const [editRepeat, setEditRepeat] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

  function combineDateAndTime(date: Date, timeString: string): Date {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  }

  function handleAddEvent() {
    if (!title.trim()) {
      toast.error("Digite um compromisso!");
      return;
    }

    const finalDateTime = combineDateAndTime(selectedDateTime, selectedTime);

    const newEvent = {
      id: Date.now(),
      title,
      completed: false,
      dateTime: finalDateTime,
      reminder,
      repeat,
      category: category.trim() || undefined,
      description: description.trim() || undefined,
    };

    setEvents([...events, newEvent]);
    resetForm();
    setIsModalOpen(false);

    toast.success("Compromisso adicionado!", {
      description: `${title} - ${finalDateTime.toLocaleDateString("pt-BR")} as ${finalDateTime.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    });
  }

  function handleEditEvent() {
    if (!editingEvent) return;

    if (!editTitle.trim()) {
      toast.error("Digite um titulo!");
      return;
    }

    const finalDateTime = combineDateAndTime(editDateTime, editTime);

    setEvents((prev) =>
      prev.map((event) =>
        event.id === editingEvent.id
          ? {
            ...event,
            title: editTitle,
            dateTime: finalDateTime,
            reminder: editReminder,
            repeat: editRepeat,
            category: editCategory.trim() || undefined,
            description: editDescription.trim() || undefined,
          }
          : event
      )
    );

    setEditingEvent(null);
    toast.success("Compromisso editado!");
  }

  function resetForm() {
    setTitle("");
    setSelectedDateTime(new Date());
    setSelectedTime("12:00");
    setReminder(false);
    setRepeat("none");
    setCategory("");
    setDescription("");
  }

  function toggleComplete(id: number) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, completed: !event.completed } : event
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
      "Marco",
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

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Minha Agenda
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Aqui voce verifica todos os seus compromissos
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setSelectedMonth(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedMonth === null
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
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedMonth === month
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
          <div className="flex justify-center">
            <button
              onClick={openCreateModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              Adicionar Compromisso
            </button>
          </div>

          <div className="space-y-3 mt-6">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-400">
                  {selectedMonth !== null
                    ? `Nenhum compromisso em ${getMonthName(selectedMonth)}`
                    : "Nenhum compromisso por aqui"}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Clique em "Adicionar Compromisso" para começar
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
                      <div className="flex-1">
                        <p className={`font-medium ${event.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                          }`}>
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <span>
                            {event.dateTime.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {formatTime(event.dateTime)}
                          </span>
                          {event.category && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <TagIcon className="w-3 h-3" />
                                {event.category}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setEditTitle(event.title);
                          setEditDateTime(event.dateTime);
                          const hours = event.dateTime.getHours().toString().padStart(2, '0');
                          const minutes = event.dateTime.getMinutes().toString().padStart(2, '0');
                          setEditTime(`${hours}:${minutes}`);
                          setEditReminder(event.reminder || false);
                          setEditRepeat(event.repeat || "none");
                          setEditCategory(event.category || "");
                          setEditDescription(event.description || "");
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
                {events.filter((e) => e.completed).length} concluidos •{" "}
                {events.filter((e) => !e.completed).length} pendentes
              </p>
            </div>
          )}
        </div>

        {/* Modal de Criar Compromisso */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Novo Compromisso
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna da Esquerda - Data */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titulo
                    </label>
                    <input
                      type="text"
                      placeholder="Digite o titulo do compromisso"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data
                    </label>
                    <Calendar
                      mode="single"
                      selected={selectedDateTime}
                      onSelect={(date) => date && setSelectedDateTime(date)}
                      locale={ptBR}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                {/* Coluna da Direita - Horário e Ferramentas */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horario
                    </label>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Lembrete
                    </label>
                    <button
                      onClick={() => setReminder(!reminder)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reminder ? "bg-blue-500" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reminder ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Repetir
                    </label>
                    <select
                      value={repeat}
                      onChange={(e) => setRepeat(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">Nao repetir</option>
                      <option value="daily">Diariamente</option>
                      <option value="weekly">Semanalmente</option>
                      <option value="monthly">Mensalmente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Ex: Trabalho, Pessoal, Estudos"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descricao
                    </label>
                    <div className="flex items-start gap-2">
                      <FileTextIcon className="w-4 h-4 text-gray-400 mt-2" />
                      <textarea
                        placeholder="Adicione uma descricao detalhada..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Editar Compromisso */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Editar Compromisso
                </h2>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna da Esquerda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titulo
                    </label>
                    <input
                      type="text"
                      placeholder="Digite o titulo do compromisso"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data
                    </label>
                    <Calendar
                      mode="single"
                      selected={editDateTime}
                      onSelect={(date) => date && setEditDateTime(date)}
                      locale={ptBR}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                {/* Coluna da Direita */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horario
                    </label>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Lembrete
                    </label>
                    <button
                      onClick={() => setEditReminder(!editReminder)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editReminder ? "bg-blue-500" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editReminder ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Repetir
                    </label>
                    <select
                      value={editRepeat}
                      onChange={(e) => setEditRepeat(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">Nao repetir</option>
                      <option value="daily">Diariamente</option>
                      <option value="weekly">Semanalmente</option>
                      <option value="monthly">Mensalmente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Ex: Trabalho, Pessoal, Estudos"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descricao
                    </label>
                    <div className="flex items-start gap-2">
                      <FileTextIcon className="w-4 h-4 text-gray-400 mt-2" />
                      <textarea
                        placeholder="Adicione uma descricao detalhada..."
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
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
    </div>
  );
}