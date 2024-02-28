import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

function ProtectedRoute({ element: Component }) {
    const isLoggedIn = localStorage.getItem("userAuth"); // Check if user is logged in

    return isLoggedIn ? Component : <Navigate to="/login" />;
}
ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
};
export default ProtectedRoute;