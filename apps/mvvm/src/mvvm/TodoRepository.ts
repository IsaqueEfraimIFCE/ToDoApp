import { BackendMode, TodoGateway, TodoGatewayFactory } from '../api/types';
import { createTodoGateway } from '../api/todoGatewayFactory';
import { Todo } from '../domain/todo';

export class TodoRepository {
  private gateway: TodoGateway;

  constructor(private readonly gatewayFactory: TodoGatewayFactory = createTodoGateway) {
    this.gateway = gatewayFactory('rest');
  }

  setMode(mode: BackendMode) {
    this.gateway = this.gatewayFactory(mode);
  }

  list() {
    return this.gateway.list();
  }

  create(title: string) {
    return this.gateway.create(title);
  }

  remove(id: number) {
    return this.gateway.remove(id);
  }

  subscribe(onChange: (todos: Todo[]) => void) {
    return this.gateway.subscribe?.(onChange);
  }
}
