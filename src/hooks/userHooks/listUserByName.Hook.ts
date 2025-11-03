import { useState } from 'react';
import { user } from '../../interfaces/userInterfaces/user.Interface'; 
import { userName } from '../../interfaces/userInterfaces/userName.Interface';
import { listUsersByNameService } from '../../services/userServices/listUserByName.Service'; 

export const useListUsersByName = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<user[]>([]); 

    const fetchUsersByName = async (namePayload: userName): Promise<user[] | null> => {
        try {
            setLoading(true);
            setError(null);
            setUsers([]);

            const response = await listUsersByNameService.listUsersByName(namePayload);
            
            setUsers(response);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao buscar usuários.');
            setUsers([]);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchUsersByName,
        users,
        loading,
        error
    };
};