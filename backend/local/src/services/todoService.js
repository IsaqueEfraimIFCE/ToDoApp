import { listTodos, createTodo, removeTodo } from '../store/memoryStore.js';
import { broadcastChange } from '../realtime/sseHub.js';

export const list = () => listTodos();

export const create = (title) => {
  if (!title || !title.trim()) {
    const error = new Error('Titulo obrigatorio.');
    error.status = 400;
    throw error;
  }
  const todo = createTodo(title.trim());
  broadcastChange();
  return todo;
};

export const remove = (id) => {
  if (Number.isNaN(id)) {
    const error = new Error('Id invalido.');
    error.status = 400;
    throw error;
  }
  const removed = removeTodo(id);
  if (!removed) {
    const error = new Error('Tarefa nao encontrada.');
    error.status = 404;
    throw error;
  }
  broadcastChange();
};
