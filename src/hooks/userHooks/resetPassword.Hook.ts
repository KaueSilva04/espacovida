import { useState } from 'react';
import { ResetPassword } from '../../interfaces/userInterfaces/resetPassword.Interface';
import { resetPasswordService } from '../../services/userServices/resetPassword.Service';

export const useResetPassword = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Corrigido: A tipagem promete number ou null
    const reset = async (userData: ResetPassword): Promise<number | null> => {
        try {
            setLoading(true);
            setError(null);

            console.log("Chamando serviço de reset...", userData); // DEBUG

            const response = await resetPasswordService.resetPassword(userData);
            
            console.log("Resposta do serviço:", response); // DEBUG

            return response; // Espera-se que seja 1
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido ao redefinir senha';
            console.error("Erro capturado no Hook:", errorMsg); // DEBUG
            
            setError(errorMsg);
            return null; // Corrigido: deve retornar null, não false
        } finally {
            setLoading(false);
        }
    }

    return {
        reset,
        loading,
        error
    }
}