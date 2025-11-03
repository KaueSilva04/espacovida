import api from '../../api/apiClient';
import loginUser from '../../interfaces/userInterfaces/loginUser.Iterface';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const loginUserService = {
    async loginUser(data: loginUser): Promise<number> {
        const response = await api.post<ApiResponse<loginUser>, loginUser>('/user/login', data);

        if(!response || !response.data) {
            throw new Error('No response from API');
        }

        if(response.status !== 'ok'){
            throw new Error('API Error: ' + response.message)
        }
        return 1;
    }
}