import {createBrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Main from "./pages/Main/Main";
import Favorites from "./pages/Favorites/Favorites";
import Restauran from "./pages/Restauran/Restauran";
import Profile from "./pages/Profile/Profile";
import MobileSearch from "./pages/MobileSearch/MobileSearch";
import TermsAndConditions from "./pages/TermsAndConditions/TermsAndConditions";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import Landing2 from "./pages/Landing/Landing";

export const router = createBrowserRouter([
        {
            path: "/",
            element: <Main/>,
        },
        {
            path: "/favorites",
            element: <Favorites/>,
        },
        {
            path: "/restauran/:id",
            element: <Restauran/>,
        },
        {
            path: "/profile",
            element: <Profile/>,
        },
        {
            path: "/search",
            element: <MobileSearch/>,
        },
        // {
        //     path: "/terms",
        //     element: <TermsAndConditions/>,
        // },
        {
            path: "/registration",
            element: <Registration/>,
        },
        {
            path: "/login",
            element: <Login/> // Pass the user's login status
        },
        {
            path: '/landing',
            element: <Landing/>
        },
        {
            path: '/landing2',
            element: <Landing2/>
        }
    ]
);
