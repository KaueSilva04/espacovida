import { useState } from 'react';
import { loginUser } from '../../interfaces/userInterfaces/loginUser.Interface';
import { loginUserService } from '../../services/userServices/loginUser.Service';


export const useloginUser = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loginUser = async (userData: loginUser): Promise<number | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await loginUserService.loginUser(userData);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while trying to login');
            return null;
        }finally{
            setLoading(false);
        }
    }

    return {
        loginUser,
        loading,
        error
    }
}