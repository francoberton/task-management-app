import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { TaskForm } from '../components/TaskForm';
import { ErrorMessage } from '../components/ErrorMessage';
import type { CreateTaskDTO } from '../types/task';

export function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, updateTask } = useTaskStore();
  const [notFound, setNotFound] = useState(false);

  const task = id ? getTaskById(id) : undefined;

  useEffect(() => {
    // Verifica se il task esiste
    if (id && !getTaskById(id)) {
      setNotFound(true);
    }
  }, [id, getTaskById]);

  const handleSubmit = async (data: CreateTaskDTO) => {
    if (!id) return;
    
    try {
      await updateTask(id, data);
      navigate('/tasks');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del task:', error);
    }
  };

  if (notFound || !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Torna alla lista
          </button>
          
          <ErrorMessage message="Task non trovato. Potrebbe essere stato eliminato." />
        </div>
      </div>
    );
  }

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
            <Pencil className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Modifica Task
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Aggiorna i dettagli del task
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <TaskForm
            initialValues={{
              title: task.title,
              description: task.description,
            }}
            onSubmit={handleSubmit}
            submitLabel="Salva Modifiche"
          />
        </div>
      </div>
    </div>
  );
}
