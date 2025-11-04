import api from '../api/apiClient';
import ApiResponse from '../interfaces/ApiResponse.Interface';
import { auth } from '../interfaces/auth.interface'

export const authService = {
  async auth(): Promise<auth> {
    const response = await api.get<ApiResponse<auth>>('/costumer');

    if(!response){
      throw new Error('No response from API');
    }

    if(response.status !== 'ok'){
      const errorMessage = response.message || "Usuario não autorizado:";
    } 
    console.log(response.data);
    return response.data;
  },
};


