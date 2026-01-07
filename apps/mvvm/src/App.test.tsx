import { act } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { createInMemoryGatewayFactory } from './test/createInMemoryGatewayFactory';

const factory = createInMemoryGatewayFactory();

describe('MVVM App (end-to-end)', () => {
  it('handles CRUD in REST and realtime modes', async () => {
    await act(async () => {
      render(<App createGateway={factory} />);
    });
    const input = screen.getByPlaceholderText('Nova tarefa');

    await userEvent.type(input, 'Item REST');
    await userEvent.click(screen.getByText('Adicionar'));
    expect(await screen.findByText('Item REST')).toBeInTheDocument();

    const modeSelector = screen.getByLabelText('Modo de backend:');
    await userEvent.selectOptions(modeSelector, 'realtime');

    await userEvent.clear(input);
    await userEvent.type(input, 'Item Realtime');
    await userEvent.click(screen.getByText('Adicionar'));

    const list = screen.getByRole('list');
    expect(within(list).getByText('Item Realtime')).toBeInTheDocument();

    const deleteButtons = screen.getAllByText('Excluir');
    await userEvent.click(deleteButtons[0]!);
    expect(await screen.findAllByRole('listitem')).toHaveLength(1);
  });
});
