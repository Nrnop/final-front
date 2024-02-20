import {Container, Grid, Typography} from '@mui/material';
import { useEffect, useState } from "react";
import MovieElement from '../Movie/MovieElement.jsx'
import { get } from '../../utils/httpClient.js'


function MoviesList() {
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
        <Grid container direction="row" justifyContent="center" alignItems="right" >
            {movies?.map(movie => (
                <Grid item md={6} key={movie.id}>
                    <MovieElement movie={movie} />
                </Grid>
            ))}
        </Grid>
    )};

export default MoviesList;