import {AppBar, Toolbar, Typography, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();

    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    const isLoggedIn = userAuth != null;
    const userRole = isLoggedIn ? userAuth.user.role : '';

    const navigateToDashboard = () => {
        if (userRole === 'ADMIN') {
            navigate('/admin-dashboard');
        } else {
            navigate('/dashboard');
        }
    };
    const handleLoginButton = () => {
        navigate('/login');

    }
    return (
        <AppBar position="static" className="header-toolbar">
            <Toolbar>
                <Typography variant="h6" className="header-title">
                    Movie Tracer
                </Typography>
                {!isLoggedIn ? (
                    <>
                        <Button onClick={handleLoginButton} color="inherit" className="header-login-signup" >Login</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" className="header-login-signup"
                                onClick={navigateToDashboard}>Dashboard</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
