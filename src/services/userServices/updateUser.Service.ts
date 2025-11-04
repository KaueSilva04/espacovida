import api from '../../api/apiClient';
import { updateUser } from '../../interfaces/userInterfaces/updateUser.Interface'; 
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const updateUserService = {
    async updateUser(userToUpdate: updateUser): Promise<updateUser> {
        console.log('=== UPDATE USER SERVICE ===');
        console.log('userToUpdate:', userToUpdate);
        
        const response = await api.put<ApiResponse<updateUser>, updateUser>(
            '/user',      // endpoint
            userToUpdate  // body com { id, username?, adm? }
        );

        console.log('Response:', response);

        if (!response) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + (response.message || 'Falha ao atualizar usuário.'));
        }

        console.log('Usuário atualizado com sucesso');
        return response.data;
    }
}
