import {useEffect, useState} from 'react';
import {
    Button,
    TextField,
    Container,
    Grid,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Chip
} from '@mui/material';
import {get, put} from "../../utils/httpClient.js";
import {useNavigate, useParams} from "react-router-dom";

function EditMovie() {
    const [stars, setStars] = useState([]);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();
    const {id} = useParams(); // Extract 'id' from URL

    const [movieForm, setMovieForm] = useState({
        title: '',
        year: '',
        rate: 0.0,
        duration: '',
        description: '',
        director: '',
        posterUrl: '',
        backdropUrl: '',
        selectedStars: [],
        selectedTags: [],
    });

    useEffect(() => {
        const fetchStarsAndTags = async () => {
            try {
                const allStars = await get(`/movies/stars`);
                const allTags = await get(`/movies/tags`);
                setStars(allStars);
                setTags(allTags);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchStarsAndTags();
    }, []);
    useEffect(() => {
        const fetchMovieDetails = async () => {
            const movieDetails = await get(`/movies/${id}`);
            const currentTags=await get(`/movies/${id}/tags`);
            const currenStars=await get(`/movies/${id}/stars`);

            setMovieForm({
                title: movieDetails.movie_name,
                year: movieDetails.year,
                rate: movieDetails.rate,
                duration: movieDetails.duration_minutes,
                description: movieDetails.description,
                director: movieDetails.director,
                posterUrl: movieDetails.poster_image_url,
                backdropUrl: movieDetails.background_image_url,
                selectedStars: currentTags,
                selectedTags: currenStars,
            });
        };
        fetchMovieDetails();
    }, [id]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === 'rate') {
            const rateValue = Math.max(0, Math.min(5, parseFloat(value)));
            setMovieForm(prevState => ({
                ...prevState,
                [name]: rateValue
            }));
        } else {
            setMovieForm(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };


    const handleMultiSelectChange = (event) => {
        const {
            target: {value, name},
        } = event;
        setMovieForm({
            ...movieForm,
            [name]: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const movieData = {
            movie_name: movieForm.title,
            director: movieForm.director,
            rate: movieForm.rate,
            background_image_url: movieForm.backdropUrl,
            poster_image_url: movieForm.posterUrl,
            year: movieForm.year,
            duration_minutes: movieForm.duration,
            description: movieForm.description,
            stars: movieForm.selectedStars,
            tags: movieForm.selectedTags
        };

        try {
            await put(`/admin/update-movie/${id}`, movieData);
            console.log('Movie updated successfully');
            navigate(-1);
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };
    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{padding: 3}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                required
                                fullWidth
                                label="Title"
                                name="title"
                                value={movieForm.title}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                required
                                fullWidth
                                label="Director"
                                name="director"
                                value={movieForm.director}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                required
                                fullWidth
                                label="Rate"
                                name="rate"
                                type="number"
                                value={movieForm.rate}
                                onChange={handleChange}
                                inputProps={{min: "0", max: "5", step: "0.1"}}
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
                                rows={3}
                                label="Description"
                                name="description"
                                value={movieForm.description}
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
                            <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                <InputLabel>Stars</InputLabel>
                                <Select
                                    multiple
                                    name="selectedStars"
                                    value={movieForm.selectedStars}
                                    onChange={handleMultiSelectChange}
                                    input={<OutlinedInput id="select-multiple-stars" label="Stars"/>}
                                    renderValue={(selected) => (
                                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            {selected.map((value, index) => (
                                                <Chip key={value + index}
                                                      label={stars.find(star => star.star_id === value)?.name}/>
                                            ))}
                                        </div>
                                    )}
                                >
                                    {stars.map((star) => (
                                        <MenuItem key={star.star_id} value={star.star_id}>
                                            {star.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                <InputLabel>Tags</InputLabel>
                                <Select
                                    multiple
                                    name="selectedTags"
                                    value={movieForm.selectedTags}
                                    onChange={handleMultiSelectChange}
                                    input={<OutlinedInput id="select-multiple-tags" label="Tags"/>}
                                    renderValue={(selected) => (
                                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            {selected.map((value, index) => (
                                                <Chip key={value + index}
                                                      label={tags.find(tag => tag.tag_id === value)?.tag_name}/>
                                            ))}
                                        </div>
                                    )}
                                >
                                    {tags.map((tag) => (
                                        <MenuItem key={tag.tag_id} value={tag.tag_id}>
                                            {tag.tag_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button onClick={handleCancel} variant="outlined" sx={{mt: 3, mr: 1}}>Cancel</Button>
                    <Button onClick={handleSubmit} fullWidth variant="contained" sx={{mt: 3}}>Save</Button>
                </form>
            </Paper>
        </Container>
    );
}

export default EditMovie;
