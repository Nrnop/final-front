// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element: Component }) {
    const isLoggedIn = localStorage.getItem("userAuth"); // Check if user is logged in

    return isLoggedIn ? Component : <Navigate to="/login" />;
}
export default ProtectedRoute;