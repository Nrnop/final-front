import {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    TextField, Tooltip, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {del, get, post} from "../../utils/httpClient.js";
import {useNavigate, Outlet} from 'react-router-dom';
import SearchIcon from "@mui/icons-material/Search.js";

function MoviesList() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    const getMovies = async (search = '') => {
        try {
            let allMovies;
            if (search.trim()) {
                allMovies = await post(`/movies/search`, {search});
            } else {
                allMovies = await get(`/movies`);
            }
            setMovies(allMovies);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };
    useEffect(() => {
        getMovies();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async (event) => {
        if (event.key === 'Enter') {
            getMovies(searchTerm);
        }
    };
    const handleEdit = (id) => {
        console.log('Edit movie with id:', id);
        navigate(`/admin-dashboard/edit-movie/${id}`)
    };

    const handleDelete = async (id, name) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete ${name}?`);
        if (!isConfirmed) {
            return;
        }
        try {
            const response = await del(`/admin/del-movie/${id}`);
            if (!response || response.error) {
                response.error('Failed to delete movie');
            }
            setMovies(prev => prev.filter(movie => movie.id !== id));
        } catch (error) {
            console.error('Error Deleting Movie:', error);
        }
    };

    const handleAdd = () => {
        navigate("/admin-dashboard/add-movie");
        console.log('Navigate to add new movie');
    };

    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <IconButton aria-label="add" color="primary" onClick={handleAdd}>
                    <Tooltip title="Add new movie">
                        <AddCircleOutlineIcon fontSize="large"/>
                    </Tooltip>
                </IconButton>
                <Tooltip title="Search movie name or director">
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Tooltip>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead style={{backgroundColor: '#a6d3f3'}}>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Title</TableCell>
                            <TableCell align="center">Director</TableCell>
                            <TableCell align="center">Year</TableCell>
                            <TableCell align="center">Actors</TableCell>
                            <TableCell align="center">Tags</TableCell>
                            <TableCell align="center">Time</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movies.map((movie) => (
                            <TableRow key={movie.id}>
                                <TableCell align="center" component="th" scope="row">{movie.id}</TableCell>
                                <TableCell align="center">{movie.movie_name}</TableCell>
                                <TableCell align="center">{movie.director}</TableCell>
                                <TableCell align="center">{movie.year}</TableCell>
                                <TableCell
                                    align="center">{Array.isArray(movie.stars) ? movie.stars.join(', ') : movie.stars}</TableCell>
                                <TableCell
                                    align="center">{Array.isArray(movie.tags) ? movie.tags.join(', ') : movie.tags}</TableCell>
                                <TableCell align="right">{movie.duration_minutes}</TableCell>
                                <TableCell align="right">
                                    <IconButton aria-label="edit" onClick={() => handleEdit(movie.id)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton aria-label="delete"
                                                onClick={() => handleDelete(movie.id, movie.movie_name)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{mt: 2}}>
                <Outlet/>
            </Box>
        </>
    );
}

export default MoviesList;
