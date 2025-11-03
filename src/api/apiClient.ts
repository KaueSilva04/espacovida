// Variável de Ambiente (Lida UMA ÚNICA VEZ)
const BASE_URL: string = import.meta.env.VITE_API_URL;

// Interface para o corpo de erro, simplificando a tipagem da exceção
interface ErrorBody {
  message?: string;
  // Outras propriedades de erro do backend, se existirem
}

// Interface para as opções, estendendo RequestInit para tipagem nativa do fetch
interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  // O body aceita qualquer tipo para ser transformado em JSON.
  body?: unknown; 
  // Tipando os headers como um Record de string
  headers?: Record<string, string>;
}


/**
 * Função utilitária para tratar o Fetch API, atuando como um "Interceptor".
 * @param {string} endpoint O caminho da API (ex: '/users/profile')
 * @param {object} options As configurações do fetch (method, body, headers, etc.)
 * @returns {Promise<any>} Os dados da resposta (já convertidos para JSON)
 */
async function apiFetch<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T | null> {
  // Constrói a URL completa
  const url = `${BASE_URL}${endpoint}`;
  
  
  // Define os Headers padrão e sobrescreve com os headers fornecidos
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    // Adiciona o token, se existir
    ...options.headers,
  };
  
  // Junta as opções do fetch
  const { body, headers: optHeaders, ...restOptions } = options;

  // Garante que o body seja um BodyInit válido para RequestInit
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
  };

  let response: Response;
  try {
    // Chama o Fetch 
    response = await fetch(url, config);
  } catch (networkError) {
    // Lida com erros de rede (sem conexão, timeout, etc.)
    console.error('Erro de Rede:', networkError);
    throw new Error('Falha na conexão com o servidor. Verifique sua rede.');
  }

  // O Fetch não lança erro para status 4xx ou 5xx, então tratamos manualmente:
  if (!response.ok) {
    // Trata o erro 401 (Não Autorizado/Token Expirado)
    if (response.status === 401) {
      window.location.href = '/login'; 
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    // Tenta ler o body da resposta para pegar a mensagem de erro do backend
    const errorBody: ErrorBody = await response.json().catch(() => ({ message: response.statusText }));
    
    // Lança um erro mais detalhado
    throw new Error(errorBody.message || `Erro do Servidor: ${response.status}`);
  }

  // 4. Converte o corpo para JSON automaticamente
  // Verifique se a resposta tem conteúdo (ex: resposta 204 No Content não tem body)
  const contentType: string | null = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    // O tipo T é injetado aqui
    return response.json() as Promise<T>;
  }
  
  // Retorna a resposta crua
  return response.text().then(text => text ? null : null); // Retorna null para 204 No Content, ou se for texto puro
}

// Interface para tipar o objeto 'api' exportado
interface ApiMethods {
  get: <T>(endpoint: string, options?: ApiFetchOptions) => Promise<T | null>;
  post: <T, D = unknown>(endpoint: string, body: D, options?: ApiFetchOptions) => Promise<T | null>;
  put: <T, D = unknown>(endpoint: string, body: D, options?: ApiFetchOptions) => Promise<T | null>;
  delete: <T, D>(endpoint: string, body: D, options?: ApiFetchOptions) => Promise<T | null>;
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