import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../../src/components/Modal';
import '@testing-library/jest-dom'

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: 'Test Modal',
    message: 'This is a test message',
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConfirm.mockClear();
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  it('non dovrebbe renderizzare quando isOpen è false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dovrebbe renderizzare quando isOpen è true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('dovrebbe mostrare il titolo e il messaggio corretti', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('dovrebbe mostrare le label personalizzate dei pulsanti', () => {
    render(
      <Modal
        {...defaultProps}
        confirmLabel="Procedi"
        cancelLabel="Indietro"
      />
    );

    expect(screen.getByRole('button', { name: /procedi/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /indietro/i })).toBeInTheDocument();
  });

  it('dovrebbe chiamare onClose quando si clicca sul pulsante Annulla', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /annulla/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('dovrebbe chiamare onConfirm quando si clicca sul pulsante Conferma', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: /conferma/i });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('dovrebbe chiamare onClose quando si clicca sulla X', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByLabelText(/chiudi modale/i);
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('dovrebbe chiamare onClose quando si clicca sul backdrop', async () => {
    const user = userEvent.setup();
    const { container } = render(<Modal {...defaultProps} />);

    // Il backdrop è il primo div con la classe fixed
    const backdrop = container.querySelector('.fixed');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      await user.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('non dovrebbe chiamare onClose quando si clicca sul contenuto della modale', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    await user.click(dialog);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('non dovrebbe chiudere con ESC durante il loading', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} isLoading={true} />);

    await user.keyboard('{Escape}');

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('dovrebbe disabilitare i pulsanti durante il loading', () => {
    render(<Modal {...defaultProps} isLoading={true} />);

    const confirmButton = screen.getByRole('button', { name: /eliminazione/i });
    const cancelButton = screen.getByRole('button', { name: /annulla/i });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('dovrebbe nascondere la X durante il loading', () => {
    render(<Modal {...defaultProps} isLoading={true} />);

    expect(screen.queryByLabelText(/chiudi modale/i)).not.toBeInTheDocument();
  });

  it('dovrebbe mostrare il testo "Eliminazione..." quando è in loading', () => {
    render(<Modal {...defaultProps} isLoading={true} />);

    expect(screen.getByText(/eliminazione\.\.\./i)).toBeInTheDocument();
  });

  it('dovrebbe applicare gli stili corretti per variant="danger"', () => {
    render(<Modal {...defaultProps} variant="danger" />);

    const confirmButton = screen.getByRole('button', { name: /conferma/i });
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  it('dovrebbe applicare gli stili corretti per variant="warning"', () => {
    render(<Modal {...defaultProps} variant="warning" />);

    const confirmButton = screen.getByRole('button', { name: /conferma/i });
    expect(confirmButton).toHaveClass('bg-yellow-600');
  });

  it('dovrebbe applicare gli stili corretti per variant="info"', () => {
    render(<Modal {...defaultProps} variant="info" />);

    const confirmButton = screen.getByRole('button', { name: /conferma/i });
    expect(confirmButton).toHaveClass('bg-blue-600');
  });

  it('dovrebbe avere gli attributi ARIA corretti', () => {
    render(<Modal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
  });

  it('dovrebbe renderizzare l\'icona di warning', () => {
    const { container } = render(<Modal {...defaultProps} />);

    // Verifica che ci sia un'icona SVG (AlertTriangle di lucide-react)
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('non dovrebbe chiamare onClose dal backdrop durante il loading', async () => {
    const user = userEvent.setup();
    const { container } = render(<Modal {...defaultProps} isLoading={true} />);

    const backdrop = container.querySelector('.fixed');
    if (backdrop) {
      await user.click(backdrop);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });
});
