import  { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { get } from '../../utils/httpClient';
import './Header.css';

function Header() {
    const [anchorElGenres, setAnchorElGenres] = useState(null);
    const [anchorElYears, setAnchorElYears] = useState(null);
    const [tags, setTags] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        const fetchTagsAndYears = async () => {
            try {
                const tagsData = await get('/movies/tags');
                setTags(tagsData);
                const yearsData = await get('/movies/years');
                setYears(yearsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTagsAndYears();
    }, []);

    const handleGenresMenuClick = (event) => {
        setAnchorElGenres(event.currentTarget);
    };

    const handleGenresMenuClose = () => {
        setAnchorElGenres(null);
    };

    const handleYearsMenuClick = (event) => {
        setAnchorElYears(event.currentTarget);
    };

    const handleYearsMenuClose = () => {
        setAnchorElYears(null);
    };

    return (
        <AppBar position="static" className="header-toolbar">
            <Toolbar>
                <Typography variant="h6" className="header-title">
                    Movie Tracer
                </Typography>
                <Button color="inherit" className="header-button" onClick={handleGenresMenuClick}>
                    Genres
                </Button>
                <Menu
                    anchorEl={anchorElGenres}
                    open={Boolean(anchorElGenres)}
                    onClose={handleGenresMenuClose}
                    className="header-menu"
                >
                    {tags.map((tag) => (
                        <MenuItem key={tag.tag_id} onClick={handleGenresMenuClose}>
                            {tag.tag_name}
                        </MenuItem>
                    ))}
                </Menu>
                <Button color="inherit" className="header-button" onClick={handleYearsMenuClick}>
                    Year
                </Button>
                <Menu
                    anchorEl={anchorElYears}
                    open={Boolean(anchorElYears)}
                    onClose={handleYearsMenuClose}
                    className="header-menu"
                >
                    {years.map((year, index) => (
                        <MenuItem key={index} onClick={handleYearsMenuClose}>
                            {year.year}
                        </MenuItem>
                    ))}
                </Menu>
                <TextField label="Search Movie" variant="outlined" size="small" color="primary" className="header-search" />
                <Button color="inherit" className="header-login-signup" component={Link} to="/login">Login</Button>
                <Button color="inherit" className="header-login-signup" component={Link} to="/sign-up">Signup</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
