import Header from '@/components/ui/Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'
import { FaAngleDown, FaMinus, FaStar } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { FaAngleRight } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FaChevronDown } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Input } from '@/components/ui/input';
import { FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { addProductToCart, camel, getProduct, measurements, unitChange, useUser } from '@/utilities';
import type { Product } from '@/types';
import Error from '../error/Error';
import { toast } from 'sonner';
import CardSheet from '@/components/ui/cardSheet';

interface IProductProps {
}

const ProductListing: React.FunctionComponent<IProductProps> = (props) => {
    const {id} = useParams();
    
    const [measurement, setMeasurment] = useState(measurements[0]);
    const [activeTab, setActiveTab] = useState("Customer Reviews");
    const [reviewSort, setReviewSort] = useState('Most relevant');
    const [product, setProduct] = useState<Product>();
    const [quantity, setQuantity] = useState<number>(0);
    const user = useUser();
    const navigate = useNavigate();
    const sortingTypes = [
        "Most relevant",
        "Latest",
        "Oldest",
        "Low to High",
        "High to low",
    ]
    // const product: Product = 
    // {
    //     name:"L'Oreal Paris Makeup True Match Lumi Glotion, Natural Glow Enhancer, Illuminator Highlighter, Bronzing Drops For a Sun-Kissed Glow, 903 Medium",
    //     thumbnail: 'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //     images: [
    //         'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //         'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //         'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //         'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //         'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //         'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //         'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //         'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
    //         'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
    //     ],
    //     price: 499,
    //     priceBefore: 750,
    //     id: "111",
    //     rating: 3.5,
    //     reviewCount: 120,
    //     stockCount: 40,
    //     description: "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi.",
    //     seller: "Shop1102879409 Store (Trader)",
    //     sellerId: "Er12345",
    //     minOrder: 350
    // }
    useEffect(() => {
        if(id){
            const handleGetProduct = async() => {
                let productInfo = await getProduct(Number(id));
                productInfo = camel(productInfo);
                setProduct(productInfo);
                setQuantity(productInfo.minOrder);
            }
            handleGetProduct();
        }
    }, [])
    const [currentImage, setCurrentImage] = useState(0);
    const handleMeasurementChange = (mes: string) => {
        let converted = unitChange(quantity, measurement, mes);
        let minOrderOfNewUnit = unitChange(product?.minOrder ?? 0, 'kg', mes);
        if(converted < minOrderOfNewUnit){
            converted = minOrderOfNewUnit;
        }
        setQuantity(Number(converted));
        setMeasurment(mes);
    }
    if(!product){
        return <Error/>
    }
    
    // if(!product){
    //     navigate('/404');
    // }
  return (
    <>
    <div className='mx-15 my-10 grid grid-cols-16 gap-10'>
        {/* Product Main */}
        <div className='flex gap-5 col-span-12 border-b-1 pb-5'>
            {/* Images */}
            <div className='flex gap-2'>
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
                        <p className={`text-md font-normal ${product?.stockCount ? "text-green-600" : 'text-red-600'}`}>{product?.stockCount ? "In stock" : "Out of stock"}</p>
                    </div>
                </div>

                <div className='space-y-2'>
                    <h1 className='text-2xl'>${product.price.toFixed(2)}</h1>
                    <p>{product.description}</p>
                </div>
                <div className='mt-2 border-b-2'></div>
            </div>            
            {/* right SideBar */}
        </div>
        {/* Right sideBar */}
        <div className='col-span-4 border-1 p-4'>
            {/* Price */}
            <div className='flex flex-col items-start border-b-1 pb-3'>
                <p className='text-2xl'>${product.price} <span className='text-sm text-text'>($14 / ounce)</span></p>
                <Popover>
                    <PopoverTrigger>
                        <button className='text-primary text-left hover:underline decoration-1 cursor-pointer'>International Returns</button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <h1 className='font-medium'>Return this item </h1>
                        <p className='text-sm'>International returns are available for the shipping address you chose. You can return the item for any reason in new and unused condition: return shipping charges may apply.</p>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Seller */}
            <div className='flex justify-between gap-6 border-b-1 py-3'>
                <p className='font-medium '>Sold by</p>
                <div className='flex flex-1 items-center w-10 justify-end cursor-pointer'>
                    <p className='truncate text-ellipsis overflow-hidden hover:underline'>{product.seller}</p>
                    <FaAngleRight size={15}/>
                </div>
            </div>

            {/* Shipping place */}
            <div className='flex justify-between gap-6 border-b-1 py-3'>
                <p className='font-medium '>Ship to</p>
                <div className='flex flex-1 items-center w-10 justify-end cursor-pointer'>
                    <CiLocationOn/>
                    <p className='truncate text-ellipsis overflow-hidden hover:underline'>Said St. by Helw St.</p>
                    <FaAngleRight size={15}/>
                </div>
            </div>

            {/* Stock & Purchase */}
            <div className='flex flex-col items-start border-b-1 py-3 gap-4'>
                <div className='flex justify-between  w-full'>
                    <h1 className={`text-xl  font-medium ${product?.stockCount ? "text-green-600" : 'text-red-600'}`}>{product?.stockCount ? "In stock" : "Out of stock"}</h1>

                    {/* Measurement change */}
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='m-auto'>
                                <Button variant={'link'} className='text-heading decoration-0 bg-background-secondary p-1 px-2 rounded-lg border-gray-300 border-1 flex items-center gap-4'>
                                    Size: {measurement}
                                    <FaChevronDown size={15} className='text-text'/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {
                                    measurements.map((mes) => (
                                        <DropdownMenuItem onClick={() => handleMeasurementChange(mes)}>{mes}</DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                </div>
                {/* Quantity */}
                <div className='flex justify-center items-center gap-4 w-full'>
                    <div className='flex items-center m-auto'>
                        <button className='border-1 p-1 cursor-pointer' onClick={() => setQuantity(quantity-1)}>
                            <FiMinus size={20}/>  
                        </button>
                        <input 
                            type='number' 
                            value={quantity} 
                            className='border-1 px-2 min-w-15 max-w-40 w-auto h-8' 
                            style={{ width: `${Math.max(3, Math.min(8, quantity.toString().length + 1))}rem` }}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <button className='border-1 p-1 cursor-pointer bg-primary text-white' onClick={() => setQuantity(quantity+1)}>
                            <FiPlus size={20}/>  
                        </button>
                    </div>
                    <CardSheet product={product} quantity={quantity}/>
                </div>
                {/* Add to cart & Heart */}
                <div className='flex gap-2 w-full'>
                    <Button className='m-auto flex-1'>Buy Now</Button>
                    <Button variant={'outline'} className='text-text w-10 hover:text-red-500'>
                        <FaHeart className=''/>
                    </Button>
                </div>
            </div>

            {/* shipping */}
            {/* <div className='flex justify-between gap-6 border-b-1 py-3'>
                <p className='font-medium '>Ship to</p>
                <div className='flex flex-1 items-center w-10 justify-end cursor-pointer'>
                    <CiLocationOn/>
                    <p className='truncate text-ellipsis overflow-hidden hover:underline'>Said St. by Helw St.</p>
                    <FaAngleRight size={15}/>
                </div>
            </div> */}

        </div>
    </div>
    <div>
        <nav className='mb-10'>
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
