import { act } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { createInMemoryGatewayFactory } from './test/createInMemoryGatewayFactory';

const factory = createInMemoryGatewayFactory();

describe('MVC App (end-to-end)', () => {
  it('creates, refreshes, and reacts to realtime updates', async () => {
    await act(async () => {
      render(<App createGateway={factory} />);
    });
    const input = screen.getByPlaceholderText('Nova tarefa');

    await userEvent.type(input, 'Tarefa REST{enter}');
    expect(await screen.findByText('Tarefa REST')).toBeInTheDocument();

    const modeSelector = screen.getByLabelText('Modo de backend:');
    await userEvent.selectOptions(modeSelector, 'realtime');

    await userEvent.clear(input);
    await userEvent.type(input, 'Tarefa Realtime');
    await userEvent.click(screen.getByText('Adicionar'));

    const list = screen.getByRole('list');
    expect(within(list).getByText('Tarefa Realtime')).toBeInTheDocument();

    const deleteButtons = screen.getAllByText('Excluir');
    await userEvent.click(deleteButtons[0]!);
    expect(await screen.findAllByRole('listitem')).toHaveLength(1);
  });
});
