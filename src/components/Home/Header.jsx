import {AppBar,Toolbar, Typography, Button} from '@mui/material';
import {Link} from 'react-router-dom';
import './Header.css';

function Header() {

    return (
        <AppBar position="static" className="header-toolbar">
            <Toolbar>
                <Typography variant="h6" className="header-title">
                    Movie Tracer
                </Typography>
                <Button color="inherit" className="header-login-signup" component={Link} to="/login">Login</Button>
                <Button color="inherit" className="header-login-signup" component={Link} to="/sign-up">Signup</Button>
            </Toolbar>
        </AppBar>

    );
}

export default Header;
