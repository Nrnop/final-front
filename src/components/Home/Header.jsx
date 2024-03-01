import {AppBar, Toolbar, Typography, IconButton, Tooltip} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import './Header.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
        <AppBar position="static" sx={{ background: 'black' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Movie Tracer
                </Typography>
                {!isLoggedIn ? (
                    <Tooltip title="Login">
                        <IconButton onClick={handleLoginButton} color="inherit">
                            <LoginIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Dashboard">
                        <IconButton onClick={navigateToDashboard} color="inherit">
                            {userRole === 'ADMIN' ? <DashboardIcon fontSize="large" /> : <AccountCircleIcon fontSize="large" />}
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
