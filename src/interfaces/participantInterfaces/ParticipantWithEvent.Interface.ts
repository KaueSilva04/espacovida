interface IEvent {
    idevent: number;
    title: string;
}

export interface ParticipantWithEvent {
    idparticipant: number;
    name: string;
    email: string;
    phone: string;
    eventId: number;
    event: IEvent;
}

export default ParticipantWithEvent