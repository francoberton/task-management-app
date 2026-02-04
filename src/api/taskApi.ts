import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';

const STORAGE_KEY = 'tasks_data';
const API_DELAY = 300; // Simula latenza network

// Simula delay asincrono
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper per leggere dal localStorage
const getTasksFromStorage = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Errore nel leggere i task:', error);
    return [];
  }
};

// Helper per salvare nel localStorage
const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Errore nel salvare i task:', error);
  }
};

// Mock API
export const taskApi = {
  // GET /api/tasks
  async getAllTasks(): Promise<Task[]> {
    await delay(API_DELAY);
    return getTasksFromStorage();
  },

  // GET /api/tasks/:id
  async getTaskById(id: string): Promise<Task | null> {
    await delay(API_DELAY);
    const tasks = getTasksFromStorage();
    const task = tasks.find(t => t.id === id);
    return task || null;
  },

  // POST /api/tasks
  async createTask(data: CreateTaskDTO): Promise<Task> {
    await delay(API_DELAY);
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    const tasks = getTasksFromStorage();
    tasks.push(newTask);
    saveTasksToStorage(tasks);

    return newTask;
  },

  // PUT /api/tasks/:id
  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task | null> {
    await delay(API_DELAY);
    
    const tasks = getTasksFromStorage();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    tasks[index] = {
      ...tasks[index],
      ...data,
    };

    saveTasksToStorage(tasks);
    return tasks[index];
  },

  // DELETE /api/tasks/:id
  async deleteTask(id: string): Promise<boolean> {
    await delay(API_DELAY);
    
    const tasks = getTasksFromStorage();
    const filteredTasks = tasks.filter(t => t.id !== id);

    if (filteredTasks.length === tasks.length) {
      return false; 
    }

    saveTasksToStorage(filteredTasks);
    return true;
  },
};
