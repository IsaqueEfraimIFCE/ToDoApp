let nextId = 1;
let todos = [];

export const listTodos = () => todos.slice().sort((a, b) => a.id - b.id);

export const createTodo = (title) => {
  const todo = {
    id: nextId,
    title,
    insertedAt: new Date().toISOString(),
  };
  nextId += 1;
  todos = [...todos, todo];
  return todo;
};

export const removeTodo = (id) => {
  const before = todos.length;
  todos = todos.filter((todo) => todo.id !== id);
  return todos.length !== before;
};
