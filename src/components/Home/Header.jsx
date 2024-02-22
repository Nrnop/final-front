import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("userAuth");


    const navigateToDashboard = () => {
        navigate('/UserDashboard'); // Navigate to the dashboard page
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
