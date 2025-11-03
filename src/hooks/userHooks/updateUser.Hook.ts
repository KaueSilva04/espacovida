import { useState } from 'react';
import { updateUser } from '../../interfaces/userInterfaces/updateUser.interface'; 
import { updateUserService } from '../../services/userServices/updateUser.Service'; 

export const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUser = async (userData: updateUser): Promise<updateUser | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await updateUserService.updateUser(userData);
            
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao atualizar o usuário.');
            return null;
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