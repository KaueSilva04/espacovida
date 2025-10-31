import api from '../../api/apiClient';
import { deleteUser } from '../../interfaces/userInterfaces/deleteUser.Interface'; 
import ApiResponse from '../../interfaces/ApiResponse.Interface';


export const deleteUserService = {
    async deleteUser(userToDelete: deleteUser): Promise<void> {
        const response = await api.delete<ApiResponse<null>, deleteUser>('/participant', userToDelete);

        if (!response) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + (response.message || 'Falha ao deletar participante.'));
        }

        return;
    }
}