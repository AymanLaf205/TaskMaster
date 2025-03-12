import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO string format
  time?: string;
}

interface TodoStore {
  todos: Todo[];
  language: 'en' | 'ar';
  addTodo: (text: string, date: string, time?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  setLanguage: (language: 'en' | 'ar') => void;
  getTodosByDate: (date: string) => Todo[];
}

const translations = {
  en: {
    setTime: "Set time",
    hour: "Hour",
    minute: "Minute",
  },
  ar: {
    setTime: "تحديد الوقت",
    hour: "الساعة",
    minute: "الدقيقة",
  },
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      language: 'en',
      addTodo: (text, date, time) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: Math.random().toString(36).substr(2, 9), text, completed: false, date, time },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          ),
        })),
      setLanguage: (language) => set({ language }),
      getTodosByDate: (date) => {
        const todos = get().todos;
        return todos.filter((todo) => todo.date === date);
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);