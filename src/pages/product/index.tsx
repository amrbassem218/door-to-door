import Header from '@/components/ui/Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as React from 'react';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'
import { FaAngleDown, FaCaretDown, FaMinus, FaStar } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { FaAngleRight } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FaChevronDown } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Input } from '@/components/ui/input';
import { FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { addProductToCart, camel, convertPrice, getProduct, measurements, newPrice, price, unitChange, useUser } from '@/utilities';
import type { Product } from '@/types/types';
import Error from '../error/Error';
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import ProductSideBar from '@/components/ui/productSideBar';
import MeasurementChange from '@/components/ui/measurementChange';
import QuantityChange from '@/components/ui/quantityChange';
import { LuShoppingCart } from 'react-icons/lu';
import CartSheet from '@/components/ui/cartSheet';
import ProductHighLight from '@/components/ui/productHighlightSection';
import SimialrProducts from '@/components/ui/similarProducts';
import { getProfile } from '@/userContext';
import { useCurrencyRates } from '@/getRates';

interface IProductProps {
}

const ProductListing: React.FunctionComponent<IProductProps> = (props) => {
    const {id} = useParams();
    const [activeTab, setActiveTab] = useState("Customer Reviews");
    const [reviewSort, setReviewSort] = useState('Most relevant');
    const [product, setProduct] = useState<Product>();
    const [measurement, setMeasurement] = useState(measurements[0]);
    const [quantity, setQuantity] = useState<number>(1);
    const user = useUser();
    const navigate = useNavigate();
    const [isCrop, setIsCrop] = useState(false);
    const { rates, loading } = useCurrencyRates();
    const userProfile = getProfile();
    const [userCurrency, setUserCurrency] = useState<string>("USD");
    useEffect(() => {setUserCurrency(userProfile?.userProfile?.currencies.currencyCode ?? "USD")}, [userProfile?.userProfile?.currencies.currencyCode])
    useEffect(() => {
        if(product){
            setMeasurement(localStorage.getItem(`${product.id}_measurement`) ?? measurements[0]);
            console.log("ma ho by7sl")
            if(localStorage.getItem(`${product?.id}_quantity`)){
                setQuantity(Number(localStorage.getItem(`${product?.id}_quantity`)) ?? product?.minOrder ?? 1);
            }
        }
    }, [product]);

    useEffect(() => {
        if(product && quantity){
            localStorage.setItem(`${product?.id}_quantity`, quantity.toString());
        }
    }, [quantity]);
    
    useEffect(() => {
        if(product && measurement){
            localStorage.setItem(`${product?.id}_measurement`, measurement);
        }
    }, [measurement])
    const sortingTypes = [
        "Most relevant",
        "Latest",
        "Oldest",
        "Low to High",
        "High to low",
    ]
    const handleMeasurementChange = (mes: string) => {
        let converted = unitChange(quantity, measurement, mes);
        let minOrderOfNewUnit = unitChange(product?.minOrder ?? 0, 'kg', mes);
        // if(converted < minOrderOfNewUnit){
        //     converted = minOrderOfNewUnit;
        // }
        setQuantity(Number(converted));
        setMeasurement(mes);
        
    }

    const handleQuantityChange = (type: string) => {
        if(type == "plus"){
            setQuantity(quantity + 1);
        }
        else if(type == "minus"){
            setQuantity(quantity - 1);
        }
        else{
            setQuantity(Number(type));
        }
    }

    useEffect(() => {
        if(id){
            const handleGetProduct = async() => {
                let productInfo = await getProduct(Number(id));
                productInfo = camel(productInfo);
                setProduct(productInfo);
                setIsCrop(productInfo.tags?.includes("crops"));
                setQuantity(productInfo?.minOrder ?? 1);
            }
            handleGetProduct();
        }
    }, [id])
    const [currentImage, setCurrentImage] = useState(0);
    useEffect(() => {
        window.scrollTo(0,0);
    }, [product])
    if(!product){
        return <Error/>
    }
   
      if(loading) return <p>loading...</p>
  return (
    <div className='bg-gray-100 flex flex-col gap-2 sm:mb-0'>
        <div className='sm:px-10 sm:grid grid-cols-16 gap-10 flex flex-col bg-white sm:py-5'>
            {/* Product Main */}
            <div className='flex flex-col sm:flex-row gap-5 col-span-12 border-b-1 px-3'>
                {/* Images */}
                <div className='gap-2 sm:flex hidden'>
                    {/* Images sideBar */}
                    <ScrollArea className='w-20 h-90 '>
                        <div className='flex flex-col gap-1'>
                            {product.images.map((image, i) => (
                            <div className={`w-20 h-20 border-1 flex justify-center items-center ${currentImage == i && "border-primary"} cursor-pointer`} onClick={() => setCurrentImage(i)}>
                                <img src={`${image}`} alt="" className='object-contain h-full max-w-full ' />
                            </div>
                            ))}
                        </div>
                    </ScrollArea>
                    {/* Main image */}
                    <div className='w-90 h-90 border-1 flex justify-center items-center '>
                        <img src={`${product.images[currentImage]}`} alt="" className='object-contain h-full max-w-full ' />
                    </div>
                </div>

                {/* Images for phone */}
                <div className=''>
                    <Carousel className='w-full h-70 border-1 sm:hidden overflow-visible'>
                        <CarouselContent className='flex gap-2'>
                            {product.images.map((image) => (
                                <CarouselItem className='basis-[80%] h-70 shrink-0 flex items-center justify-center'>
                                    <img src={image} alt="" className='object-contain max-w-full h-full rounded-md' />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                {/* Product Main Description */}
                <div className=''>
                    <div className='mb-2'>
                        <h1 className='text-xl font-semibold'>{product.name}</h1>
                        {/* Rating and Stock */}
                        <div className="flex items-end gap-1">
                            <Rating
                                readonly
                                initialValue={product.rating}
                                size={25}
                                SVGstyle={{ display: 'inline-block' }}
                                allowFraction // allows values like 3.5 stars
                            />
                            <p className="text-md font-normal text-gray-600">({product?.reviewCount ?? 0}) reviews | </p>
                            <p className={`text-md font-normal ${product?.stockCount || isCrop ? "text-green-600" : 'text-red-600'}`}>{(product?.stockCount || isCrop) ? "In stock" : "Out of stock"}</p>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        { !isCrop
                        && <h1 className='text-2xl'>{newPrice(product, userCurrency, rates,quantity, measurement)} {userCurrency} </h1>
                        }
                        <p>{product.description}</p>
                    </div>
                    <div className='mt-2 border-b-2'></div>
                </div>            

            </div>
            

            {/* Right sideBar for pc*/}
            <div className='hidden sm:block sm:col-span-4 '>
                <ProductSideBar product={product} quantity={quantity} setQuantity={setQuantity} measurement={measurement} setMeasurement={setMeasurement} handleMeasurementChange={handleMeasurementChange} handleQuantityChange={handleQuantityChange}/>
            </div>
        </div>
        {/* Tabs for pc */}
        {/* <nav className='mb-10 hidden sm:block bg-white'>
            <ul className='flex gap-2 text-text cursor-pointer mx-15'>
                {['Customer Reviews', 'Specifications', 'Full Description', 'About Store'].map((e) => 
                    {
                        return e == activeTab 
                        ? <li className='flex items-center text-black font-medium'>
                            <FaLocationDot size={15}/>
                            {e}
                        </li> 
                        : <li onClick={() => setActiveTab(e)}>{e}</li>
                    }
                )}
            </ul>
        </nav> */}
        {/* Bottom bar for mobile */}
        <div className='sm:hidden fixed bottom-0 left-0 h-12 border-t-1 w-full bg-background flex items-center gap-4 px-2 z-10 '>
            <div className='flex  gap-2'>
                <LuShoppingCart className='text-text text-2xl' onClick={() => navigate('/cart')}/>

                {/* <QuantityChange handleQuantityChange={handleQuantityChange} value={quantity} mobile={true} styles='w-25'/> */}
                
                {/* Measurement */}
                {/* <MeasurementChange product={product} label={measurement} handleMeasurementChange={handleMeasurementChange} styles='h-7 w-17' /> */}
            </div>
            <div className='flex gap-2 w-full'>
                <CartSheet product={product} quantity={quantity} styles='w-30'/>
                {
                    isCrop 
                    ? <Button className='m-auto flex-1 border-1 '>Contact Seller</Button>
                    : <Button className='m-auto flex-1 border-1 '>Buy Now</Button>
                } 
            </div>
        </div>
        {/* Review Section*/}
        <section className='w-full h-50 py-2 px-3 bg-white'>
            {/* Header */}
            <div className='space-y-2'>
                <div className='flex gap-1 items-center justify-between '>
                    <h1 className='text-lg sm:text-xl font-normal'>Reviews</h1>
                    <div className='flex gap-1 text-sm items-center'>
                        <p>See all  </p>
                        <FaAngleRight className='text-text ' size={12}/>
                    </div>
                </div>

                {/* Rating */}
                <div className='flex container items-center gap-1'>
                    <p className='text-2xl font-bold '>{product.rating}</p>
                    <Rating
                        readonly
                        initialValue={product.rating}
                        size={20}
                        SVGstyle={{ display: 'inline-block' }}
                        allowFraction 
                        className=''
                    />
                    <p>({product.reviewCount})</p>
                </div>
                
                {/* Sort */}
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className='flex gap-1 items-center'>
                                <p className='text-sm'>Sort by <span className='hover:text-primary'>{reviewSort}</span></p>
                                <FaChevronDown size={12} className=''/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {sortingTypes.map((e) => (
                                <DropdownMenuItem onClick={() => setReviewSort(e)}>{e}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Reviews content */}
            <div>
                {/* Add later */}
            </div>
            
            
        </section>

        {/* Specification Section */}
        <section className='w-full flex flex-col h-62 py-2 px-3 bg-white space-y-2'>
            {/* Header */}
            <div className='flex gap-1 items-center justify-between '>
                <h1 className='text-lg sm:text-xl font-normal'>Specifications</h1>
                <FaAngleRight className='text-text ' size={12}/>
            </div>

            {/* Specification Content */}
            <div className='w-full flex-1 bg-gray-100'>

            </div>
            
        </section>
        
        {/* Highlights Section */}
        <section className='w-full flex flex-col  py-2 px-3 bg-white space-y-2'>
            {/* Header */}
            <div className='flex gap-1 items-center justify-between '>
                <h1 className='text-lg sm:text-xl font-normal'>Highlights</h1>
                {/* <FaAngleRight className='text-text ' size={12}/> */}
            </div>

            {/* Highlights Content */}
            <div className=''>
                <ProductHighLight text={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore sunt veritatis repellendus tempore accusantium consequuntur enim ducimus quo cum minima quibusdam odit deleniti excepturi quaerat possimus aspernatur ullam, beatae omnis quia mollitia inventore voluptate quos laborum! Cumque quae eos eligendi tempore laudantium quidem, voluptates natus accusantium iure dicta maiores totam molestias illum adipisci earum sapiente quibusdam libero excepturi animi fugit cupiditate nihil quas deleniti blanditiis! Facilis, voluptates rem ut, maxime, quo omnis ea repellat fuga dicta at perspiciatis quibusdam! Quae, inventore amet? Hic dolor voluptates unde odio sapiente dolore, aperiam sunt nostrum distinctio ex maxime beatae provident deleniti natus error.'}/>
            </div>
            
        </section>

        <div>
            <SimialrProducts product={product}/>
        </div>
        
    </div>
  );
};

export default ProductListing;
