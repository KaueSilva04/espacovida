import api from '../../api/apiClient';
import ApiResponse from '../../interfaces/ApiResponse.Interface';
import deleteParticipantInterface from '../../interfaces/participantInterfaces/deleteParticipant.Interface';

export const deleteParticipantService = {
    async deleteParticipant(data: deleteParticipantInterface): Promise<number> {
        const response = await api.delete<ApiResponse<null>, deleteParticipantInterface>('/participant/', data)

        if (!response) {
            throw new Error('No response from API');
        }

        if (response.status !== 'ok') {
            throw new Error('API Error: ' + response.message)
        }

        return 0;
    }
}