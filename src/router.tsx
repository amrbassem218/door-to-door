import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error/Error";

import Layout from "./components/Layout";
import ProductsList from "./pages/productsList";
import Cart from "./pages/cart";
import ProductListing from "./pages/product";
import AuthCallback from "./components/ui/authCallback";
import Category from "./pages/category";
import Account from "./pages/account";
import Settings from "./pages/settings";
import Profile from "./pages/settings/profile";
import Country from "./pages/settings/country";
import AdressPicker from "./components/ui/adressPicker";
import LocationPage from "./pages/location";
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
                path: '/auth/callback',
                element: <AuthCallback/>,
            },
            {
                path: '/category/:category',
                element: <Category/>,
            },
            {
                path: '/account',
                element: <Account/>,
            },
            {
                path: '/settings',
                element: <Settings/>
            },
            {
                path: '/settings/profile',
                element: <Profile/>
            },
            {
                path: '/settings/country',
                element: <Country/>
            },
            {
                path: '/location',
                element: <LocationPage/>
            },
            {
                path: '/404',
                element: <Error/>,
            },
        ],
        errorElement: <Error/>,
    },
    
])