import React, { useEffect, useState } from 'react';
import { get } from "../../utils/httpClient.js";
import { useNavigate } from "react-router-dom";
import {Button, Container, Typography, Card, CardContent, CardMedia, Grid, Box} from "@mui/material";
import './UserDashboard.css';
import Rating from '@mui/lab/Rating'; // Import Rating component


function UserDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [totalWatchTime, setTotalWatchTime] = useState('');

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

    useEffect(() => {
        const storedData = localStorage.getItem("userAuth");
        if (storedData) {
            const userData = JSON.parse(storedData);
            setUser(userData.user);
        }
    }, []);

    useEffect(() => {
        if (user && user.id) {
            getWatchlist(user.id);
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("userAuth");
        navigate('/');
    };

    // Function to format movie duration from minutes to hours and minutes
    const formatDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}H ${mins}M`;
    };

    return (
        <Container className="container" maxWidth={false}>
            <Box className="box">
                <Typography variant="h4">Welcome, {user ? `${user.first_name} ${user.last_name}` : 'Guest'}</Typography>
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
                                    <Typography variant="body2" color="text.secondary" component="span" style={{ marginRight: 8 }} >
                                        {parseFloat(movie.rate).toFixed(1)}/5
                                    </Typography>
                                    <Rating name="read-only" value={parseFloat(movie.rate)} readOnly precision={0.5} />
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
        </Container>
    );
}

export default UserDashboard;
