import { describe, expect, it, vi } from 'vitest';
import { TodoModel } from './TodoModel';

describe('TodoModel', () => {
  it('notifies subscribers with latest snapshot and supports unsubscribe', () => {
    const model = new TodoModel();
    const listener = vi.fn();
    const firstInsertedAt = '2020-01-01T00:00:00.000Z';
    const secondInsertedAt = '2020-01-01T00:00:01.000Z';

    const unsubscribe = model.subscribe(listener);
    model.setTodos([{ id: 1, title: 'Primeiro', insertedAt: firstInsertedAt }]);

    expect(listener).toHaveBeenCalledWith([{ id: 1, title: 'Primeiro', insertedAt: firstInsertedAt }]);

    unsubscribe();
    model.setTodos([{ id: 2, title: 'Segundo', insertedAt: secondInsertedAt }]);

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
