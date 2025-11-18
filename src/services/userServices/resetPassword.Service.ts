import api from '../../api/apiClient';
import { ResetPassword } from '../../interfaces/userInterfaces/resetPassword.Interface';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const resetPasswordService = {
    async resetPassword(data: ResetPassword): Promise<number> {
       
        const response = await api.put<ApiResponse<any>, ResetPassword>('/user/resetpassword', data);
        console.log('[Service] Resposta do Backend:', response);

        if (!response) {
            throw new Error('No response from API (Response is null)');
        }

        // 2. Verifica se o status é OK
        // Removemos a verificação '!response.data' porque o reset geralmente não retorna dados, só status.
        if (response.status !== 'ok') {
            throw new Error('API Error: ' + (response.message || 'Erro desconhecido'));
        }

        return 1;
    }
}