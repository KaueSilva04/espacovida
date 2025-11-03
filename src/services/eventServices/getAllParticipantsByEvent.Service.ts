import api from '../../api/apiClient';
import ApiResponse from '../../interfaces/ApiResponse.Interface';
import completeParticipant from '../../interfaces/participantInterfaces/completeParticipant.Interface';

export const getAllParticipantsByEventService = {
    async getAllParticipantsByEvent(eventId: number): Promise<completeParticipant[]> {
        const response = await api.get<ApiResponse<completeParticipant[]>>(`/event/participants?eventId=${eventId}`)

        if (!response || !response.data) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + response.message)
        }

        return response.data
    }
}