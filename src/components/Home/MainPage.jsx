import { Routes, Route } from 'react-router-dom';
import Header from './Header.jsx';
import MoviesList from './MoviesList.jsx';

const MainPage = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<MoviesList />} />
            </Routes>
        </div>
    );
};

export default MainPage;
