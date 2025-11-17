import api from '../api/apiClient';
import ApiResponse from '../interfaces/ApiResponse.Interface';
import { Dashboard } from '../interfaces/dashboard.interface'

export const dashboardService = {
  async listDashboard(): Promise<Dashboard> {
    const response = await api.get<ApiResponse<Dashboard>>('/dashboard');

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


