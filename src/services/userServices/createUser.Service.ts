import api from '../../api/apiClient';
import { createUser } from '../../interfaces/userInterfaces/createUser.Interface';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const creatUserService = {
    async createUser(data: createUser): Promise<createUser> {
        console.log('=== CREATE USER SERVICE ===');
        console.log('Dados enviados:', data);
        
        const response = await api.post<ApiResponse<createUser>, createUser>(
            '/user/register',
            data
        );

        console.log('Response recebida:', response);

        // ✅ Verificar se response existe
        if (!response) {
            throw new Error('Sem resposta da API');
        }

        // ✅ Verificar se status é ok
        if (response.status !== 'ok') {
            throw new Error('API Error: ' + (response.message || 'Erro ao criar usuário'));
        }

        // ✅ Verificar se data existe
        if (!response.data) {
            console.warn('Aviso: response.data vazio, retornando dados enviados');
            return data;  // Retorna os dados que foram enviados como fallback
        }

        console.log('Usuário criado com sucesso:', response.data);
        return response.data;
    }
}
