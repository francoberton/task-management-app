import { useNavigate } from 'react-router-dom';
import { Plus, ListTodo } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { TaskItem } from '../components/TaskItem';
import { ErrorMessage } from '../components/ErrorMessage';

export function TasksPage() {
  const navigate = useNavigate();
  const { tasks, error } = useTaskStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ListTodo className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Gestione Task
            </h1>
          </div>
          <p className="text-gray-600">
            Gestisci i tuoi task in modo efficiente e organizzato
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {tasks.length === 0 ? (
              'Nessun task presente'
            ) : (
              <>
                <span className="font-medium">{tasks.length}</span> {tasks.length === 1 ? 'task' : 'task'}
              </>
            )}
          </div>
          <button
            onClick={() => navigate('/tasks/new')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Nuovo Task
          </button>
        </div>

        {/* Content */}
        {error ? (
          <ErrorMessage message={error} />
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun task presente
            </h3>
            <p className="text-gray-600 mb-6">
              Inizia creando il tuo primo task
            </p>
            <button
              onClick={() => navigate('/tasks/new')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Crea il primo Task
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
