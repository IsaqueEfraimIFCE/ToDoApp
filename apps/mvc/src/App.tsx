import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './ui/Header';
import { ModeSelector } from './ui/ModeSelector';
import { TodoItem } from './ui/TodoItem';
import { BackendMode, TodoGatewayFactory } from './api/types';
import { Todo } from './domain/todo';
import { TodoModel } from './mvc/TodoModel';
import { TodoController } from './mvc/TodoController';
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

  const model = useMemo(() => new TodoModel(), []);
  const controller = useMemo(() => new TodoController(model, createGateway), [model, createGateway]);

  useEffect(() => {
    const unsubscribe = model.subscribe(setTodos);
    return () => unsubscribe();
  }, [model]);

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

  useEffect(() => {
    let active = true;
    if (mode === 'realtime') {
      skipFirstRealtimeToast.current = true;
    }

    const syncMode = async () => {
      if (!didInit.current) {
        didInit.current = true;
        try {
          await controller.refresh();
        } catch (err) {
          if (active) showToast((err as Error).message ?? 'Erro ao carregar', 'error');
        }
        return;
      }

      try {
        await controller.setMode(mode);
        if (active) {
          showToast(
            mode === 'realtime'
              ? 'Realtime ativo: atualizacoes chegam automaticamente.'
              : 'REST ativo: clique em Atualizar para buscar mudancas.',
            'info',
          );
        }
      } catch (err) {
        if (active) showToast((err as Error).message ?? 'Erro ao trocar modo', 'error');
      }
    };

    syncMode();
    return () => {
      active = false;
      controller.dispose();
    };
  }, [controller, mode, showToast]);

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
    try {
      if (mode === 'realtime') {
        suppressRealtimeToast.current = true;
      }
      await controller.add(title.trim());
      setTitle('');
      showToast('Tarefa adicionada.', 'success');
    } catch (err) {
      showToast((err as Error).message ?? 'Erro ao adicionar', 'error');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      if (mode === 'realtime') {
        suppressRealtimeToast.current = true;
      }
      await controller.remove(id);
      showToast('Tarefa removida.', 'success');
    } catch (err) {
      showToast((err as Error).message ?? 'Erro ao remover', 'error');
    }
  };

  const handleRefresh = async () => {
    try {
      await controller.refresh();
      showToast('Lista atualizada.', 'success');
    } catch (err) {
      showToast((err as Error).message ?? 'Erro ao atualizar', 'error');
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
