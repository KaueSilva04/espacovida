import { useState } from 'react';
import { deleteEventService } from '../../services/eventServices/deleteEvent.Service'; // Ajuste o caminho conforme necessário

export const useDeleteEvent = () => {
  // Estado para indicar se a requisição está em andamento
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para armazenar qualquer erro que ocorra
  const [error, setError] = useState<string | null>(null);

   // param idEvent O ID do evento a ser deletado.
  const deleteEventMutation = async (idEvent: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteEventService.deleteEvent(idEvent);

    } catch (e) {
      // 3. Captura e trata erros
      const errorMessage = e instanceof Error ? e.message : 'Falha desconhecida ao deletar evento.';
      setError(errorMessage);
      throw new Error(errorMessage); 

    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteEvent: deleteEventMutation,
    isLoading,                        
    error,                            
  };
};