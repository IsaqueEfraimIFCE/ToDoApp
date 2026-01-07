import { useEffect, useMemo, useState } from 'react';
import { BackendMode, TodoGatewayFactory } from '../api/types';
import { Todo } from '../domain/todo';
import { TodoRepository } from './TodoRepository';
import { createTodoGateway } from '../api/todoGatewayFactory';

export function useTodoViewModel(createGateway: TodoGatewayFactory = createTodoGateway) {
  const [mode, setMode] = useState<BackendMode>('rest');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const repo = useMemo(() => new TodoRepository(createGateway), [createGateway]);

  useEffect(() => {
    repo.setMode(mode);
    let unsubscribe: (() => void) | undefined;

    if (mode === 'realtime') {
      unsubscribe = repo.subscribe((items) => setTodos(items));
    }

    repo
      .list()
      .then((items) => {
        setTodos(items);
        setError(null);
      })
      .catch((err) => setError((err as Error).message ?? 'Erro ao carregar'));

    return () => {
      unsubscribe?.();
    };
  }, [mode, repo]);

  const refresh = async (): Promise<boolean> => {
    try {
      const items = await repo.list();
      setTodos(items);
      setError(null);
      return true;
    } catch (err) {
      setError((err as Error).message ?? 'Erro ao atualizar');
      return false;
    }
  };

  const add = async (title: string): Promise<boolean> => {
    try {
      await repo.create(title);
      if (mode === 'rest') {
        await refresh();
      }
      setError(null);
      return true;
    } catch (err) {
      setError((err as Error).message ?? 'Erro ao criar');
      return false;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      await repo.remove(id);
      if (mode === 'rest') {
        await refresh();
      }
      setError(null);
      return true;
    } catch (err) {
      setError((err as Error).message ?? 'Erro ao excluir');
      return false;
    }
  };

  return {
    mode,
    setMode,
    todos,
    error,
    refresh,
    add,
    remove,
  } as const;
}
