import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { TaskForm } from '../components/TaskForm';
import type { CreateTaskDTO } from '../types/task';

export function NewTaskPage() {
  const navigate = useNavigate();
  const { createTask } = useTaskStore();

  const handleSubmit = async (data: CreateTaskDTO) => {
    try {
      await createTask(data);
      navigate('/tasks');
    } catch (error) {
      console.error('Errore nella creazione del task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Torna alla lista
          </button>
          
          <div className="flex items-center gap-3">
            <Plus className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Nuovo Task
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Compila il form per creare un nuovo task
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <TaskForm onSubmit={handleSubmit} submitLabel="Crea Task" />
        </div>
      </div>
    </div>
  );
}
