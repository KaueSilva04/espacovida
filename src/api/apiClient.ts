// Variável de Ambiente (Lida UMA ÚNICA VEZ)
const BASE_URL: string = import.meta.env.VITE_API_URL;

// Interface para o corpo de erro
interface ErrorBody {
  message?: string;
}

// Interface para as opções
interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Função utilitária para tratar o Fetch API
 */
async function apiFetch<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T | null> {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const { body, headers: optHeaders, ...restOptions } = options;

  const resolvedBody: BodyInit | undefined =
    body === undefined || body === null
      ? undefined
      : typeof body === 'string' ||
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof Blob ||
        body instanceof ArrayBuffer
        ? (body as BodyInit)
        : JSON.stringify(body);

  const config: RequestInit = {
    ...restOptions,
    headers: defaultHeaders,
    body: resolvedBody,
    credentials: 'include',
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    console.error('%c[API NETWORK ERROR]', 'color: #f44336; font-weight: bold', networkError);
    throw new Error('Falha na conexão com o servidor. Verifique sua rede.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('[API] Sessão expirada - Redirecionando para login');
      
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    const errorBody: ErrorBody = await response.json().catch(() => ({ 
      message: response.statusText 
    }));
    
    console.error('%c[API ERROR]', 'color: #f44336; font-weight: bold', errorBody);
    throw new Error(errorBody.message || `Erro do Servidor: ${response.status}`);
  }

  const contentType: string | null = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const jsonData = await response.json();
    return jsonData as T;
  }

  // Para respostas sem conteúdo (204 No Content)
  const text = await response.text();
  return text ? (text as any) : null;
}

// Interface para tipar o objeto 'api' exportado
interface ApiMethods {
  get: <T>(endpoint: string, options?: ApiFetchOptions) => Promise<T | null>;
  post: <T, D = unknown>(endpoint: string, body: D, options?: ApiFetchOptions) => Promise<T | null>;
  put: <T, D = unknown>(endpoint: string, body: D, options?: ApiFetchOptions) => Promise<T | null>;
  delete: <T, D = unknown>(endpoint: string, body: D, options?: ApiFetchOptions) => Promise<T | null>;
}

export const api: ApiMethods = {
  get: <T>(endpoint: string, options?: ApiFetchOptions) =>
    apiFetch<T>(endpoint, { method: 'GET', ...options }),
    
  post: <T, D>(endpoint: string, body: D, options?: ApiFetchOptions) =>
    apiFetch<T>(endpoint, { method: 'POST', body, ...options }),

  put: <T, D>(endpoint: string, body: D, options?: ApiFetchOptions) =>
    apiFetch<T>(endpoint, { method: 'PUT', body, ...options }),

  delete: <T, D>(endpoint: string, body: D, options?: ApiFetchOptions) =>
    apiFetch<T>(endpoint, { method: 'DELETE', body, ...options }),
};

export default api;
