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
            
            // Chama o service que faz a requisição DELETE com o JSON body.
            await deleteUserService.deleteUser(userToDelete);
            
            // Se chegou aqui, a operação foi bem-sucedida.
            
        } catch (err) {
            // Captura o erro, define o estado de erro e propaga (lança) o erro.
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'An error occurred while deleting the participant';
            setError(errorMessage);
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