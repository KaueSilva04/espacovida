import api from '../../api/apiClient';
import { createUser } from '../../interfaces/userInterfaces/createUser.Interface';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const createUserService = {
    async createUser(data: createUser): Promise<createUser> {
        console.log('=== CREATE USER SERVICE ===');
        console.log('Dados recebidos:', data);
        
        try {
            // ✅ Validar campos obrigatórios
            if (!data.username || !data.password) {
                throw new Error('Username e password são obrigatórios');
            }

            console.log('Service - Validação OK, enviando para API...');
            
            const response = await api.post<ApiResponse<createUser>>(
                '/user/register',
                data
            );

            console.log('Service - Response recebida:', response);

            // ✅ Verificar se response existe
            if (!response) {
                throw new Error('Sem resposta da API');
            }

            // ✅ Verificar se status é ok
            if (response.status !== 'ok') {
                throw new Error(response.message || 'Erro ao criar usuário');
            }

            // ✅ Verificar se data existe
            if (!response.data) {
                console.warn('Aviso: response.data vazio, retornando dados enviados');
                return data;
            }

            console.log('Service - Usuário criado com sucesso:', response.data);
            return response.data;
        } catch (error) {
            console.error('Service - Erro:', error);
            
            if (error instanceof Error) {
                throw error;
            }
            
            throw new Error('Erro desconhecido ao criar usuário');
        }
    }
}
