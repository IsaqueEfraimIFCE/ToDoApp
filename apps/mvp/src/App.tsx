import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './ui/Header';
import { ModeSelector } from './ui/ModeSelector';
import { TodoItem } from './ui/TodoItem';
import { BackendMode, TodoGatewayFactory } from './api/types';
import { Todo } from './domain/todo';
import { TodoModel } from './mvp/TodoModel';
import { TodoPresenter, TodoView } from './mvp/TodoPresenter';
import { createTodoGateway } from './api/todoGatewayFactory';

interface Props {
  createGateway?: TodoGatewayFactory;
}

export default function App({ createGateway = createTodoGateway }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mode, setMode] = useState<BackendMode>('rest');
  const [title, setTitle] = useState('');
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' | 'info' } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const didInit = useRef(false);
  const lastTodosRef = useRef<Todo[]>([]);
  const suppressRealtimeToast = useRef(false);
  const skipFirstRealtimeToast = useRef(false);

  const showToast = useCallback((message: string, tone: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, tone });
    if (toastTimer.current !== undefined) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== undefined) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const view = useMemo<TodoView>(() => ({
    setTodos,
    setError: (message) => {
      if (message) showToast(message, 'error');
    },
  }), [showToast]);

  const model = useMemo(() => new TodoModel(createGateway('rest')), [createGateway]);
  const presenter = useMemo(() => new TodoPresenter(view, model, createGateway), [view, model, createGateway]);

  useEffect(() => {
    presenter.init();
    return () => presenter.dispose();
  }, [presenter]);

  useEffect(() => {
    presenter.setMode(mode);
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    if (mode === 'realtime') {
      skipFirstRealtimeToast.current = true;
    }
    showToast(
      mode === 'realtime'
        ? 'Realtime ativo: atualizacoes chegam automaticamente.'
        : 'REST ativo: clique em Atualizar para buscar mudancas.',
      'info',
    );
  }, [mode, presenter, showToast]);

  useEffect(() => {
    if (mode !== 'realtime') {
      lastTodosRef.current = todos;
      return;
    }

    if (skipFirstRealtimeToast.current) {
      skipFirstRealtimeToast.current = false;
      lastTodosRef.current = todos;
      return;
    }

    if (suppressRealtimeToast.current) {
      suppressRealtimeToast.current = false;
      lastTodosRef.current = todos;
      return;
    }

    if (todos.length !== lastTodosRef.current.length) {
      showToast('Atualizacao recebida em tempo real.', 'info');
    }

    lastTodosRef.current = todos;
  }, [mode, todos, showToast]);

  const handleAdd = async () => {
    if (!title.trim()) return;
    if (mode === 'realtime') {
      suppressRealtimeToast.current = true;
    }
    const ok = await presenter.add(title.trim());
    if (ok) {
      setTitle('');
      showToast('Tarefa adicionada.', 'success');
    }
  };

  const handleRemove = async (id: number) => {
    if (mode === 'realtime') {
      suppressRealtimeToast.current = true;
    }
    const ok = await presenter.remove(id);
    if (ok) {
      showToast('Tarefa removida.', 'success');
    }
  };

  const handleRefresh = async () => {
    const ok = await presenter.refresh();
    if (ok) {
      showToast('Lista atualizada.', 'success');
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="mode-panel">
        <ModeSelector mode={mode} onChange={setMode} />
        <span className="mode-hint">
          {mode === 'realtime'
            ? 'Realtime (push): mudancas aparecem automaticamente.'
            : 'REST (pull): use Atualizar para buscar mudancas.'}
        </span>
      </div>

      <div className="todo-form">
        <input
          placeholder="Nova tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>
          ➕ Adicionar
        </button>
        <button disabled={mode === 'realtime'} onClick={handleRefresh}>
          🔄 Atualizar
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onRemove={handleRemove} />
        ))}
      </ul>

      <div className="toast-stack" role="status" aria-live="polite">
        {toast && <div className={`toast ${toast.tone}`}>{toast.message}</div>}
      </div>
    </div>
  );
}
