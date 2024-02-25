import { Navigate } from 'react-router-dom';

function AdminRoute({ element }) {
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    const isAdmin = userAuth && userAuth.user.role === 'ADMIN';

    return isAdmin ? element : <Navigate to="/login" />;
}

export default AdminRoute;
