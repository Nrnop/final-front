import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("userAuth");
        navigate('/login');
    };

    const isActive = (path) => location.pathname.includes(path);

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
                <List>
                    {['movies', 'actors', 'users'].map((text) => (
                        <ListItem
                            button
                            key={text}
                            onClick={() => navigate(text)}
                            sx={{ bgcolor: isActive(text) ? '#a6d3f3' : 'inherit' }}
                        >
                            <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} />
                        </ListItem>
                    ))}
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
