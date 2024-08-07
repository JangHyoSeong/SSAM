import { create } from "zustand";

const useStudentsStore = create((set) => ({
  students: [],
  setStudents: (students) => set({ students }),
}));

export { useStudentsStore };
