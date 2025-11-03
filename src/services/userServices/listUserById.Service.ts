import api from '../../api/apiClient';
import { user } from '../../interfaces/userInterfaces/user.Interface'; 
import ApiResponse from '../../interfaces/ApiResponse.Interface';
import { userId } from '../../interfaces/userInterfaces/userId.Interface';

export const listUserByIdService = {
    async getUserById(userId: number): Promise<user> {
        const payload: userId = { id: userId }; 
        
        // Requisição POST para enviar o ID no corpo JSON
        // Nota: Altere '/user/search-by-id' para o endpoint exato da sua API
        const response = await api.post<ApiResponse<user>,userId>('/user/listid', payload); 

        if (!response) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            const errorMessage = response.message || `Falha ao buscar usuário com ID: ${userId}.`;
            throw new Error('API Error: ' + errorMessage);
        }

        return response.data;
    }
}