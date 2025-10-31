import api from '../../api/apiClient';
import ApiResponse from '../../interfaces/ApiResponse.Interface';

export const deleteEventService = {
    async deleteEvent(idEvent: number): Promise<ApiResponse<null>> {
        const response = await api.delete<ApiResponse<null>, object>('/event', {"id": idEvent})

        if (!response) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + response.message)
        }

        return response;
    }
}