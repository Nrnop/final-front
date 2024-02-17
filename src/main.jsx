import React from 'react'
import ReactDOM from 'react-dom/client'
import MainPage from './components/MainPage.jsx'
import SignUp from './components/SignUp.jsx'
import Login from './components/Login.jsx'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
    }, {
        path: "/sign-up",
        element: <SignUp/>
    }, {
        path: "/login",
        element: <Login/>
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
