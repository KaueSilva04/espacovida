import { useState } from 'react';
import { deleteParticipantService } from '../../services/participantServices/deleteParticipant.Service';
import { deleteParticipantInterface } from '../../interfaces/participantInterfaces/deleteParticipant.Interface';

// Define a interface do que o hook irá retornar para o componente
interface UseDeleteParticipantResult {
  isLoading: boolean;
  error: string | null;
  // A função de mutação que o componente chamará
  deleteParticipant: (data: deleteParticipantInterface) => Promise<number>;
}

export function useDeleteParticipant(): UseDeleteParticipantResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteParticipantMutation = async (data: deleteParticipantInterface): Promise<number> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Chama o service que faz a requisição e desembrulha o JSON
      const result = await deleteParticipantService.deleteParticipant(data);
      
      // Retorna o objeto completo do evento tipado
      return result; 
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
    deleteParticipant: deleteParticipantMutation,
  };
}