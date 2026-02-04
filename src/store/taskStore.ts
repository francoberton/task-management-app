import { create } from 'zustand';
import { toast } from 'sonner';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';
import { taskApi } from '../api/taskApi';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDTO) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskDTO) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskApi.getAllTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Errore nel caricamento dei task',
        loading: false 
      });
    }
  },

  createTask: async (data: CreateTaskDTO) => {
    set({ loading: true, error: null });
    try {
      const newTask = await taskApi.createTask(data);
      set(state => ({ 
        tasks: [...state.tasks, newTask],
        loading: false 
      }));
      toast.success('Task creato con successo!', {
        description: `"${data.title}" è stato aggiunto alla lista`,
      });
      return newTask;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nella creazione del task';
      set({ 
        error: errorMessage,
        loading: false 
      });
      toast.error('Errore nella creazione', {
        description: errorMessage,
      });
      throw error;
    }
  },

  updateTask: async (id: string, data: UpdateTaskDTO) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskApi.updateTask(id, data);
      if (updatedTask) {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id ? updatedTask : task
          ),
          loading: false
        }));
        toast.success('Task aggiornato con successo!', {
          description: data.title ? `"${data.title}" è stato modificato` : 'Le modifiche sono state salvate',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'aggiornamento del task';
      set({ 
        error: errorMessage,
        loading: false 
      });
      toast.error('Errore nell\'aggiornamento', {
        description: errorMessage,
      });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ loading: true, error: null });
    
    // Salva il titolo del task prima di eliminarlo per mostrarlo nel toast
    const taskToDelete = get().tasks.find(task => task.id === id);
    const taskTitle = taskToDelete?.title || 'Task';
    
    try {
      await taskApi.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        loading: false
      }));
      toast.success('Task eliminato con successo!', {
        description: `"${taskTitle}" è stato rimosso dalla lista`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nell\'eliminazione del task';
      set({ 
        error: errorMessage,
        loading: false 
      });
      toast.error('Errore nell\'eliminazione', {
        description: errorMessage,
      });
      throw error;
    }
  },

  getTaskById: (id: string) => {
    return get().tasks.find(task => task.id === id);
  },
}));
