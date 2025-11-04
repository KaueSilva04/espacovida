import { useState } from 'react';
import { createUser } from '../../interfaces/userInterfaces/createUser.Interface'
import { createUserService } from '../../services/userServices/createUser.Service';


export const useCreateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createUser = async (userData: createUser): Promise<createUser | null> => {
        try {
            console.log('=== Hook - Criando usuário ===');
            console.log('Dados:', userData);
            
            setLoading(true);
            setError(null);

            const response = await createUserService.createUser(userData);
            
            console.log('Hook - Sucesso:', response);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
            setError(errorMessage);
            console.error('Hook - Erro:', errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createUser,
        loading,
        error
    };
};
