import { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { post } from "../../utils/httpClient.js";
import { useNavigate } from 'react-router-dom';

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
            const response = await post("/users/login", { username, password });
            if (response.error) {
                setErrorMessage("Login failed. Please try again.");
                setUsername("");
                setPassword("");
            } else {
                localStorage.setItem("userAuth", JSON.stringify(response));

                const userRole = response.user.role;
                console.log(userRole);

                if (userRole === 'ADMIN') {
                    navigate("/admin-dashboard");
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
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <form onSubmit={handleSubmit}>
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
                    Don't have an account yet?
                </Button>
                <Button
                    fullWidth
                    variant="text"
                    color="secondary"
                    onClick={() => navigate('/')}
                    sx={{ mt: 1 }}
                >
                    Home
                </Button>
            </form>
        </Container>
    );
}

export default Login;
