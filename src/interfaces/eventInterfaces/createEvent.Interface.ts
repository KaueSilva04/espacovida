export interface createEvent {
    title: string;
    location: string;
    date: string;
    description: string;
    coverImageUrl?: string | null;
    imagePublicId?: string | null;
}

export default createEvent