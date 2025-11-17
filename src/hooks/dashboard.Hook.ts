import { useEffect, useState } from 'react';
import { Dashboard } from '../interfaces/dashboard.interface';
import { dashboardService } from '../services/dashboard.Service';

export const useDashboardData = () => {

    const [data, setData] = useState<Dashboard | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getDashboard = async () => {
        try {
            const response: Dashboard = await dashboardService.listDashboard();
            console.log("salve:", response);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Usuário não autorizado.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboard();
    }, []);

    return {
        data,
        loading,
        error
    };
};
