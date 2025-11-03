import { useState } from 'react';
import { getAllParticipantsByEventService } from '../../services/eventServices/getAllParticipantsByEvent.Service'
import { completeParticipant } from '../../interfaces/participantInterfaces/completeParticipant.Interface'

interface UseGetAllParticipantByEventResult {
    isLoading: boolean;
    error: string | null;
    getAllParticipantByEvent: (eventId: number) => Promise<completeParticipant[]>;
}

export function useGetAllParticipantByEvent(): UseGetAllParticipantByEventResult {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAllParticipantByEventMutation = async (eventId: number): Promise<completeParticipant[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const participants = await getAllParticipantsByEventService.getAllParticipantsByEvent(eventId);
            return participants
        } catch (e) {
            const errorMessage = (e instanceof Error)
                ? e.message
                : "Erro desconhecido ao criar o evento.";

            setError(errorMessage);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        getAllParticipantByEvent: getAllParticipantByEventMutation,
    }
}