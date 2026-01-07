import { describe, expect, it, vi } from 'vitest';
import { TodoModel } from './TodoModel';
import { TodoPresenter } from './TodoPresenter';
import { createInMemoryGatewayFactory } from '../test/createInMemoryGatewayFactory';

const factory = createInMemoryGatewayFactory();

describe('TodoPresenter', () => {
  it('refreshes view on add/remove and surfaces errors', async () => {
    const setTodos = vi.fn();
    const setError = vi.fn();
    const view = { setTodos, setError };
    const model = new TodoModel(factory('rest'));
    const presenter = new TodoPresenter(view, model, factory);

    await presenter.init();
    expect(setTodos).toHaveBeenCalledWith([]);

    await presenter.add('Nova tarefa');
    expect(setTodos).toHaveBeenLastCalledWith([
      expect.objectContaining({ id: 1, title: 'Nova tarefa' }),
    ]);

    await presenter.remove(1);
    expect(setTodos).toHaveBeenLastCalledWith([]);

    setError.mockReset();
    await presenter.remove(999);
    expect(setError).toHaveBeenLastCalledWith(null);
  });

  it('subscribes to realtime updates when mode is realtime', async () => {
    const setTodos = vi.fn();
    const setError = vi.fn();
    const view = { setTodos, setError };
    const model = new TodoModel(factory('rest'));
    const presenter = new TodoPresenter(view, model, factory);

    await presenter.setMode('realtime');
    const realtimeGateway = factory('realtime');
    await realtimeGateway.create('Push');

    expect(setTodos).toHaveBeenLastCalledWith([
      expect.objectContaining({ id: 2, title: 'Push' }),
    ]);
  });
});
