import { Navigate } from 'react-router-dom';

type Props = {
    element: JSX.Element;
};

export function PublicRoute({ element }: Props) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? <Navigate to="/System" replace /> : element;
}
