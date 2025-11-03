import api from '../../api/apiClient';
import { user } from '../../interfaces/userInterfaces/user.Interface';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const listAllUsersService = {
    async listAllUsers(): Promise<user[]> {
        const response = await api.get<ApiResponse<user[]>>('/user/listall');

        if (!response) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            const errorMessage = response.message || 'Falha ao listar os usuários.';
            throw new Error('API Error: ' + errorMessage);
        }

        return response.data;
    }
}