import { describe, expect, it } from 'vitest';
import { TodoModel } from './TodoModel';
import { TodoController } from './TodoController';
import { createInMemoryGatewayFactory } from '../test/createInMemoryGatewayFactory';

const factory = createInMemoryGatewayFactory();

describe('TodoController', () => {
  it('refreshes, adds, and removes using the configured gateway', async () => {
    const model = new TodoModel();
    const controller = new TodoController(model, factory);

    await controller.refresh();
    expect(model.getSnapshot()).toEqual([]);

    await controller.add('Primeiro');
    expect(model.getSnapshot()).toEqual([
      expect.objectContaining({ id: 1, title: 'Primeiro' }),
    ]);

    await controller.remove(1);
    expect(model.getSnapshot()).toEqual([]);
  });

  it('subscribes to realtime updates when mode changes', async () => {
    const model = new TodoModel();
    const controller = new TodoController(model, factory);

    await controller.setMode('realtime');
    const realtimeGateway = factory('realtime');
    await realtimeGateway.create('Outro');

    expect(model.getSnapshot()).toEqual([
      expect.objectContaining({ id: 2, title: 'Outro' }),
    ]);
  });
});
