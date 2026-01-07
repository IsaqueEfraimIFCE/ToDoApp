import { Todo } from '../domain/todo';
import { TodoGateway } from '../api/types';

export class TodoModel {
  constructor(private gateway: TodoGateway) {}

  setGateway(gateway: TodoGateway) {
    this.gateway = gateway;
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
