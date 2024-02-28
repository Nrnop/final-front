import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

function AdminRoute({ element }) {
    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    const isAdmin = userAuth && userAuth.user.role === 'ADMIN';

    return isAdmin ? element : <Navigate to="/login" />;
}
AdminRoute.propTypes = {
    element: PropTypes.element.isRequired,
};
export default AdminRoute;
