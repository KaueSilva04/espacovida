import { useState } from 'react';
import { creatEventService } from '../../services/participantServices/newParticipant.Service';
import { newParticipant } from '../../interfaces/participantInterfaces/newParticipant.Interface';
import { ParticipantWithEvent } from '../../interfaces/participantInterfaces/ParticipantWithEvent.Interface';

export const useNewParticipant = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createParticipant = async (participantData: newParticipant): Promise<ParticipantWithEvent | null> => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await creatEventService.createEvent(participantData);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while creating the participant');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createParticipant,
        loading,
        error
    };
};