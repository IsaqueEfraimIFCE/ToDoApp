import { describe, expect, it } from 'vitest';
import { TodoRepository } from './TodoRepository';
import { Todo } from '../domain/todo';
import { createInMemoryGatewayFactory } from '../test/createInMemoryGatewayFactory';

const factory = createInMemoryGatewayFactory();

describe('TodoRepository', () => {
  it('switches gateway based on mode', async () => {
    const repo = new TodoRepository(factory);

    await repo.create('REST item');
    const restList = await repo.list();
    expect(restList).toEqual([expect.objectContaining({ id: 1, title: 'REST item' })]);

    repo.setMode('realtime');
    const updates: Todo[][] = [];
    const unsubscribe = repo.subscribe((items) => {
      updates.push(items);
    });
    await repo.create('Realtime item');

    expect(updates.at(-1)).toEqual([
      expect.objectContaining({ id: 1, title: 'REST item' }),
      expect.objectContaining({ id: 2, title: 'Realtime item' }),
    ]);

    unsubscribe?.();
  });
});
