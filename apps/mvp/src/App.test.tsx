import { act } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { createInMemoryGatewayFactory } from './test/createInMemoryGatewayFactory';

const factory = createInMemoryGatewayFactory();

describe('MVP App (end-to-end)', () => {
  it('performs CRUD in REST and updates automatically in realtime', async () => {
    await act(async () => {
      render(<App createGateway={factory} />);
    });
    const input = screen.getByPlaceholderText('Nova tarefa');

    await userEvent.type(input, 'Primeira tarefa');
    await userEvent.click(screen.getByText('Adicionar'));
    expect(await screen.findByText('Primeira tarefa')).toBeInTheDocument();

    const modeSelector = screen.getByLabelText('Modo de backend:');
    await userEvent.selectOptions(modeSelector, 'realtime');

    await userEvent.clear(input);
    await userEvent.type(input, 'Segunda tarefa');
    await userEvent.click(screen.getByText('Adicionar'));

    const list = screen.getByRole('list');
    expect(within(list).getByText('Segunda tarefa')).toBeInTheDocument();

    const deleteButtons = screen.getAllByText('Excluir');
    await userEvent.click(deleteButtons[0]!);
    expect(await screen.findAllByRole('listitem')).toHaveLength(1);
  });
});
