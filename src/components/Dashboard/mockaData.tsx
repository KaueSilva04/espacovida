// mockaData.ts

import { MockData } from "./types";

// Mock completo no formato que o Dashboard espera
const mockData: MockData = {
    totalEvents: 10,
    totalParticipants: 380,
    averageParticipants: 38,

    futureEvents: 4,
    pastEvents: 6,

    eventsDistribution: [
        { name: "Futuros", value: 4 },
        { name: "Passados", value: 6 }
    ],

    participantsMonthly: {
        "2024": [
            { name: "Jan", participantes: 30 },
            { name: "Fev", participantes: 20 },
            { name: "Mar", participantes: 50 },
            { name: "Abr", participantes: 40 },
            { name: "Mai", participantes: 60 },
            { name: "Jun", participantes: 70 },
            { name: "Jul", participantes: 20 },
            { name: "Ago", participantes: 30 },
            { name: "Set", participantes: 40 },
            { name: "Out", participantes: 60 },
            { name: "Nov", participantes: 50 },
            { name: "Dez", participantes: 30 }
        ],

        "2025": [
            { name: "Jan", participantes: 20 },
            { name: "Fev", participantes: 35 },
            { name: "Mar", participantes: 55 },
            { name: "Abr", participantes: 25 },
            { name: "Mai", participantes: 70 },
            { name: "Jun", participantes: 80 },
            { name: "Jul", participantes: 40 },
            { name: "Ago", participantes: 60 },
            { name: "Set", participantes: 45 },
            { name: "Out", participantes: 90 },
            { name: "Nov", participantes: 110 },
            { name: "Dez", participantes: 75 }
        ]
    },


    nextEvents: [
        {
            id: 1,
            title: "Workshop de Tecnologia",
            date: "2025-03-10",
            location: "São Paulo"
        },
        {
            id: 2,
            title: "Conferência de TI",
            date: "2025-03-20",
            location: "Rio de Janeiro"
        }
    ],

    topEvents: [
        {
            id: 3,
            title: "teste",
            participants: 120,
        },
        {
            id: 4,
            title: "teste2",
            participants: 90,
        }
    ]
};

export default mockData;
