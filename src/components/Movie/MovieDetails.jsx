import {useLoaderData} from "react-router-dom";
import {get} from '../../utils/httpClient';
import {Container, Typography, Box, CardMedia, Chip, Stack} from '@mui/material';
import './MovieDetails.css';

function MovieDetails() {
    const {movie} = useLoaderData();

    const tags = movie?.tags || [];
    const backgroundStyle = {
        backgroundImage: `url(${movie.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
        maxWidth: '10px',
        margin: 'auto',
    };


    return (
        <Container className={"container"} sx={{
            ...backgroundStyle,
            py: 4
        }}>
            {movie ? (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    p: 4
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
                            Duration: {movie.duration_minutes} minutes
                        </Typography>
                        <Typography variant="subtitle1">
                            Rate: {movie.rate} / 5
                        </Typography>
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
