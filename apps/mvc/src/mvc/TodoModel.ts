import { Todo } from '../domain/todo';

export type TodoListener = (todos: Todo[]) => void;

export class TodoModel {
  private todos: Todo[] = [];
  private listeners = new Set<TodoListener>();

  get snapshot(): Todo[] {
    return this.todos;
  }

  setTodos(todos: Todo[]) {
    this.todos = todos;
    this.notify();
  }

  getSnapshot() {
    return this.todos;
  }

  subscribe(listener: TodoListener): () => void {
    this.listeners.add(listener);
    listener(this.todos);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.todos));
  }
}
