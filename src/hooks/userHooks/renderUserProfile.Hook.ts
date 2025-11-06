import { useState } from 'react';
import { userProfile } from '../../interfaces/userInterfaces/userProfile.Interface';
import { renderUserProfile } from '../../services/userServices/renderUserProfile.Service';

export const useRenderProfile = () => { 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const renderUser = async (): Promise<userProfile | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await renderUserProfile.userProfile();

            console.log(response);

            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao carregar o perfil.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        renderUser,
        loading,
        error
    };
};