import { renderHook, act, waitFor } from '@testing-library/react';
import { useTaskStore } from '../../src/store/taskStore';
import { taskApi } from '../../src/api/taskApi';
import { toast } from 'sonner';
import type { Task } from '../../src/types/task';

// Mock del taskApi
jest.mock('../../src/api/taskApi');

// Mock di toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockedTaskApi = taskApi as jest.Mocked<typeof taskApi>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('useTaskStore', () => {
  beforeEach(() => {
    // Reset dello store prima di ogni test
    const { result } = renderHook(() => useTaskStore());
    act(() => {
      useTaskStore.setState({ tasks: [], loading: false, error: null });
    });
    jest.clearAllMocks();
  });

  describe('fetchTasks', () => {
    it('dovrebbe caricare i task con successo', async () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Descrizione 1',
          status: 'open',
          createdAt: '2026-02-03T10:00:00.000Z',
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Descrizione 2',
          status: 'completed',
          createdAt: '2026-02-03T11:00:00.000Z',
        },
      ];

      mockedTaskApi.getAllTasks.mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockedTaskApi.getAllTasks).toHaveBeenCalledTimes(1);
    });

    it('dovrebbe impostare loading a true durante il fetch', async () => {
      mockedTaskApi.getAllTasks.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.fetchTasks();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('dovrebbe gestire errori durante il fetch', async () => {
      const errorMessage = 'Network error';
      mockedTaskApi.getAllTasks.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
      expect(result.current.tasks).toEqual([]);
    });
  });

  describe('createTask', () => {
    it('dovrebbe creare un nuovo task e aggiungerlo allo stato', async () => {
      const newTaskData = {
        title: 'Nuovo Task',
        description: 'Nuova descrizione',
      };

      const createdTask: Task = {
        id: 'new-123',
        ...newTaskData,
        status: 'open',
        createdAt: '2026-02-03T12:00:00.000Z',
      };

      mockedTaskApi.createTask.mockResolvedValue(createdTask);

      const { result } = renderHook(() => useTaskStore());

      let returnedTask: Task | undefined;
      await act(async () => {
        returnedTask = await result.current.createTask(newTaskData);
      });

      expect(returnedTask).toEqual(createdTask);
      expect(result.current.tasks).toContainEqual(createdTask);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Task creato con successo!',
        expect.objectContaining({
          description: expect.stringContaining('Nuovo Task'),
        })
      );
    });

  });

  describe('updateTask', () => {
    it('dovrebbe aggiornare un task esistente nello stato', async () => {
      const existingTask: Task = {
        id: 'update-1',
        title: 'Task Originale',
        description: 'Descrizione originale',
        status: 'open',
        createdAt: '2026-02-03T10:00:00.000Z',
      };

      const updatedTask: Task = {
        ...existingTask,
        title: 'Task Aggiornato',
        status: 'in progress',
      };

      // Inizializza lo store con il task esistente
      act(() => {
        useTaskStore.setState({ tasks: [existingTask] });
      });

      mockedTaskApi.updateTask.mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.updateTask('update-1', {
          title: 'Task Aggiornato',
          status: 'in progress',
        });
      });

      expect(result.current.tasks[0]).toEqual(updatedTask);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Task aggiornato con successo!',
        expect.objectContaining({
          description: expect.stringContaining('Task Aggiornato'),
        })
      );
    });

  });

  describe('deleteTask', () => {
    it('dovrebbe rimuovere un task dallo stato', async () => {
      const tasks: Task[] = [
        {
          id: 'delete-1',
          title: 'Da eliminare',
          description: 'Descrizione',
          status: 'open',
          createdAt: '2026-02-03T10:00:00.000Z',
        },
        {
          id: 'keep-1',
          title: 'Da mantenere',
          description: 'Descrizione',
          status: 'open',
          createdAt: '2026-02-03T11:00:00.000Z',
        },
      ];

      act(() => {
        useTaskStore.setState({ tasks });
      });

      mockedTaskApi.deleteTask.mockResolvedValue(true);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.deleteTask('delete-1');
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe('keep-1');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Task eliminato con successo!',
        expect.objectContaining({
          description: expect.stringContaining('Da eliminare'),
        })
      );
    });

  });

  describe('getTaskById', () => {
    it('dovrebbe restituire il task corretto dato un id', () => {
      const tasks: Task[] = [
        {
          id: 'find-1',
          title: 'Task 1',
          description: 'Descrizione 1',
          status: 'open',
          createdAt: '2026-02-03T10:00:00.000Z',
        },
        {
          id: 'find-2',
          title: 'Task 2',
          description: 'Descrizione 2',
          status: 'completed',
          createdAt: '2026-02-03T11:00:00.000Z',
        },
      ];

      act(() => {
        useTaskStore.setState({ tasks });
      });

      const { result } = renderHook(() => useTaskStore());

      const task = result.current.getTaskById('find-2');

      expect(task).toBeDefined();
      expect(task?.title).toBe('Task 2');
    });

    it('dovrebbe restituire undefined se il task non esiste', () => {
      act(() => {
        useTaskStore.setState({ tasks: [] });
      });

      const { result } = renderHook(() => useTaskStore());

      const task = result.current.getTaskById('non-existent');

      expect(task).toBeUndefined();
    });
  });
});
