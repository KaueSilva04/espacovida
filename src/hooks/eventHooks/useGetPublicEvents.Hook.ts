import { useEffect, useState } from 'react';
import { getAllEventService } from '../../services/eventServices/getAllEvent.Service';
import completeEvent from '../../interfaces/eventInterfaces/completeEvent.Interface';

// Imagens padrão rotativas
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515162305280-7b3b0d69c8c7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
];

export const useGetPublicEvents = () => {
  const [data, setData] = useState<completeEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retorna uma imagem default baseada no id do evento (pra ficar fixa e variada)
  const getDefaultImage = (id: number) => {
    const index = id % DEFAULT_IMAGES.length;
    return DEFAULT_IMAGES[index];
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const eventsList = await getAllEventService.getAllEvent();

      // adiciona imagem default se não houver coverImageUrl
      const formatted = eventsList.map((event: completeEvent) => ({
        ...event,
        coverImageUrl: event.coverImageUrl || getDefaultImage(event.idevent),
      }));

      setData(formatted);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Erro ao buscar eventos do servidor.';
      console.error('Erro ao carregar eventos:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events: data,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};
