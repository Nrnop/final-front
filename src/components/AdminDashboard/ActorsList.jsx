import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { get } from "../../utils/httpClient.js";
import { useNavigate, Outlet } from 'react-router-dom'; // Import Outlet

function ActorsList() {
    const navigate = useNavigate();
    const [stars, setStars] = useState([]);

    const getStars = async () => {
        try {
            const allStars = await get(`/movies/stars`);
            setStars(allStars);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        getStars();
    }, []);

    const handleEdit = (id) => {
        console.log('Edit movie with id:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete movie with id:', id);
    };

    const handleAdd = () => {
        navigate("/admin-dashboard/add-movie");
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
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stars.map((star) => (
                            <TableRow key={star.star_id}>
                                <TableCell component="th" scope="row">{star.star_id}</TableCell>
                                <TableCell>{star.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton aria-label="edit" onClick={() => handleEdit(star.star_id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={() => handleDelete(star.star_id)}>
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

export default ActorsList;
