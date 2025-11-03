import { useState } from 'react';
import { createUser } from '../../interfaces/userInterfaces/createUser.Interface'
import { creatUserService } from '../../services/userServices/createUser.Service';

export const useCreateUser = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createUser = async (userData: createUser): Promise<createUser | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await creatUserService.createUser(userData);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while creating the participant');
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