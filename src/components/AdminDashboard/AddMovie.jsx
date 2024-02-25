import  { useState } from 'react';
import { Button, TextField, Typography, Container, Grid, Paper, MenuItem } from '@mui/material';

function AddMovie() {
    const [movieForm, setMovieForm] = useState({
        title: '',
        year: '',
        duration: '',
        description: '',
        director: '',
        posterUrl: '',
        backdropUrl: '',
        mpa: '',
        selectedStars: [],
        selectedGenres: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovieForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(movieForm);
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Add New Movie
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Title"
                                name="title"
                                value={movieForm.title}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Year"
                                name="year"
                                type="number"
                                value={movieForm.year}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Duration (minutes)"
                                name="duration"
                                type="number"
                                value={movieForm.duration}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={movieForm.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Director"
                                name="director"
                                value={movieForm.director}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Poster URL"
                                name="posterUrl"
                                value={movieForm.posterUrl}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                label="Backdrop URL"
                                name="backdropUrl"
                                value={movieForm.backdropUrl}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="MPA Rating"
                                name="mpa"
                                value={movieForm.mpa}
                                onChange={handleChange}
                                fullWidth
                            >
                                {['G', 'PG', 'PG-13', 'R', 'NC-17'].map((rating) => (
                                    <MenuItem key={rating} value={rating}>
                                        {rating}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Add Movie
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default AddMovie;
