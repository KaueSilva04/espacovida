interface IEvent {
    idevent: number;
    title: string;
}

export interface returnParticipant {
    idparticipant: number;
    name: string;
    email: string;
    phone: string;
    eventId: number;
    event: IEvent;
}

export default returnParticipant