import {useEffect, useState} from 'react';
import {get, put} from "../../utils/httpClient.js";
import {
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    IconButton,
    Tooltip,
    Paper,
} from "@mui/material";
import './UserDashboard.css';
import Rating from '@mui/lab/Rating';
import Header from "./Header.jsx";
import EditIcon from "@mui/icons-material/Edit";

function UserDashboard() {
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '', newPassword: '', confirmPassword: '',
    });
    const [editUserInfo, setEditUserInfo] = useState({
        username: '', first_name: '', last_name: '', bio: '', profile_url: ''
    });
    const [totalWatchTime, setTotalWatchTime] = useState({
        month: '', days: '', hours: '',
    });

    useEffect(() => {
        const storedData = localStorage.getItem("userAuth");
        if (storedData) {
            const userData = JSON.parse(storedData);
            setUser(userData.user);
            setEditUserInfo({
                username: userData.user.username,
                first_name: userData.user.first_name,
                last_name: userData.user.last_name,
                bio: userData.user.bio,
                profile_url: userData.user.profile_url
            });
        }
    }, []);


    useEffect(() => {
        if (user && user.id) {
            getWatchlist(user.id);
        }
    }, [user]);

    const getWatchlist = async (userId) => {
        try {
            const result = await get(`/users/${userId}/watchlist`);
            setWatchlist(result);
            calculateTotalWatchTime(result);
        } catch (error) {
            console.error('Error fetching watchlist', error);
        }
    };
    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswords(prevState => ({
            ...prevState, [name]: value,
        }));
    };

    const calculateTotalWatchTime = (movies) => {
        const totalMinutes = movies.reduce((acc, movie) => acc + movie.duration_minutes, 0);
        const hours = Math.floor(totalMinutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        const remainingHours = hours % 24;

        setTotalWatchTime({
            month: months, days: remainingDays, hours: remainingHours,
        });
    };

    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleUserInfoChange = (event) => {
        const {name, value} = event.target;
        setEditUserInfo(prevState => ({
            ...prevState, [name]: value
        }));
    };

    const formatDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}H ${mins}M`;
    };

    const updateUserInfo = async () => {
        const storedData = localStorage.getItem("userAuth");
        if (storedData) {
            const authData = JSON.parse(storedData);
            const {user} = authData;

            const body = {
                firstName: editUserInfo.first_name,
                lastName: editUserInfo.last_name,
                username: editUserInfo.username,
                bio: editUserInfo.bio,
                profile_url: editUserInfo.profile_url

            };
            try {
                const response = await put(`/users/${user.id}/updateUserInfo`, body);
                const updatedUser = {...user, ...response};
                setUser(updatedUser);
                localStorage.setItem("userAuth", JSON.stringify({...authData, user: updatedUser}));
                handleEditDialogClose();
            } catch (error) {
                console.error('Error updating user info:', error);
            }
        } else {
            console.log('No user data found in local storage.');
        }
    };

    const handleChangePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('New password and confirm password do not match!');
            return;
        }
        const storedData = localStorage.getItem("userAuth");
        if (!storedData) {
            console.log('No user data found in local storage.');
            return;
        }
        const authData = JSON.parse(storedData);
        const {user} = authData;

        const body = {
            currentPassword: passwords.currentPassword, newPassword: passwords.newPassword,
        };
        try {
            const response = await put(`/users/${user.id}/change-password`, body);
            console.log('Password changed successfully:', response);
            setPasswords({
                currentPassword: '', newPassword: '', confirmPassword: '',
            });
            setChangePasswordDialogOpen(false);
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (<Container maxWidth={false} sx={{margin: 0}}>
            <Header/>
            <Box sx={{mt: 4}}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Box sx={{display: 'flex', alignItems: 'center', maxWidth: 600}}> {/* Adjust maxWidth as needed */}
                        {user && (<Box sx={{marginRight: 2}}>
                                <Typography variant="h5">{user.username ? user.username : 'Guest'}</Typography>
                                {user.bio && (<Typography variant="body1"
                                                          sx={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
                                        {user.bio}
                                    </Typography>)}
                            </Box>)}
                        {user && user.profile_url && (<img src={user.profile_url} alt="Profile" style={{
                                width: 100, height: 100, borderRadius: '50%', display: 'block',
                            }}/>)}
                    </Box>
                    <IconButton aria-label="edit" color="primary" onClick={handleEditDialogOpen} sx={{ml: 2}}>
                        <Tooltip title="Edit Profile">
                            <EditIcon/>
                        </Tooltip>
                    </IconButton>
                </Box>
            </Box>

            <Grid container sx={{mt: 2, mb: 2, justifyContent: 'center'}}>
                <Grid item xs={12} container justifyContent="center" spacing={2}>
                    <Grid item xs={10} sm={6} md={5} lg={3}>
                        <Paper sx={{
                            p: 2, borderRadius: '50px', backgroundColor: 'black', color: 'white', textAlign: 'center'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Movie time
                            </Typography>
                            <Typography variant="h3" component="span" sx={{pr: 1}}>
                                {totalWatchTime.month}
                            </Typography>
                            <Typography variant="subtitle1" component="span">
                                MONTHS
                            </Typography>

                            <Typography variant="h3" component="span" sx={{px: 1}}>
                                {totalWatchTime.days}
                            </Typography>
                            <Typography variant="subtitle1" component="span">
                                DAYS
                            </Typography>

                            <Typography variant="h3" component="span" sx={{pl: 1}}>
                                {totalWatchTime.hours}
                            </Typography>
                            <Typography variant="subtitle1" component="span">
                                HOURS
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={10} sm={6} md={5} lg={3}>
                        <Paper sx={{
                            p: 2, backgroundColor: 'black', borderRadius: '50px', color: 'white', textAlign: 'center'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Movies Watched
                            </Typography>
                            <Box display="flex" justifyContent="center">
                                <Typography variant="h3">
                                    {watchlist.length}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Typography variant="h4" component="div" sx={{
                textAlign: 'center', mb: 5, color: 'black'
            }}>Watchlist</Typography>
            <Grid container spacing={2}>
                {watchlist.map(movie => (<Grid item key={movie.id} xs={6} sm={4} md={4} lg={1.5}>
                        <Card sx={{
                            position: 'relative',
                            height: '100%',
                            maxWidth: 345,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={movie.poster_image_url}
                                alt={movie.movie_name}
                            />
                            <CardContent sx={{
                                flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                            }}>
                                <Typography gutterBottom variant="h6" component="div" sx={{
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                    {movie.movie_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Year: {movie.year}</Typography>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="body2"
                                                color="text.secondary">{parseFloat(movie.rate).toFixed(1)}/5</Typography>
                                    <Rating name="read-only" value={parseFloat(movie.rate)} readOnly precision={0.5}/>
                                </Box>
                                <Typography variant="body2"
                                            color="text.secondary">Duration: {formatDuration(movie.duration_minutes)}</Typography>
                                <Typography variant="body2"
                                            color="text.secondary">Director: {movie.director}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>))}
            </Grid>

            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editUserInfo.username}
                        onChange={handleUserInfoChange}
                    />
                    <TextField
                        margin="dense"
                        name="first_name"
                        label="First Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editUserInfo.first_name}
                        onChange={handleUserInfoChange}
                    />
                    <TextField
                        margin="dense"
                        name="last_name"
                        label="Last Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editUserInfo.last_name}
                        onChange={handleUserInfoChange}
                    />
                    <TextField
                        margin="dense"
                        name="bio"
                        label="Bio"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={editUserInfo.bio}
                        onChange={handleUserInfoChange}
                    />
                    <TextField
                        margin="dense"
                        name="profile_url"
                        label="Profile URL"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={editUserInfo.profile_url}
                        onChange={handleUserInfoChange}
                    />
                    <Typography
                        variant="body2"
                        onClick={() => setChangePasswordDialogOpen(true)}
                        sx={{cursor: 'pointer', color: 'red', marginTop: '8px', textAlign: 'center'}}
                    >
                        Change Password?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button onClick={updateUserInfo}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={changePasswordDialogOpen} onClose={() => setChangePasswordDialogOpen(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        margin="dense"
                        name="newPassword"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        margin="dense"
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setChangePasswordDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleChangePassword}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>);
}

export default UserDashboard;
