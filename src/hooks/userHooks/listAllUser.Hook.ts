import { useState } from 'react';
import { user } from '../../interfaces/userInterfaces/user.Interface'; 
import { listAllUsersService } from '../../services/userServices/listAllUser.Service'; 

export const useListAllUsers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<user[]>([]); 
    const listAllUsers = async (): Promise<user[] | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await listAllUsersService.listAllUsers();
            
            setUsers(response); // Armazena a lista de usuários no estado
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao listar os usuários.');
            setUsers([]); // Limpa a lista em caso de erro
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        listAllUsers, // Função para chamar a API
        users,        // Dados resultantes
        loading,
        error
    };
};