import express from 'express';
import cors from 'cors';
import { todosRouter } from './routes/todos.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandlers.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/todos', todosRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
