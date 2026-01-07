const clients = new Set();

export const registerClient = (res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  res.write(`event: init\n`);
  res.write(`data: ${JSON.stringify({ type: 'init' })}\n\n`);

  clients.add(res);

  const keepAlive = setInterval(() => {
    res.write(`: keep-alive\n\n`);
  }, 25000);

  return () => {
    clearInterval(keepAlive);
    clients.delete(res);
  };
};

export const broadcastChange = () => {
  const payload = JSON.stringify({ type: 'change' });
  clients.forEach((res) => {
    res.write(`event: change\n`);
    res.write(`data: ${payload}\n\n`);
  });
};
