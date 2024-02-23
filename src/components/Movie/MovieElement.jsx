import './MovieElement.css';
import { Box, Rating, Button, Tooltip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { get, post } from "../../utils/httpClient.js";

const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}H ${mins}M`;
};

function MovieElement({ movie }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedData = localStorage.getItem("userAuth");
        if (storedData) {
            const userData = JSON.parse(storedData);
            setUser(userData.user);
            checkWatchlist(userData.user.id, movie.id);
        }
    }, [movie.id]);

    const checkWatchlist = async (userId, movieId) => {
        try {
            const response = await get(`/users/${userId}/isMovieInWatchlist/${movieId}`);
            setIsInWatchlist(response.isInWatchlist);
        } catch (error) {
            console.error("Error checking watchlist status:", error);
        }
    };

    const handleAddToWatchList = async (event) => {
        event.stopPropagation();

        if (user && user.id) {
            try {
                const movieId = movie.id;
                const userId = user.id;
                const response = await post(`/users/manageWatchlist`, { movie_id: movieId, user_id: userId });
                if (response.error) {
                    setErrorMessage(`Failed to ${isInWatchlist ? 'remove' : 'add'} movie. Please try again.`);
                } else {
                    setIsInWatchlist(!isInWatchlist);
                }
            } catch (error) {
                setErrorMessage("An error occurred. Please try again.");
            }
        } else {
            navigate("/login");
        }
    }

    const navigateToMovieDetail = () => navigate(`/movie/${movie.id}`);

    return (
        <Box className="filmCard" id="highlight" onClick={navigateToMovieDetail} style={{cursor: 'pointer'}}>
            {user && (
                <Tooltip title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"} placement="top">
                    <Button variant="contained" onClick={handleAddToWatchList} className="addToWatchlistButton" style={{position: 'absolute', top: '10px', right: '10px'}}>
                        {isInWatchlist ? "-" : "+"}
                    </Button>
                </Tooltip>
            )}
            <div className="detailsWrap" style={{cursor: 'pointer'}}>
                <div className="headerDetails">
                    <img className="posterImg" src={movie.poster_image_url} alt={movie.movie_name} />
                    <div className="titleDuration">
                        <h1>{movie.movie_name}</h1>
                        {movie.duration_minutes &&
                            <span className="timeSpan">{formatDuration(movie.duration_minutes)} </span>}
                    </div>
                    <h4>{movie.year}, {movie.director}</h4>
                    <Box>
                        <Rating name="read-only" value={parseFloat(movie.rate)} readOnly precision={0.5} />
                        <span className="score"> {parseFloat(movie.rate).toFixed(1)}/5 </span>
                    </Box>
                </div>
                <div className="descBox">
                    <p className="descText">
                        {movie.description}
                    </p>
                </div>
            </div>
            <div className="backgroundBlur" style={{backgroundImage: `url(${movie.background_image_url})`}}></div>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        </Box>
    );
}

export default MovieElement;
