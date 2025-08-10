import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { addProductToCart, getCart, measurements, price, unitChange, useUser } from '@/utilities';
import { Button } from './button';
import type { CartItem, Product } from '@/types';
import { useState, useEffect } from 'react';
import { ScrollArea } from './scroll-area';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FaChevronDown } from 'react-icons/fa';

interface ICardSheetProps {
  product: Product,
  quantity: number;
  styles?: string;
}

const CartSheet: React.FunctionComponent<ICardSheetProps> = (props) => {
  const user = useUser();
  const [cart, setCart] = useState<CartItem[]>();
  const [subtotal, setSubtotal] = useState(0);
  const [cartQuantity, setCartQuantity] = useState<Record<number,number>>({});
  const [cartMeasurement, setCartMeasurement] = useState<Record<number,string>>({});
  const navigate = useNavigate();
  const id = (product: Product) => {
    return Number(product.id);
  }
  const handleAddToCart = async() => {
    if(user){
        const status = await addProductToCart(user,props.product, props.quantity);
        let data = await getCart(user);
        if(data){
          let total = 0;
          let currentCartQuantity = cartQuantity;
          let currentCartMeasurement = cartMeasurement;
          data.forEach(({products: product, quantity, measurement}) => {
            total += Math.round(product.price)
            currentCartQuantity[id(product)] = quantity;
            currentCartMeasurement[id(product)] = measurement;
          })
          // console.log("quantity: ", currentCartQuantity);
          // console.log("measurement: ", currentCartMeasurement);
          setCartQuantity(currentCartQuantity);
          setCartMeasurement(currentCartMeasurement);
          setSubtotal(total);
          setCart(data);
          // console.log(data);
        }
    }
    else{

    }
  }
  
  const handleMeasurementChange = (product: Product, mes: string) => {
    const pid = id(product);
    const convertedMeasurement = Number(unitChange(cartQuantity[pid], cartMeasurement[pid], mes));
    setCartQuantity({...cartQuantity, [pid]: convertedMeasurement});
    setCartMeasurement({...cartMeasurement, [pid]: mes}); 
  }
  // if(!cartQuantity || !cartMeasurement){
  //   return <div>loading...</div>
  // }
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Button variant={'outline'} className={`sm:flex-1 max-w-40 ${props.styles}`} onClick={() => handleAddToCart()}>Add to Cart</Button>
        </SheetTrigger>
        <SheetContent className='w-60 pl-2 flex flex-col h-screen'>
          <SheetHeader className='h-32 mb-3'>
            <SheetTitle>Cart</SheetTitle>
            <SheetDescription>
              <div className='flex flex-col justify-center items-center'>
                <div className='mb-2 '>
                  <h2 className='text-center text-heading'>Subtotal</h2>
                  <h3 className='text-center font-bold text-md text-orange-700 '>${subtotal}</h3>
                </div>
                <Button variant={'outline'} className='w-full h-7' onClick={() => navigate('/cart')}>Go to Cart</Button>
              </div>
              
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className='flex-1 overflow-auto'>
            <div className='flex flex-col gap-10 mr-4'>
              {cart?.map(({products: product}) => (
                <div className='flex hover:bg-background-secondary cursor-pointer items-center h-40 gap-5' onClick={() => navigate(`/product/${product.id}`)}>
                  
                  {/* Product image */}
                  <div className='w-20 h-35 flex flex-col justify-center gap-2 items-center py-4'>
                    <img src={product.thumbnail} alt="" className='object-contain h-full max-w-full' />
                    <span className='text-xs text-text'>(${Math.round(product.price)}/{cartMeasurement[id(product)]})</span>
                  </div>
                  <div className='space-y-3 text-sm '>
                    
                    {/* Name */}
                    <div className='max-w-35 break-words whitespace-normal'>
                      <h2 className='line-clamp-2 font-medium text-center'>{product.name}</h2>
                    </div>
                    {/* Total & Qty */}
                    <div className='space-y-1'>
                      
                      {/* Quantity Change*/}
                      <div>
                        {
                          cartQuantity && cartMeasurement &&
                          <div className='flex gap-1 w-full'>
                            <span className='text-text font-normal'>Qty: </span> 
                            <div className='flex items-center'>
                                <button className='border-1 p-1 cursor-pointer' onClick={() => setCartQuantity({...cartQuantity, [product.id]: cartQuantity && cartQuantity[id(product)]-1})}>
                                    <FiMinus size={10}/>  
                                </button> 
                                <input 
                                    type='number' 
                                    value={cartQuantity[id(product)]} 
                                    className='border-1 min-w-10 max-w-5 h-5 text-center' 
                                    // style={{ width: `${Math.max(3, Math.min(8, cartQuantity[id(product)].toString().length + 1))}rem` }}
                                    onChange={(e) => setCartQuantity({...cartQuantity, [id(product)]: Number(e.target.value)})}
                                />
                                <button className='border-1 p-1 cursor-pointer bg-primary text-white' onClick={() => setCartQuantity({...cartQuantity, [product.id]: cartQuantity && cartQuantity[id(product)]+1 })}>
                                    <FiPlus size={10}/>  
                                </button>
                            </div>
                          </div>
                        }
                      </div>

                      {/* total */}
                      <p className='font-semibold'><span className='text-text font-normal'>total: </span> ${Math.round(product.price)}</p>
                      
                    </div>
                    {/* Measurement change */}
                    <div>
                      <span className='text-text font-normal'>mes: </span> 
                        <DropdownMenu>
                            <DropdownMenuTrigger className='m-auto'>
                                <Button variant={'link'} className='h-4 px-0 text-text text-sm decoration-0 bg-background-secondary rounded-lg border-gray-300 border-1 gap-4'>
                                    {cartMeasurement[id(product)]}
                                    <FaChevronDown size={5} className='text-text'/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Measurement</DropdownMenuLabel>
                                {
                                    measurements.map((mes) => (
                                        <DropdownMenuItem onClick={() => handleMeasurementChange(product, mes)}>{mes}</DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartSheet;
