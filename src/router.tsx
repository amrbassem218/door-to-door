import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error/Error";
import Product from "./pages/product";
export const router = createBrowserRouter([
    {
        element: <Home/>,
        path: '/',
        errorElement: <Error/>
    },
    {
        element: <Product/>,
        path: '/product/:id',
        errorElement: <Error/>
    }
])