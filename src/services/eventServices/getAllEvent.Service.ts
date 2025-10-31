import api from '../../api/apiClient';
import ApiResponse from '../../interfaces/ApiResponse.Interface';
import completeEvent from '../../interfaces/eventInterfaces/completeEvent.Interface';

export const getAllEventService = {
    async getAllEvent(): Promise<completeEvent[]> {
        const response = await api.get<ApiResponse<completeEvent[]>>('/event/all')

        if (!response || !response.data) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + response.message)
        }

        return response.data;
    }
}