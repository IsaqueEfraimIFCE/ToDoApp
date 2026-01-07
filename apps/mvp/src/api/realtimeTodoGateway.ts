import { API_URL } from './apiClient';
import { RestTodoGateway } from './restTodoGateway';
import { Todo } from '../domain/todo';
import { TodoGateway } from './types';

export class RealtimeTodoGateway implements TodoGateway {
  private rest = new RestTodoGateway();

  list(): Promise<Todo[]> {
    return this.rest.list();
  }

  create(title: string): Promise<Todo> {
    return this.rest.create(title);
  }

  remove(id: number): Promise<void> {
    return this.rest.remove(id);
  }

  subscribe(onChange: (todos: Todo[]) => void): () => void {
    const source = new EventSource(`${API_URL}/todos/events/stream`);

    const handleChange = async () => {
      try {
        const snapshot = await this.list();
        onChange(snapshot);
      } catch (err) {
        console.error(err);
      }
    };

    source.addEventListener('change', handleChange);
    source.addEventListener('init', handleChange);

    handleChange();

    return () => {
      source.close();
    };
  }
}
