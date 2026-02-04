import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TasksPage } from './pages/TasksPage';
import { NewTaskPage } from './pages/NewTaskPage';
import { EditTaskPage } from './pages/EditTaskPage';
import { useTaskStore } from './store/taskStore';
import { LoadingSpinner } from './components/LoadingSpinner';

export default function App() {
  const { fetchTasks, loading, tasks } = useTaskStore();
  const isInitialLoad = loading && tasks.length === 0;

  useEffect(() => {
    // Carica i task all'avvio dell'applicazione
    fetchTasks();
  }, [fetchTasks]);

  // Mostra spinner solo al primo caricamento
  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Caricamento task...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        duration={3000}
      />
      <Routes>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/new" element={<NewTaskPage />} />
        <Route path="/tasks/:id" element={<EditTaskPage />} />
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
