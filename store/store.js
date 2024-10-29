import { create } from 'zustand';
import { supabase } from '../client';

const useStore = create((set, get) => ({
  user: null,
  tasks: [],
  loading: false,
  alert: null,

  setUser: (user) => set({ user }),
  setAlert: (alert) => set({ alert }),
  setLoading: (loading) => set({ loading }),

  loadTasks: async () => {
    if (typeof window === 'undefined') return; // Ensure it's client-side only
    set({ loading: true });
    const { data, error } = await supabase.from('Task').select();
    if (error) {
      console.error('Error loading tasks:', error);
      set({ loading: false });
    } else {
      set({ tasks: data, loading: false });
    }
  },

  addTask: async (newTask) => {
    const { error } = await supabase.from('Task').insert([newTask]);
    if (!error) {
      get().loadTasks();
      set({ alert: { type: 'success', message: 'Task added successfully!' } });
    }
  },

  updateTask: async (id, updatedTask) => {
    const { error } = await supabase
      .from('Task')
      .update(updatedTask)
      .eq('id', id);
    if (!error) {
      get().loadTasks();
      set({ alert: { type: 'warning', message: 'Task updated successfully!' } });
    }
  },
  
  deleteTask: async (id) => {
    const { error } = await supabase.from('Task').delete().eq('id', id);
    if (!error) {
      get().loadTasks();
      set({ alert: { type: 'danger', message: 'Task deleted successfully!' } });
    }
  },
}));

export default useStore;
export async function getServerSideProps() {
  return { props: {} };
}