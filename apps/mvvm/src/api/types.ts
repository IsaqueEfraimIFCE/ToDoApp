import { Todo, TodoId } from '../domain/todo';

export type BackendMode = 'rest' | 'realtime';

export interface TodoGateway {
  list(): Promise<Todo[]>;
  create(title: string): Promise<Todo>;
  remove(id: TodoId): Promise<void>;
  subscribe?(onChange: (todos: Todo[]) => void): () => void;
}

export type TodoGatewayFactory = (mode: BackendMode) => TodoGateway;
