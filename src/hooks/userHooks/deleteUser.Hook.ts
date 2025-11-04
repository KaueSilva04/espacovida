import { useState } from 'react';
import { deleteUserService } from '../../services/userServices/deleteUser.Service'; 
import { deleteUser } from '../../interfaces/userInterfaces/deleteUser.Interface'; 

export const useDeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteUserMutation = async (userToDelete: deleteUser): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Hook - Chamando service com:', userToDelete);
            
            await deleteUserService.deleteUser(userToDelete);
            
            console.log('Hook - Usuário deletado com sucesso');
            
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Erro ao deletar usuário';
            setError(errorMessage);
            console.error('Hook - Erro:', errorMessage);
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteUser: deleteUserMutation,
        loading,
        error
    };
};
