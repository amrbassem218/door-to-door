import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error/Error";

import Layout from "./components/Layout";
import ProductsList from "./pages/productsList";
import Cart from "./pages/cart";
import ProductListing from "./pages/product";
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children:[
            {
                path: '',
                element: <Home/>
            },
            {
                path: '/product/:id',
                element: <ProductListing/>,
            },
            {
                path: '/search/:query',
                element: <ProductsList/>,
            },
            {
                path: '/cart',
                element: <Cart/>,
            },
            {
                path: '/404',
                element: <Error/>,
            },
        ],
        errorElement: <Error/>,
    },
    
])