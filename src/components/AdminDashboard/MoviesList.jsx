import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { get } from "../../utils/httpClient.js";
import { useNavigate, Outlet } from 'react-router-dom';

function MoviesList() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);

    const getMovies = async () => {
        try {
            const allMovies = await get(`/movies`);
            setMovies(allMovies);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        getMovies();
    }, []);

    const handleEdit = (id) => {
        console.log('Edit movie with id:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete movie with id:', id);
    };

    const handleAdd = () => {
        navigate("/admin-dashboard/add-movie");
        console.log('Navigate to add new movie');
    };

    return (
        <>
            <IconButton aria-label="add" color="primary" onClick={handleAdd}>
                <AddCircleOutlineIcon fontSize="large"/>
            </IconButton>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Director</TableCell>
                            <TableCell align="right">Year</TableCell>
                            <TableCell align="right">Actors</TableCell>
                            <TableCell align="right">Tags</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movies.map((movie) => (
                            <TableRow key={movie.id}>
                                <TableCell component="th" scope="row">{movie.id}</TableCell>
                                <TableCell>{movie.movie_name}</TableCell>
                                <TableCell align="right">{movie.director}</TableCell>
                                <TableCell align="right">{movie.year}</TableCell>
                                <TableCell align="right">{Array.isArray(movie.stars) ? movie.stars.join(', ') : movie.stars}</TableCell>
                                <TableCell align="right">{Array.isArray(movie.tags) ? movie.tags.join(', ') : movie.tags}</TableCell>
                                <TableCell align="right">{movie.duration_minutes}</TableCell>

                                <TableCell align="right">
                                    <IconButton aria-label="edit" onClick={() => handleEdit(movie.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleDelete(movie.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
                <Outlet />
            </Box>
        </>
    );
}

export default MoviesList;
