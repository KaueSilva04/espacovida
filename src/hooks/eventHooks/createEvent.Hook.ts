import { useState } from 'react';
import { creatEventService } from '../../services/eventServices/createEvent.Service';
import { createEvent } from '../../interfaces/eventInterfaces/createEvent.Interface';
import { completeEvent } from '../../interfaces/eventInterfaces/completeEvent.Interface';

// Define a interface do que o hook irá retornar para o componente
interface UseCreateEventResult {
  isLoading: boolean;
  error: string | null;
  // A função de mutação que o componente chamará
  createEvent: (data: createEvent) => Promise<completeEvent>;
}

export function useCreateEvent(): UseCreateEventResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createEventMutation = async (data: createEvent): Promise<completeEvent> => {
    setIsLoading(true);
    setError(null);

    try {
      // Chama o service que faz a requisição e desembrulha o JSON
      const newEvent = await creatEventService.createEvent(data);

      // Retorna o objeto completo do evento tipado
      return newEvent;
    } catch (e) {
      // Captura o erro lançado pelo service
      const errorMessage = (e instanceof Error)
        ? e.message
        : "Erro desconhecido ao criar o evento.";

      setError(errorMessage);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createEvent: createEventMutation,
  };
}