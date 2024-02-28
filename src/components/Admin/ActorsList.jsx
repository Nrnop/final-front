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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
    Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {get, post, del} from "../../utils/httpClient.js";

function ActorsList() {
    const [stars, setStars] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [actorName, setActorName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getStars();
    }, []);

    const getStars = async () => {
        try {
            const allStars = await get(`/movies/stars`);
            setStars(allStars);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddActor = async () => {
        if (!actorName.trim()) {
            alert("Actor name can't be empty");
            return;
        }
        try {
            const response = await post('/admin/add-actor', {name: actorName});
            const addedActor = response[0];
            if (!addedActor.star_id) {
                console.error('Newly added actor does not have an id:', addedActor);
                return;
            }
            setStars(prev => [...prev, addedActor]);
            handleCloseDialog();
        } catch (error) {
            console.error('Error Adding Actor:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        try {
            if (!searchTerm.trim()) {
                const allStars = await get(`/movies/stars`);
                setStars(allStars);
            } else {
                const searchedStar = await post('/admin/search-actor', {search: searchTerm});
                setStars(searchedStar);
            }
        } catch (error) {
            console.error('Error performing search or fetching all stars', error);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setActorName(''); // Reset actor name on dialog close
    };

    const handleChange = (event) => {
        setActorName(event.target.value);
    };
    const handleEdit = (id) => {
        console.log('Edit actor with id:', id);
    };
    const handleDelete = async (id, name) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete ${name}?`);
        if (!isConfirmed) {
            return; // Early return if the user cancels the operation
        }
        try {
            const response = await del(`/admin/del-actor/${id}`);
            if (!response || response.error) {
                response.error('Failed to delete actor');
            }
            setStars(prev => prev.filter(star => star.star_id !== id));
        } catch (error) {
            console.error('Error Deleting Actor:', error);
        }
    };
    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <IconButton aria-label="add" color="primary" onClick={handleOpenDialog}>
                    <Tooltip title="Add new actor">
                        <AddCircleOutlineIcon fontSize="large"/>
                    </Tooltip>
                </IconButton>
                <Tooltip title="Search actor name">
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearch}
                    />
                </Tooltip>
            </Box>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Actor</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a new actor, please enter their name here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Actor Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={actorName}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddActor}>Add</Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead style={{backgroundColor: '#a6d3f3'}}>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Actor Name</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stars.map((star) => (
                            <TableRow key={star.star_id}>
                                <TableCell align="center" component="th" scope="row">{star.star_id}</TableCell>
                                <TableCell align="center">{star.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton aria-label="edit" onClick={() => handleEdit(star.star_id)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton aria-label="edit" onClick={() => handleDelete(star.star_id, star.name)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{mt: 2}}>
            </Box>
        </>
    );
}

export default ActorsList;
