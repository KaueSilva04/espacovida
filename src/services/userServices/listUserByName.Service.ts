import api from '../../api/apiClient';
import { userName } from '../../interfaces/userInterfaces/userName.Interface'; 
import { user } from '../../interfaces/userInterfaces/user.Interface'; 
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const listUsersByNameService = {
    async listUsersByName(namePayload: userName): Promise<user[]> {
        
        const response = await api.post<ApiResponse<user[]>, userName>('/user/listname', namePayload); 

        if (!response) {
            throw new Error('No response from API');
        }
        if (response.status !== 'ok') {
            const errorMessage = response.message || 'Falha ao buscar usuários por nome.';
            throw new Error('API Error: ' + errorMessage);
        }

        return response.data;
    }
}