import { useState } from 'react';
import { creatEventService } from '../../services/participantServices/newParticipant.Service';
import { newParticipant } from '../../interfaces/participantInterfaces/newParticipant.Interface';
import { returnParticipant } from '../../interfaces/participantInterfaces/returnParticipant.Interface';

export const useNewParticipant = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createParticipant = async (participantData: newParticipant): Promise<returnParticipant | null> => {
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