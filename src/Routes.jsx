import {createBrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./pages/Main/Main";
import Favorites from "./pages/Favorites/Favorites";
import Restauran from "./pages/Restauran/Restauran";
import Profile from "./pages/Profile/Profile";

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
            path: "/restauran",
            element: <Restauran/>,
        },
        {
            path: "/profile",
            element: <Profile/>,
        },
        
    ]
);