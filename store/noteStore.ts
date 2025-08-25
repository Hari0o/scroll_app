import { create } from 'zustand';

interface Task {
  id: string;
  text: string;
  done: boolean;
}

interface NoteState {
  note: string;
  isHorizontal: boolean;
  tasks: Task[];
  setNote: (note: string) => void;
  setIsHorizontal: (isHorizontal: boolean) => void;
  addTask: (text: string) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  note: '',
  isHorizontal: false,
  tasks: [],
  setNote: (note) => set({ note }),
  setIsHorizontal: (isHorizontal) => set({ isHorizontal }),
  addTask: (text) => set((state) => ({ tasks: [...state.tasks, { id: Date.now().toString(), text, done: false }] })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  toggleTask: (id) => set((state) => ({ tasks: state.tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t) })),
}));
