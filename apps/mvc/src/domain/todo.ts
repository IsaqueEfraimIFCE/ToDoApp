export type TodoId = number;

export interface Todo {
  id: TodoId;
  title: string;
  insertedAt: string;
}

export function mapRowToTodo(row: { id: number; title: string; inserted_at: string }): Todo {
  return {
    id: row.id,
    title: row.title,
    insertedAt: row.inserted_at,
  };
}
