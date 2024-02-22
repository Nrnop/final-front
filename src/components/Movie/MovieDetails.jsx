import {useLoaderData} from "react-router-dom";
import {get} from '../../utils/httpClient';
import {Container, Typography, Box, CardMedia, Chip, Stack} from '@mui/material';
import './MovieDetails.css';
import Rating from "@mui/lab/Rating";
import React from "react";

function MovieDetails() {
    const {movie} = useLoaderData();

    const tags = movie?.tags || [];
    const backgroundStyle = {
        backgroundImage: `url(${movie.background_image_url})`,
        backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // padding: '20px',
        // maxWidth: '10px',
        // margin: 'auto',
    };
    const formatDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}H ${mins}M`;
    };


    return (
        <Container className="container" sx={{
            ...backgroundStyle,
        }}>
            {movie ? (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 2,
                    p: 4,
                }}>
                    <Typography variant="h3" gutterBottom className="movie-name">
                        {movie.movie_name}
                    </Typography>
                    <CardMedia
                        component="img"
                        className={"movie-poster"}
                        image={movie.poster_image_url}
                        alt={movie.movie_name}
                    />
                    <Typography variant="body1" className="movie-description">
                        {movie.description}
                    </Typography>
                    <Box className="movie-info">
                        <Typography variant="subtitle1">
                            Director: {movie.director}
                        </Typography>
                        <Typography variant="subtitle1">
                            Year: {movie.year}
                        </Typography>
                        <Typography variant="subtitle1">
                            {formatDuration(movie.duration_minutes)}
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" color="text.secondary" component="span" style={{ marginRight: 8 }}>
                                {parseFloat(movie.rate).toFixed(1)}/5
                            </Typography>
                            <Rating name="read-only" value={parseFloat(movie.rate)} readOnly precision={0.5} />
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1} className="tags-container">
                        {tags.map((tag, index) => (
                            <Chip key={index} label={tag} variant="outlined" className="tag-chip"/>
                        ))}
                    </Stack>
                </Box>
            ) : (
                <Typography variant="body1">Movie not found</Typography>
            )}
        </Container>
    );
}

export default MovieDetails;

export async function Loader({params}) {
    const movie = await get(`/movies/${params.id}`);
    return {movie};
}
