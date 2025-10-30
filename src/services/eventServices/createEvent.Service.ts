import api from '../../api/apiClient';
import createEvent from '../../interfaces/eventInterfaces/createEvent.Interface';
import completeEvent from '../../interfaces/eventInterfaces/completeEvent.Interface';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const creatEventService = {
    async createEvent(data: createEvent): Promise<completeEvent> {
        const response = await api.post<ApiResponse<completeEvent>, createEvent>('/event', data)

        if (!response || !response.data) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + response.message)
        }

        return response.data;
    }
}