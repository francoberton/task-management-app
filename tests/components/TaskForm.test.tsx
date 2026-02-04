import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../src/components/TaskForm';
import '@testing-library/jest-dom'

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('dovrebbe renderizzare il form con tutti i campi', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/titolo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrizione/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crea task/i })).toBeInTheDocument();
  });

  it('dovrebbe mostrare errori di validazione per campi obbligatori', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /crea task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/il titolo è obbligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/la descrizione è obbligatoria/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('dovrebbe validare la lunghezza minima del titolo', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/titolo/i);
    await user.type(titleInput, 'ab'); // Solo 2 caratteri

    const submitButton = screen.getByRole('button', { name: /crea task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/il titolo deve contenere almeno 3 caratteri/i)
      ).toBeInTheDocument();
    });
  });

  it('dovrebbe validare la lunghezza minima della descrizione', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/titolo/i);
    const descriptionInput = screen.getByLabelText(/descrizione/i);

    await user.type(titleInput, 'Titolo valido');
    await user.type(descriptionInput, 'Breve'); // Meno di 10 caratteri

    const submitButton = screen.getByRole('button', { name: /crea task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/la descrizione deve contenere almeno 10 caratteri/i)
      ).toBeInTheDocument();
    });
  });

  it('dovrebbe validare la lunghezza massima del titolo', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/titolo/i);
    const longTitle = 'a'.repeat(101); // 101 caratteri

    await user.type(titleInput, longTitle);

    const submitButton = screen.getByRole('button', { name: /crea task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/il titolo non può superare 100 caratteri/i)
      ).toBeInTheDocument();
    });
  });

  it('dovrebbe validare la lunghezza massima della descrizione', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/titolo/i);
    const descriptionInput = screen.getByLabelText(/descrizione/i);
    const longDescription = 'a'.repeat(501); // 501 caratteri

    await user.type(titleInput, 'Titolo valido');
    await user.type(descriptionInput, longDescription);

    const submitButton = screen.getByRole('button', { name: /crea task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/la descrizione non può superare 500 caratteri/i)
      ).toBeInTheDocument();
    });
  });

  it('dovrebbe chiamare onSubmit con i dati corretti quando il form è valido', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/titolo/i);
    const descriptionInput = screen.getByLabelText(/descrizione/i);

    await user.type(titleInput, 'Task di Test');
    await user.type(descriptionInput, 'Questa è una descrizione di test valida');

    const submitButton = screen.getByRole('button', { name: /crea task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Task di Test',
        description: 'Questa è una descrizione di test valida',
      });
    });
  });

  it('dovrebbe mostrare il testo di caricamento durante il submit', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>(resolve => {
      resolveSubmit = resolve;
    });
    mockOnSubmit.mockReturnValue(submitPromise);

    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/titolo/i);
    const descriptionInput = screen.getByLabelText(/descrizione/i);

    await user.type(titleInput, 'Titolo test');
    await user.type(descriptionInput, 'Descrizione test valida');

    const submitButton = screen.getByRole('button', { name: /crea task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/salvataggio in corso/i)).toBeInTheDocument();
    });

    // Risolvi la promise per completare il test (wrapped in act to avoid warnings)
    await act(async () => {
      resolveSubmit!();
    });
  });

  it('dovrebbe disabilitare i campi durante il submit', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>(resolve => {
      resolveSubmit = resolve;
    });
    mockOnSubmit.mockReturnValue(submitPromise);

    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/titolo/i);
    const descriptionInput = screen.getByLabelText(/descrizione/i);

    await user.type(titleInput, 'Titolo test');
    await user.type(descriptionInput, 'Descrizione test valida');

    const submitButton = screen.getByRole('button', { name: /crea task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    await act(async () => {
      resolveSubmit!();
    });
  });

  it('dovrebbe popolare il form con i valori iniziali', () => {
    const initialValues = {
      title: 'Titolo Iniziale',
      description: 'Descrizione iniziale del task',
    };

    render(<TaskForm onSubmit={mockOnSubmit} initialValues={initialValues} />);

    const titleInput = screen.getByLabelText(/titolo/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/descrizione/i) as HTMLTextAreaElement;

    expect(titleInput.value).toBe('Titolo Iniziale');
    expect(descriptionInput.value).toBe('Descrizione iniziale del task');
  });

  it('dovrebbe mostrare il submitLabel personalizzato', () => {
    render(<TaskForm onSubmit={mockOnSubmit} submitLabel="Salva Modifiche" />);

    expect(screen.getByRole('button', { name: /salva modifiche/i })).toBeInTheDocument();
  });
});
