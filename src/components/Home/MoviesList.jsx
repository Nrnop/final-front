import {Button, Grid, InputAdornment, Menu, MenuItem, TextField, Tooltip} from '@mui/material';
import MovieElement from '../Movie/MovieElement.jsx';
import { get,post } from "../../utils/httpClient.js";
import { useEffect, useState } from "react";
import './MoviesList.css';
import SearchIcon from '@mui/icons-material/Search';

function MoviesList() {
    const [anchorElGenres, setAnchorElGenres] = useState(null);
    const [anchorElYears, setAnchorElYears] = useState(null);
    const [tags, setTags] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [movies, setMovies] = useState([]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        try {
            if (!searchTerm.trim()) {
                const allMovies = await get(`/movies`);
                setMovies(allMovies);
            } else {
                const searchedMovies = await post('/movies/search', { search: searchTerm });
                setMovies(searchedMovies);
            }
        } catch (error) {
            console.error('Error performing search or fetching all movies', error);
        }
    };


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
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

    useEffect(() => {
        filterTagOrYears();
    }, [selectedTag, selectedYear]);

    const filterTagOrYears = async () => {
        try {
            if (selectedTag) {
                const tagFilter = await get(`/movies/tags/${selectedTag}`);
                setMovies(tagFilter);
            } else if (selectedYear) {
                const yearFilter = await get(`/movies/year/${selectedYear}`);
                setMovies(yearFilter);
            } else {
                const allMovies = await get(`/movies`);
                setMovies(allMovies);
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const handleGenresMenuClick = (event) => {
        setAnchorElGenres(event.currentTarget);
    };

    const handleGenresMenuClose = (tagName) => {
        setAnchorElGenres(null);
        setSelectedTag(tagName === 'All' ? '' : tagName);
    };

    const handleYearsMenuClick = (event) => {
        setAnchorElYears(event.currentTarget);
    };

    const handleYearsMenuClose = (year) => {
        setAnchorElYears(null);
        setSelectedYear(year === 'All' ? '' : year);
    };

    return (
        <div>
            <Grid className="header">
                <div>
                    <Button color="inherit" className="button" onClick={handleGenresMenuClick}>
                        Genres
                    </Button>
                    <Menu
                        anchorEl={anchorElGenres}
                        open={Boolean(anchorElGenres)}
                        onClose={() => handleGenresMenuClose('')}
                    >
                        <MenuItem onClick={() => handleGenresMenuClose('All')} className="menu-item">
                            All
                        </MenuItem>
                        {tags.map((tag) => (
                            <MenuItem key={tag.tag_id} onClick={() => handleGenresMenuClose(tag.tag_name)} className="menu-item">
                                {tag.tag_name || 'Unknown Genre'}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Button color="inherit" className="button" onClick={handleYearsMenuClick}>
                        Year
                    </Button>
                    <Menu
                        anchorEl={anchorElYears}
                        open={Boolean(anchorElYears)}
                        onClose={() => handleYearsMenuClose('')}
                    >
                        <MenuItem onClick={() => handleYearsMenuClose('All')} className="menu-item">
                            All
                        </MenuItem>
                        {years.map((year, index) => (
                            <MenuItem key={index} onClick={() => handleYearsMenuClose(year.year)} className="menu-item">
                                {year.year || 'Unknown Year'}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
                <div className="search-bar">
                    <Tooltip title="Search movie name or director">
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            color="primary"
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&.Mui-focused fieldset": {
                                        borderColor: "primary.main",
                                    },
                                },
                            }}
                        />
                    </Tooltip>
                </div>
            </Grid>
            <Grid container spacing={3} className="movie-grid">
                {movies.map(movie => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                        <MovieElement movie={movie} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default MoviesList;
