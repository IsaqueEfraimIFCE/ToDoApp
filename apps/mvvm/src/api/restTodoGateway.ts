import { API_URL } from './apiClient';
import { mapRowToTodo, Todo, TodoId } from '../domain/todo';
import { TodoGateway } from './types';

type ApiTodo = {
  id: number;
  title: string;
  insertedAt?: string;
  inserted_at?: string;
};

type ApiError = {
  error?: string;
};

const parseError = async (res: Response, fallback: string) => {
  try {
    const data = (await res.json()) as ApiError;
    if (data?.error) return data.error;
  } catch (err) {
    // ignore parsing errors
  }
  return fallback;
};

export class RestTodoGateway implements TodoGateway {
  async list(): Promise<Todo[]> {
    const res = await fetch(`${API_URL}/todos`);
    if (!res.ok) {
      throw new Error(await parseError(res, 'Erro ao carregar'));
    }
    const data = (await res.json()) as ApiTodo[];
    return (data ?? []).map((row) =>
      mapRowToTodo({
        id: row.id,
        title: row.title,
        inserted_at: row.inserted_at ?? row.insertedAt ?? new Date().toISOString(),
      }),
    );
  }

  async create(title: string): Promise<Todo> {
    const res = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      throw new Error(await parseError(res, 'Erro ao criar'));
    }
    const data = (await res.json()) as ApiTodo;
    return mapRowToTodo({
      id: data.id,
      title: data.title,
      inserted_at: data.inserted_at ?? data.insertedAt ?? new Date().toISOString(),
    });
  }

  async remove(id: TodoId): Promise<void> {
    const res = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(await parseError(res, 'Erro ao excluir'));
    }
  }
}
