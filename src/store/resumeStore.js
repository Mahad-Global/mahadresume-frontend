import { create } from 'zustand'

const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  loading: false,

  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  setLoading: (loading) => set({ loading }),

  updateCurrentSection: (section, data) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, [section]: data }
        : null,
    })),

  addResume: (resume) =>
    set((state) => ({ resumes: [resume, ...state.resumes] })),

  removeResume: (id) =>
    set((state) => ({ resumes: state.resumes.filter((r) => r.id !== id) })),
}))

export default useResumeStore
