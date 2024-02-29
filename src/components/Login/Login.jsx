import {useEffect, useState} from 'react';
import {TextField, Button, Container, Alert, Tooltip, IconButton, Box} from '@mui/material';
import {post} from "../../utils/httpClient.js";
import {useNavigate} from 'react-router-dom';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userAuth = JSON.parse(localStorage.getItem("userAuth"));
        if (userAuth && userAuth.id) {
            navigate("/");
        }
    }, [navigate]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await post("/users/login", {username, password});
            if (response.error) {
                setErrorMessage("Login failed. Please try again.");
                setUsername("");
                setPassword("");
            } else {
                localStorage.setItem("userAuth", JSON.stringify(response));
                const userRole = response.user.role;
                if (userRole === 'ADMIN') {
                    navigate("/admin-dashboard/movies");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    };


    return (
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
                <IconButton aria-label="back" color="primary" onClick={() => navigate(-1)}>
                    <Tooltip title="Back">
                        <ArrowBackIosNewIcon fontSize="large"/>
                    </Tooltip>
                </IconButton>
            </Box>
            <Box sx={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        color="primary"
                        onClick={() => navigate('/sign-up')}
                    >
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        Don't have an account yet?
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Login;
