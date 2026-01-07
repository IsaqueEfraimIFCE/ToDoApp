import { BackendMode, TodoGateway } from '../api/types';
import { Todo } from '../domain/todo';

export function createInMemoryGatewayFactory(seed: Todo[] = []) {
  let todos = [...seed];
  let nextId = seed.length ? Math.max(...seed.map((item) => item.id)) + 1 : 1;
  const listeners = new Set<(todos: Todo[]) => void>();

  const snapshot = () => [...todos].sort((a, b) => a.id - b.id);
  const notify = () => listeners.forEach((listener) => listener(snapshot()));

  const buildGateway = (mode: BackendMode): TodoGateway => ({
    async list() {
      return snapshot();
    },
    async create(title: string) {
      const todo: Todo = {
        id: nextId,
        title,
        insertedAt: new Date(nextId).toISOString(),
      };
      nextId += 1;
      todos = [...todos, todo];
      notify();
      return todo;
    },
    async remove(id: number) {
      todos = todos.filter((todo) => todo.id !== id);
      notify();
    },
    subscribe: mode === 'realtime'
      ? (onChange: (items: Todo[]) => void) => {
          listeners.add(onChange);
          onChange(snapshot());
          return () => listeners.delete(onChange);
        }
      : undefined,
  });

  return (mode: BackendMode): TodoGateway => buildGateway(mode);
}
