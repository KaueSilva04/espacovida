import api from '../../api/apiClient';
import { updateUser } from '../../interfaces/userInterfaces/updateUser.interface'; 
import ApiResponse from '../../interfaces/ApiResponse.Interface';


export const updateUserService = {
    async updateUser(userToUpdate : updateUser): Promise<updateUser> {
        const response = await api.put<ApiResponse<updateUser>, updateUser>('/user', userToUpdate);

        if (!response) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + (response.message || 'Falha ao deletar participante.'));
        }

        return response.data;
    }
}