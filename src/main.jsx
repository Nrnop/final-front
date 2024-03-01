import React from 'react';
import ReactDOM from 'react-dom/client';
import MainPage from './components/Home/MainPage.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import Login from './components/Login/Login.jsx';
import MovieDetails, {Loader as MovieDetailsLoader} from './components/Movie/MovieDetails.jsx';
import UserDashboard from './components/UserDashboard/UserDashboard.jsx';
import ProtectedRoute from './components/UserDashboard/ProtectedRoute.jsx';
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import AdminRoute from "./components/Admin/AdminRoute.jsx";
import MoviesList from "./components/Admin/MoviesList.jsx";
import ActorsList from "./components/Admin/ActorsList.jsx";
import UsersList from "./components/Admin/UsersList.jsx";
import AddMovie from "./components/Admin/AddMovie.jsx";
import EditMovie from "./components/Admin/EditMovie.jsx";

import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
    },
    {
        path: "/sign-up",
        element: <SignUp/>,
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/movie/:id",
        element: <MovieDetails/>,
        loader: MovieDetailsLoader,
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute element={<UserDashboard/>}/>,
    },
    {
        path: "/admin-dashboard",
        element: <AdminRoute element={<AdminDashboard/>}/>,
        children: [
            {
                path: "movies",
                element: <MoviesList/>,

            },
            {
                path: "add-movie",
                element: <AddMovie />,
            },
            {
                path: "edit-movie/:id",
                element: <EditMovie />,
            },
            {
                path: "actors",
                element: <ActorsList/>,
            },
            {
                path: "users",
                element: <UsersList/>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);
