import express from 'express';
import { list, create, remove } from '../services/todoService.js';
import { registerClient } from '../realtime/sseHub.js';

export const todosRouter = express.Router();

todosRouter.get('/', (_req, res) => {
  res.json(list());
});

todosRouter.post('/', (req, res, next) => {
  try {
    const todo = create(String(req.body?.title ?? ''));
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

todosRouter.delete('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id);
    remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

todosRouter.get('/events/stream', (req, res) => {
  const unregister = registerClient(res);
  req.on('close', unregister);
});
