import api from '../../api/apiClient';
import createUser from '../../interfaces/userInterfaces/createUser.Interface';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const creatUserService = {
    async createEvent(data: createUser): Promise<createUser> {
        const response = await api.post<ApiResponse<createUser>, createUser>('/user', data)

        if (!response || !response.data) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + response.message)
        }

        return response.data;
    }
}