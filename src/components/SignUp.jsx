import  { useState } from 'react';
import { Link } from "react-router-dom";
import { TextField, Button, Grid, Typography, Container } from '@mui/material';


function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3000/users/create', {
            method: 'POST',
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json();

        } else {
            console.error('Error in signing up:', response.statusText);
        }
    }


    return (
        <Container component="main" maxWidth="xs">
            <div>
                <Typography variant="h5">Register</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Link to="/login" style={{ textDecoration: "none", marginRight: "10px" }}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Sign Up
                        </Button>
                    </Link>

                </form>
            </div>
        </Container>
    );
}

export default SignUp;
