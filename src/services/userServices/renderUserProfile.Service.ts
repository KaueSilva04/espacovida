import api from '../../api/apiClient';
import userProfile from '../../interfaces/userInterfaces/userProfile.Interface';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const renderUserProfile = {
    async userProfile(): Promise<userProfile> {
        const response = await api.get<ApiResponse<userProfile>>('/user/renderprofile')

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