import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import type { CreateTaskDTO } from '../types/task';

interface TaskFormProps {
  initialValues?: Partial<CreateTaskDTO>;
  onSubmit: (data: CreateTaskDTO) => Promise<void>;
  submitLabel?: string;
}

export function TaskForm({ initialValues, onSubmit, submitLabel = 'Crea Task' }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskDTO>({
    defaultValues: initialValues || {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmitForm = async (data: CreateTaskDTO) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Titolo <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title', {
            required: 'Il titolo è obbligatorio',
            minLength: {
              value: 3,
              message: 'Il titolo deve contenere almeno 3 caratteri',
            },
            maxLength: {
              value: 100,
              message: 'Il titolo non può superare 100 caratteri',
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.title
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Inserisci il titolo del task"
          disabled={isSubmitting}
        />
        {errors.title && (
          <div className="mt-2 flex items-start gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errors.title.message}</span>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descrizione <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', {
            required: 'La descrizione è obbligatoria',
            minLength: {
              value: 10,
              message: 'La descrizione deve contenere almeno 10 caratteri',
            },
            maxLength: {
              value: 500,
              message: 'La descrizione non può superare 500 caratteri',
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-vertical ${
            errors.description
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Descrivi il task in dettaglio"
          disabled={isSubmitting}
        />
        {errors.description && (
          <div className="mt-2 flex items-start gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errors.description.message}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSubmitting ? 'Salvataggio in corso...' : submitLabel}
      </button>
    </form>
  );
}
