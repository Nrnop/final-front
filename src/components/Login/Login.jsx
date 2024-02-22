import { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material'; // Import Alert for error message
import { post } from "../../utils/httpClient.js";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for storing error message
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
        event.preventDefault(); // Prevent default form submission behavior
        const response = await post("/users/login", { username, password });
        console.log(response);
        if (response.error) {
            setErrorMessage("Login failed. Please try again."); // Set error message
            setUsername("");
            setPassword("");
        } else {
            localStorage.setItem("userAuth", JSON.stringify(response));
            console.log('this is user')
            console.log(JSON.parse(localStorage.getItem("userAuth")));
            navigate("/");
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>} {/* Display error message */}
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
            </form>
        </Container>
    );
}

export default Login;
