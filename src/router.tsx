import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error/Error";

import Product from "./pages/product";
import Layout from "./components/Layout";
import ProductsList from "./pages/productsList";
import Cart from "./pages/cart";
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
                element: <Product/>,
            },
            {
                path: '/search/:query',
                element: <ProductsList/>,
            },
            {
                path: '/cart',
                element: <Cart/>,
            },
        ],
        errorElement: <Error/>,
    },
    
])