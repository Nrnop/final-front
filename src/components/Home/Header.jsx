import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();

    const userAuth = JSON.parse(localStorage.getItem("userAuth")); // Assuming userAuth is a JSON string containing user details
    const isLoggedIn = userAuth != null;
    const userRole = isLoggedIn ? userAuth.user.role : ''; // Assuming the role is stored in userAuth object

    const navigateToDashboard = () => {
        if (userRole === 'ADMIN') {
            navigate('/admin-dashboard'); // Navigate to the admin dashboard page if user is an admin
        } else {
            navigate('/dashboard'); // Navigate to the regular dashboard page
        }
    };

    return (
        <AppBar position="static" className="header-toolbar">
            <Toolbar>
                <Typography variant="h6" className="header-title">
                    Movie Tracer
                </Typography>
                {!isLoggedIn ? (
                    <>
                        <Button color="inherit" className="header-login-signup" component={Link} to="/login">Login</Button>
                        <Button color="inherit" className="header-login-signup" component={Link} to="/sign-up">Signup</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" className="header-login-signup" onClick={navigateToDashboard}>Dashboard</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
