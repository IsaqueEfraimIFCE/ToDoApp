export const notFoundHandler = (_req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada.' });
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status ?? 500;
  const message = err.message ?? 'Erro inesperado.';
  res.status(status).json({ error: message });
};
