import { createTodoGateway } from '../api/todoGatewayFactory';
import { BackendMode, TodoGatewayFactory } from '../api/types';
import { Todo } from '../domain/todo';
import { TodoModel } from './TodoModel';

export interface TodoView {
  setTodos(todos: Todo[]): void;
  setError(message: string | null): void;
}

export class TodoPresenter {
  private mode: BackendMode = 'rest';
  private unsubscribe?: () => void;

  constructor(private view: TodoView, private model: TodoModel, private readonly gatewayFactory: TodoGatewayFactory = createTodoGateway) {}

  async init() {
    await this.refresh();
  }

  async setMode(mode: BackendMode) {
    if (this.mode === mode) return;
    this.teardownSubscription();
    this.mode = mode;
    this.model.setGateway(this.gatewayFactory(mode));
    await this.refresh();
    if (mode === 'realtime') {
      this.subscribe();
    }
  }

  async refresh(): Promise<boolean> {
    try {
      const todos = await this.model.list();
      this.view.setTodos(todos);
      this.view.setError(null);
      return true;
    } catch (err) {
      this.view.setError((err as Error).message ?? 'Erro ao atualizar');
      return false;
    }
  }

  async add(title: string): Promise<boolean> {
    try {
      await this.model.create(title);
      if (this.mode === 'rest') {
        await this.refresh();
      }
      this.view.setError(null);
      return true;
    } catch (err) {
      this.view.setError((err as Error).message ?? 'Erro ao criar');
      return false;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.model.remove(id);
      if (this.mode === 'rest') {
        await this.refresh();
      }
      this.view.setError(null);
      return true;
    } catch (err) {
      this.view.setError((err as Error).message ?? 'Erro ao excluir');
      return false;
    }
  }

  dispose() {
    this.teardownSubscription();
  }

  private subscribe() {
    this.unsubscribe = this.model.subscribe?.((todos) => {
      this.view.setTodos(todos);
    });
  }

  private teardownSubscription() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }
}
