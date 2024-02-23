import React, { useEffect, useState } from 'react';
import { get, put } from "../../utils/httpClient.js";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Card, CardContent, CardMedia, Grid, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import './UserDashboard.css';
import Rating from '@mui/lab/Rating'; // Import Rating component

function UserDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [totalWatchTime, setTotalWatchTime] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editUserInfo, setEditUserInfo] = useState({
        username: '',
        first_name: '',
        last_name: '',
        bio: ''
    });

    useEffect(() => {
        const storedData = localStorage.getItem("userAuth");
        if (storedData) {
            const userData = JSON.parse(storedData);
            setUser(userData.user);
            setEditUserInfo({
                username: userData.user.username,
                first_name: userData.user.first_name,
                last_name: userData.user.last_name,
                bio: userData.user.bio
            });
        }
    }, []);

    useEffect(() => {
        if (user && user.id) {
            getWatchlist(user.id);
        }
    }, [user]);

    const getWatchlist = async (userId) => {
        try {
            const result = await get(`/users/${userId}/watchlist`);
            setWatchlist(result);
            calculateTotalWatchTime(result);
        } catch (error) {
            console.error('Error fetching watchlist', error);
        }
    };

    const calculateTotalWatchTime = (movies) => {
        const totalMinutes = movies.reduce((acc, movie) => acc + movie.duration_minutes, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const remainingHours = hours % 24;
        const formattedWatchTime = `${months}M ${remainingHours}H ${minutes}M`;
        setTotalWatchTime(formattedWatchTime);
    };

    const handleLogout = () => {
        localStorage.removeItem("userAuth");
        navigate('/');
    };

    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleUserInfoChange = (event) => {
        const { name, value } = event.target;
        setEditUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const formatDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}H ${mins}M`;
    };

    const updateUserInfo = async () => {
        const storedData = localStorage.getItem("userAuth");
        if (storedData) {
            const authData = JSON.parse(storedData);
            const { user } = authData;

            const body = {
                firstName: editUserInfo.first_name,
                lastName: editUserInfo.last_name,
                username: editUserInfo.username,
                bio: editUserInfo.bio
            };

            try {
                console.log('Sending update request with body:', body);
                // Assuming your API endpoint to include the user ID in the URL for a PUT request
                const response = await put(`/users/${user.id}/updateUserInfo`, body);
                console.log('Update response:', response);

                // Assuming the backend response directly contains the updated user info
                const updatedUser = { ...user, ...response };
                setUser(updatedUser); // Update React state

                // Update local storage
                localStorage.setItem("userAuth", JSON.stringify({ ...authData, user: updatedUser }));

                handleEditDialogClose(); // Close the dialog on success
            } catch (error) {
                console.error('Error updating user info:', error);
            }
        } else {
            console.log('No user data found in local storage.');
        }
    };


    return (
        <Container className="container" maxWidth={false}>
            <Box className="box">
                <Typography variant="h4">Welcome, {user ? `${user.first_name} ${user.last_name}` : 'Guest'}</Typography>
                <Button variant="outlined" onClick={handleEditDialogOpen} style={{marginLeft: '20px'}}>
                    Edit Profile
                </Button>
                <Button className="logoutButton" variant="contained" color="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
            <Grid container spacing={2}>
                {user && (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Username: {user.username}</Typography>
                        <Typography variant="subtitle1">Bio: {user.bio}</Typography>
                        <Typography variant="subtitle1">Total Watch Time: {totalWatchTime}</Typography>
                    </Grid>
                )}

                {watchlist.map((movie) => (
                    <Grid item xs={5} sm={3} md={2} lg={1.5} key={movie.id}>
                        <Card>
                            {movie.poster_image_url && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={movie.poster_image_url}
                                    alt={movie.movie_name}
                                />
                            )}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {movie.movie_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Year: {movie.year}
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="body2" color="text.secondary" component="span"
                                                style={{marginRight: 8}}>
                                        {parseFloat(movie.rate).toFixed(1)}/5
                                    </Typography>
                                    <Rating name="read-only" value={parseFloat(movie.rate)} readOnly precision={0.5}/>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Duration: {formatDuration(movie.duration_minutes)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Director: {movie.director}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editUserInfo.username}
                        onChange={handleUserInfoChange}
                    />
                    <TextField
                        margin="dense"
                        name="first_name"
                        label="First Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editUserInfo.first_name}
                        onChange={handleUserInfoChange}
                    />
                    <TextField
                        margin="dense"
                        name="last_name"
                        label="Last Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editUserInfo.last_name}
                        onChange={handleUserInfoChange}
                    />
                    <TextField
                        margin="dense"
                        name="bio"
                        label="Bio"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={editUserInfo.bio}
                        onChange={handleUserInfoChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button onClick={updateUserInfo}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default UserDashboard;
