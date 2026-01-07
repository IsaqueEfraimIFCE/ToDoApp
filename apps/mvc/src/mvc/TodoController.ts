import { createTodoGateway } from '../api/todoGatewayFactory';
import { BackendMode, TodoGatewayFactory } from '../api/types';
import { TodoModel } from './TodoModel';

export class TodoController {
  private mode: BackendMode = 'rest';
  private unsubscribe?: () => void;

  constructor(private model: TodoModel, private readonly gatewayFactory: TodoGatewayFactory = createTodoGateway) {}

  async setMode(mode: BackendMode) {
    if (this.mode === mode) return;
    this.cleanup();
    this.mode = mode;
    await this.refresh();
    if (mode === 'realtime') {
      this.subscribeRealtime();
    }
  }

  async refresh() {
    const gateway = this.gatewayFactory(this.mode);
    const todos = await gateway.list();
    this.model.setTodos(todos);
    return todos;
  }

  async add(title: string) {
    const gateway = this.gatewayFactory(this.mode);
    await gateway.create(title);
    if (this.mode === 'rest') {
      await this.refresh();
    }
  }

  async remove(id: number) {
    const gateway = this.gatewayFactory(this.mode);
    await gateway.remove(id);
    if (this.mode === 'rest') {
      await this.refresh();
    }
  }

  private subscribeRealtime() {
    const gateway = this.gatewayFactory(this.mode);
    this.unsubscribe = gateway.subscribe?.((todos) => this.model.setTodos(todos));
  }

  dispose() {
    this.cleanup();
  }

  private cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }
}
