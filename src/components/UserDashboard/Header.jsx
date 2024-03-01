import {AppBar, Toolbar, IconButton, Tooltip} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userAuth");
        navigate('/');
    };
    const handleBack = () => {
        navigate('/');
    };
    return (
        <AppBar position="static" sx={{maxWidth:'false', background: 'black' }}>
            <Toolbar>
                <Tooltip title="Back">
                    <IconButton onClick={handleBack} color="inherit">
                        <ArrowBackIosNewIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                <div style={{ flexGrow: 1 }}></div>
                <Tooltip title="Logout">
                    <IconButton onClick={handleLogout} color="inherit">
                        <ExitToAppIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );

}

export default Header;
