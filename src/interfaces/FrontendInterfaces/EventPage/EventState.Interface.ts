import { completeEvent } from '../../eventInterfaces/completeEvent.Interface'
import { completeParticipant } from '../../participantInterfaces/completeParticipant.Interface'

interface EventState extends completeEvent {
    coverImageUrl?: string;
    id: number;
    title: string;
    description: string;
    time: string;
    participants: completeParticipant[];
    status: 'upcoming' | 'completed' | 'cancelled' | string;
    date: string;
    location: string;
}

export default EventState