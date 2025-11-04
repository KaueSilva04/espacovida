import { useState } from 'react';
import { updateUser } from '../../interfaces/userInterfaces/updateUser.Interface'; 
import { updateUserService } from '../../services/userServices/updateUser.Service'; 

export const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUser = async (userData: updateUser): Promise<updateUser | null> => {
        try {
            setLoading(true);
            setError(null);

            console.log('Hook - Atualizando com:', userData);
            
            const response = await updateUserService.updateUser(userData);
            
            console.log('Hook - Sucesso:', response);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao atualizar o usuário.';
            setError(errorMessage);
            console.error('Hook - Erro:', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUser,
        loading,
        error
    };
};
