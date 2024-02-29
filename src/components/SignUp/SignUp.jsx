import {useState} from 'react';
import {TextField, Button, Container, Box, IconButton, Tooltip, Alert} from '@mui/material';
import {post} from "../../utils/httpClient.js";
import {useNavigate} from 'react-router-dom';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";


function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await post("/users/sign-up", {firstName, lastName, username, password});
            if (response.error) {
                setErrorMessage("Sign up failed. Please try again.");
                setFirstName("");
                setLastName("");
                setUsername("");
                setPassword("");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("An error occurred during signup:", error);
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
                        name="firstName"
                        label="First Name"
                        type="firstName"
                        id="firstName"
                        value={firstName}
                        onChange={handleFirstNameChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoFocus
                        value={lastName}
                        onChange={handleLastNameChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
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
                        Sign Up
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        color="primary"
                        onClick={() => navigate('/login')}
                    >
                        Already have an account?
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default SignUp;
