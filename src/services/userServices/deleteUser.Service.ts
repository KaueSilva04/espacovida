import api from '../../api/apiClient';
import { deleteUser } from '../../interfaces/userInterfaces/deleteUser.Interface'; 
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const deleteUserService = {
    async deleteUser(userToDelete: deleteUser): Promise<void> {
        try {
            console.log('=== SERVICE DELETE ===');
            console.log('userToDelete:', userToDelete);
            
            const response = await api.delete<ApiResponse<null>, deleteUser>(
                '/user',
                userToDelete
            );

            console.log('Response:', response);

            if (!response) {
                throw new Error('No response from API');
            }

            if (response.status !== 'ok') {
                throw new Error(response.message || 'Falha ao deletar usuário.');
            }

            return;
        } catch (error) {
            console.error('=== ERRO DETALHADO ===');
            console.error('Tipo do erro:', error instanceof Error ? 'Error' : typeof error);
            console.error('Mensagem:', error instanceof Error ? error.message : error);
            console.error('Stack completo:', error instanceof Error ? error.stack : 'N/A');
            
            // Log de todos os valores locais
            console.error('userToDelete:', userToDelete);
            
            throw error;
        }
    }
}
