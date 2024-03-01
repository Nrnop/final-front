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
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField, Tooltip, Box, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {get, post, put} from "../../utils/httpClient.js";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from "@mui/icons-material/Search.js";

function UsersList() {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState('USER');
    const [editingUserId, setEditingUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    const getUsers = async () => {
        try {
            const allUsers = await get(`/users`);
            setUsers(allUsers);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        try {
            if (!searchTerm.trim()) {
                const allUsers = await get(`/users`);
                setUsers(allUsers);
            } else {
                const searchedUser = await post('/admin/search-user', {search: searchTerm});
                setUsers(searchedUser);
            }
        } catch (error) {
            console.error('Error performing search or fetching all stars', error);
        }
    };
    const handleEdit = (user) => {
        setOpenDialog(true);
        setSelectedRole(user.role);
        setEditingUserId(user.id);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleSaveRoleChange = async () => {
        try {
            await put(`/admin/change-role/${editingUserId}`, {role: selectedRole});
            setUsers(users.map(user => user.id === editingUserId ? {...user, role: selectedRole} : user));
            handleCloseDialog();
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Tooltip title="Search user first name or last name or username">
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
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    <RadioGroup value={selectedRole} onChange={handleRoleChange}>
                        <FormControlLabel value="ADMIN" control={<Radio/>} label="ADMIN"/>
                        <FormControlLabel value="USER" control={<Radio/>} label="USER"/>
                    </RadioGroup>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}> <CancelIcon fontSize="large"/> </Button>
                        <Button onClick={handleSaveRoleChange}><CheckIcon fontSize="large"/></Button>
                    </DialogActions>
                </DialogContent>

            </Dialog>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead style={{backgroundColor: '#a6d3f3'}}>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">First Name</TableCell>
                            <TableCell align="center">Last Name</TableCell>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="right">Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell align="center" component="th" scope="row">{user.id}</TableCell>
                                <TableCell align="center">{user.first_name}</TableCell>
                                <TableCell align="center">{user.last_name}</TableCell>
                                <TableCell align="center">{user.username}</TableCell>
                                <TableCell align="right">
                                    {user.role}
                                    <IconButton aria-label="edit" onClick={() => handleEdit(user)}>
                                        <EditIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default UsersList;
