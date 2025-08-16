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
import { addProductToCart, camel, getProduct, measurements, price, unitChange, useUser } from '@/utilities';
import type { Product } from '@/types/types';
import Error from '../error/Error';
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import ProductSideBar from '@/components/ui/productSideBar';
import MeasurementChange from '@/components/ui/measurementChange';
import QuantityChange from '@/components/ui/quantityChange';
import { LuShoppingCart } from 'react-icons/lu';
import CartSheet from '@/components/ui/cartSheet';

interface IProductProps {
}

const ProductListing: React.FunctionComponent<IProductProps> = (props) => {
    const {id} = useParams();
    const [measurement, setMeasurement] = useState(measurements[0]);
    const [activeTab, setActiveTab] = useState("Customer Reviews");
    const [reviewSort, setReviewSort] = useState('Most relevant');
    const [product, setProduct] = useState<Product>();
    const [quantity, setQuantity] = useState<number>(0);
    const user = useUser();
    const navigate = useNavigate();
    const [isCrop, setIsCrop] = useState(false);

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
        if(converted < minOrderOfNewUnit){
            converted = minOrderOfNewUnit;
        }
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
                setQuantity(productInfo?.minOrder ?? 0);
            }
            handleGetProduct();
        }
    }, [])
    const [currentImage, setCurrentImage] = useState(0);
    useEffect(() => {
    }, [product])
    if(!product){
        return <Error/>
    }
    
    // if(!product){
    //     navigate('/404');
    // }
  return (
    <>
    <div className='sm:mx-15  my-10 sm:grid grid-cols-16 gap-10 flex flex-col'>
        {/* Product Main */}
        <div className='flex flex-col sm:flex-row gap-5 col-span-12 border-b-1 pb-5 px-3'>
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
                    && <h1 className='text-2xl'>${Math.round(product.price).toFixed(2)}</h1>
                    }
                    <p>{product.description}</p>
                </div>
                <div className='mt-2 border-b-2'></div>
            </div>            

            {/* Bottom bar for mobile */}
            <div className='sm:hidden fixed bottom-0 left-0 h-12 border-t-1 w-full bg-background flex items-center gap-4 px-2 z-10'>
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
        </div>

        {/* Right sideBar for pc*/}
        <div className='hidden sm:block sm:col-span-4 '>
            <ProductSideBar product={product} quantity={quantity} setQuantity={setQuantity} measurement={measurement} setMeasurement={setMeasurement} handleMeasurementChange={handleMeasurementChange}/>
        </div>
    </div>
    <div>
        <nav className='mb-10 hidden sm:block'>
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
        </nav>

        {/* Reviews */}
        <section className='mx-15'>
            <div className='flex gap-1'>
                <h1 className='text-xl font-semibold'>Reviews | {product.rating}</h1>
                <Rating
                    readonly
                    initialValue={product.rating}
                    size={25}
                    SVGstyle={{ display: 'inline-block' }}
                    allowFraction // allows values like 3.5 stars
                />
                <div className='flex items-end'>
                    <span className='text-sm text-text'>({product.reviewCount})</span>
                </div>

            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className='flex gap-1 items-center'>
                            <p className='text-sm hover:text-primary'>Sort by {reviewSort}</p>
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
        </section>
    </div>
    </>
  );
};

export default ProductListing;
