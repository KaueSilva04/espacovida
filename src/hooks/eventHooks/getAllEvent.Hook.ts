import { useState } from 'react';
import { getAllEventService } from '../../services/eventServices/getAllEvent.Service';
import completeEvent from '../../interfaces/eventInterfaces/completeEvent.Interface';

export const useGetAllEvent = () => {
    // Estado para indicar se a requisição está em andamento
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Estado para armazenar a lista de eventos
    const [data, setData] = useState<completeEvent[] | null>(null); // Tipagem correta
    // Estado para armazenar qualquer erro que ocorra
    const [error, setError] = useState<string | null>(null);

    /**
     * Função para buscar todos os eventos e armazená-los no estado 'data'.
     */
    const fetchEvents = async (): Promise<void> => { // Renomeado para 'fetchEvents'
        setIsLoading(true);
        setError(null);
        setData(null); // Limpa dados anteriores

        try {
            // 1. CHAMA O SERVICE E ARMAZENA A RESPOSTA
            const eventsList = await getAllEventService.getAllEvent();
            
            // 2. ATUALIZA O ESTADO COM OS DADOS OBTIDOS
            setData(eventsList);

        } catch (e) {
            // 3. Captura e trata erros
            const errorMessage = e instanceof Error ? e.message : 'Falha desconhecida ao pegar eventos do banco.';
            setError(errorMessage);
            throw new Error(errorMessage); 

        } finally {
            setIsLoading(false);
        }
    };

    return {
        // Retorna a função com o nome mais apropriado para leitura
        getAllEvent: fetchEvents, // <--- FUNÇÃO CORRIGIDA
        data, 
        isLoading,
        error,
    };
};