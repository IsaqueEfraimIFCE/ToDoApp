import { Todo } from '../domain/todo';

interface Props {
  todo: Todo;
  onRemove: (id: number) => void;
}

export function TodoItem({ todo, onRemove }: Props) {
  return (
    <li className="todo-item">
      <span className="todo-title">
        <span className="todo-icon">📝</span>
        {todo.title}
      </span>
      <button className="danger" onClick={() => onRemove(todo.id)} title="Excluir tarefa">
        🗑️
      </button>
    </li>
  );
}
