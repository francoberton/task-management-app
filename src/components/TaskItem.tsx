import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import type { Task, TaskStatus } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import { Modal } from './Modal';

interface TaskItemProps {
  task: Task;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  'open': 'bg-blue-100 text-blue-800',
  'in progress': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  'open': 'Aperto',
  'in progress': 'In Corso',
  'completed': 'Completato',
};

export function TaskItem({ task }: TaskItemProps) {
  const navigate = useNavigate();
  const { updateTask, deleteTask } = useTaskStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error('Errore nel cambio stato:', error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <div 
        className={`bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all ${
          isDeleting ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <h3 className="flex-1 text-lg font-semibold text-gray-900 break-words">
                {task.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLORS[task.status]}`}>
                {STATUS_LABELS[task.status]}
              </span>
            </div>
            
            <p className="text-gray-600 mb-3 break-words">
              {task.description}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={isDeleting}
          >
            <option value="open">{STATUS_LABELS['open']}</option>
            <option value="in progress">{STATUS_LABELS['in progress']}</option>
            <option value="completed">{STATUS_LABELS['completed']}</option>
          </select>

          <button
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isDeleting}
          >
            <Pencil className="w-4 h-4" />
            Modifica
          </button>

          <button
            onClick={handleDeleteClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            Elimina
          </button>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Elimina Task"
        message={`Sei sicuro di voler eliminare il task "${task.title}"? Questa azione non può essere annullata.`}
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
