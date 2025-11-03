import { useState } from 'react';
import { user } from '../../interfaces/userInterfaces/user.Interface'; 
import { userId } from '../../interfaces/userInterfaces/userId.Interface';
import { listUserByIdService } from '../../services/userServices/listUserById.Service'; 

export const useUserById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Estado para armazenar o usuário encontrado
    const [userData, setUserData] = useState<user | null>(null); 

    
    const fetchUserById = async (idPayload: userId): Promise<user | null> => {
        try {
            setLoading(true);
            setError(null);
            setUserData(null);

            // Assumimos que o userId.Interface tem a propriedade 'id'
            const response = await listUserByIdService.getUserById(idPayload.id); 
            
            setUserData(response);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao buscar o usuário.');
            setUserData(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchUserById,
        userData,
        loading,
        error
    };
};