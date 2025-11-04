import { useState } from 'react';
import { auth } from '../interfaces/auth.interface'
import { authService } from '../services/auth.Service';

export const useAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const checkAuth = async (): Promise<boolean> => {
        try {
            const response: auth = await authService.auth();
            console.log("salve : " + response.auth);
            return response.auth;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Usuario não autorizado.');
            return false;
        }
    };

    return {
        checkAuth,
        error
    };
}