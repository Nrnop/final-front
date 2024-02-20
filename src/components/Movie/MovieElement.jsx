import './MovieElement.css';
import { Box, Rating } from '@mui/material';
import { Link } from "react-router-dom";

function MovieElement({ movie }) {
    return (
        <Link to={`/movie/${movie.id}`}>
            <Box className="filmCard" id="highlight">
                <div className="detailsWrap">
                    <div className="headerDetails">
                        <img className="posterImg" src={movie.poster_image_url} alt={movie.movie_name}/>
                        <div className="titleDuration">
                            <h1>{movie.movie_name}</h1>
                            {movie.duration_minutes && <span className="timeSpan">{movie.duration_minutes} min</span>}
                        </div>
                        <h4>{movie.year}, {movie.director}</h4>
                        <Box>
                            <Rating name="read-only" value={+movie.rate} precision={0.1} sx={{ display: 'flex', py: 1.5 }}/>
                            <span className="score"> {movie.rate} / 5 </span>
                        </Box>
                    </div>
                    <div className="descBox">
                        <p className="descText">
                            {movie.description}
                        </p>
                    </div>
                </div>

                <div className="backgroundBlur" style={{ backgroundImage: `url(${movie.background_image_url})` }}></div>
            </Box>
        </Link>
    );
}

export default MovieElement;
