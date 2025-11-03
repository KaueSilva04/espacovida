import api from '../../api/apiClient';
import ApiResponse from '../../interfaces/ApiResponse.Interface';
import ParticipantWithEvent from '../../interfaces/participantInterfaces/ParticipantWithEvent.Interface'
import newParticipant from '../../interfaces/participantInterfaces/newParticipant.Interface'

export const creatEventService = {
    async createEvent(data: newParticipant): Promise<ParticipantWithEvent> {
        const response = await api.post<ApiResponse<ParticipantWithEvent>, newParticipant>('/participant/', data)

        if (!response || !response.data) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + response.message)
        }

        return response.data;
    }
}