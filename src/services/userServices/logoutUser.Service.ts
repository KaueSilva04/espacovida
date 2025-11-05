import api from '../../api/apiClient';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const logoutUserService = {
    async logoutUser(): Promise<void> {
        const response = await api.post<ApiResponse<null>>('/user/logout', null);

        if (!response) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + response.message);
        }
    },
};
