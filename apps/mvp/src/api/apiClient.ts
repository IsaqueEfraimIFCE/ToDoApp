const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!apiUrl) {
  console.warn('Vari?veis VITE_API_URL ausente. Usando http://localhost:4000.');
}

export const API_URL = apiUrl ?? 'http://localhost:4000';
