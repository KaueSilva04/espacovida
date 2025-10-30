export interface ApiResponse<T> {
  status: 'ok' | 'error' | 'fail' | string;
  message: string;
  data: T;
}

export default ApiResponse