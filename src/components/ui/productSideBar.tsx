import * as React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CartSheet from '@/components/ui/cartSheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Product } from '@/types';
import { FaAngleRight, FaChevronDown, FaHeart } from 'react-icons/fa';
import { CiLocationOn } from 'react-icons/ci';
import { Button } from './button';
import { measurements, unitChange } from '@/utilities';
import { FiMinus, FiPlus } from 'react-icons/fi';
import type {Dispatch, SetStateAction } from 'react';
interface IProductSideBarProps {
  product: Product;
  measurement: string;
  setMeasurement: Dispatch<SetStateAction<string>>; 
  quantity: number; 
  setQuantity: Dispatch<SetStateAction<number>>; 
  handleMeasurementChange: (mes: string) => void;
}

const ProductSideBar: React.FunctionComponent<IProductSideBarProps> = ({product, measurement, setMeasurement, quantity, setQuantity, handleMeasurementChange}) => {
  return (
    <div className='w-full border-1 p-4'>
            {/* Price */}
            <div className='flex flex-col items-start border-b-1 pb-3'>
                <p className='text-2xl'>${Math.round(product.price)} <span className='text-sm text-text'>($14 / ounce)</span></p>
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
                    <CartSheet product={product} quantity={quantity}/>
                </div>
                {/* Buy now & Heart */}
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
  );
};

export default ProductSideBar;
