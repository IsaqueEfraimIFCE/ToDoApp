import { BackendMode, TodoGateway } from './types';
import { RestTodoGateway } from './restTodoGateway';
import { RealtimeTodoGateway } from './realtimeTodoGateway';

export function createTodoGateway(mode: BackendMode): TodoGateway {
  if (mode === 'realtime') return new RealtimeTodoGateway();
  return new RestTodoGateway();
}
