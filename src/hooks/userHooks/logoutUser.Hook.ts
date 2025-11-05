import { logoutUserService } from '../../services/userServices/logoutUser.Service';

export const useLogoutUser = () => {

    const logoutUser = async (): Promise<void> => {
        try {
            await logoutUserService.logoutUser();
            localStorage.removeItem('isAuthenticated');
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'An error occurred while trying to logout');
        }
    }
    return {
        logoutUser
    }
}