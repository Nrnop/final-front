import {useLoaderData,useNavigate} from "react-router-dom";
import {get, post} from '../../utils/httpClient';
import {Container, Typography, Box, CardMedia, Chip, Stack, Tooltip, Button} from '@mui/material';
import styles from './MovieDetails.module.css';
import Rating from "@mui/lab/Rating";
import Header from "../UserDashboard/Header.jsx";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {useEffect, useState} from "react";
function MovieDetails() {
    const {movie} = useLoaderData();
    const [user, setUser] = useState(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

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
                const response = await post(`/users/manageWatchlist`, {movie_id: movieId, user_id: userId});
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
    const tags = movie?.tags || [];
    const stars = movie?.stars || [];
    const backgroundStyle = {
        backgroundImage: `url(${movie.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginTop: '10px',
    };
    const formatDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}H ${mins}M`;
    };

    return (
        <>
            <Header />
            <Container className={` ${styles.container}`} style={backgroundStyle}>
                {user && (
                    <Tooltip title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"} placement="top">
                        <Button onClick={handleAddToWatchList} >
                            {isInWatchlist ? <RemoveCircleOutlineIcon style={{color: 'white', fontSize: '48px'}}/> :
                                <AddCircleOutlineIcon style={{color: 'white', fontSize: '48px'}}/>}
                        </Button>
                    </Tooltip>
                )}
                {movie ? (
                    <Box className={styles.container}>

                        <CardMedia
                            component="img"
                            className={styles.moviePoster}
                            image={movie.poster_image_url}
                            alt={movie.movie_name}
                        />

                        <Box className={styles.flexColumn}>

                            <Typography variant="h3" >
                                {movie.movie_name}
                            </Typography>
                            <Typography variant="subtitle">
                                Director: {movie.director}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {stars.map((star, index) => (
                                    <Chip key={index} label={star} />
                                ))}
                            </Stack>
                            <Typography variant="subtitle">
                                Year: {movie.year}
                            </Typography>
                            <Typography variant="subtitle" >
                                Duration: {formatDuration(movie.duration_minutes)}
                            </Typography>
                            <Box className={`${styles.alignCenter}`}>
                                <Typography variant="body" color="text.secondary" component="span">
                                    {parseFloat(movie.rate).toFixed(1)}/5
                                </Typography>
                                <Rating name="read-only" value={parseFloat(movie.rate)} readOnly precision={0.5} />
                            </Box>
                            <Stack direction="row" spacing={1}>
                                {tags.map((tag, index) => (
                                    <Chip key={index} label={tag} variant="outlined"/>
                                ))}
                            </Stack>
                            <Typography variant="body">
                                {movie.description}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body1">Movie not found</Typography>
                )}
            </Container>
        </>
    );
}

export default MovieDetails;

export async function Loader({params}) {
    const movie = await get(`/movies/${params.id}`);
    return {movie};
}
