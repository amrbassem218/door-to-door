import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error/Error";

import Layout from "./components/Layout";
import ProductsList from "./pages/productsList";
import Cart from "./pages/cart";
import ProductListing from "./pages/product";
import AuthCallback from "./components/ui/authCallback";
import Category from "./pages/categories/categorySpecific";
import Account from "./pages/account";
import Settings from "./pages/settings";
import Profile from "./pages/settings/profile";
import Country from "./pages/settings/country";
import AdressPicker from "./components/ui/adressPicker";
import LocationPage from "./pages/location";
import Currency from "./pages/settings/currency";
import Categories from "./pages/categories";
import AddProduct from "./pages/add_product";
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
                path: '/account/settings',
                element: <Settings/>
            },
            {
                path: '/account/settings/profile',
                element: <Profile/>
            },
            {
                path: '/account/settings/country',
                element: <Country/>
            },
            {
                path: '/account/settings/currency',
                element: <Currency/>
            },
            {
                path: '/location',
                element: <LocationPage/>
            },
            {
                path: '/categories',
                element: <Categories/>
            },
            {
                path: '/add_product',
                element: <AddProduct/>
            },
            {
                path: '/404',
                element: <Error/>,
            },
        ],
        errorElement: <Error/>,
    },
    
])