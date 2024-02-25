import {  useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";



import { Drawer, List, ListItem, ListItemText, Box, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

export default function AdminDashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("userAuth");
        navigate('/login');
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap>Admin Dashboard</Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <List>
                    <ListItem button onClick={() => navigate("/")}>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("movies")}>
                        <ListItemText primary="Movies" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("actors")}>
                        <ListItemText primary="Actors" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("users")}>
                        <ListItemText primary="Users" />
                    </ListItem>
                    <ListItem button onClick={() => handleLogout()}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar />
                <Outlet />

            </Box>
        </Box>
    );
}
