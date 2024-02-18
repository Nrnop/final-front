import  { useState, useEffect } from 'react';
import { get } from '../../utils/httpClient';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';

function Movies() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');

    const loadMovies = async () => {
        try {
            const data = await get('/movies');
            if (data) {
                setMovies(data);
            } else {
                setError('No data returned from the server');
            }
        } catch (error) {
            setError(error.message || 'An unexpected error occurred');
        }
    };

    useEffect(() => {
        loadMovies();
    }, []);

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Movies List
            </Typography>
            <Grid container spacing={4}>
                {movies.map(movie => (
                    <Grid item xs={12} sm={6} md={4} key={movie.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {movie.movie_name}
                                </Typography>
                                <Typography color="textSecondary">
                                    Director: {movie.director}
                                </Typography>
                                <Typography color="textSecondary">
                                    Year: {movie.year}
                                </Typography>
                                {/* Additional movie details */}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Movies;
