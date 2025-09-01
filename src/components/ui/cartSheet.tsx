import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { addProductToCart, getCart, measurements, newPrice, price, unitChange, updateMes, updateQty, useUser } from '@/utilities';
import { Button } from './button';
import type { CartItem, Product } from '@/types/types';
import { useState, useEffect } from 'react';
import { ScrollArea } from './scroll-area';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FaChevronDown } from 'react-icons/fa';
import { getProfile } from '@/userContext';
import { useCurrencyRates } from '@/getRates';

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
  const { rates, loading } = useCurrencyRates();
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  useEffect(() => {setUserCurrency(userProfile?.userProfile?.currencies.currencyCode ?? "USD")}, [userProfile?.userProfile?.currencies.currencyCode])
  const id = (product: Product) => {
    return Number(product.id);
  }
  useEffect(() => {
    if(cart){
      cart.forEach(({products: product}) => {
        const pid = product.id;
        setCartMeasurement({...cartMeasurement, [pid]: localStorage.getItem(`${product.id}_measurement`) ?? measurements[0]});
        console.log("ma ho by7sl")
        if(localStorage.getItem(`${product?.id}_quantity`)){
          setCartQuantity({...cartQuantity, [pid]: (Number(localStorage.getItem(`${product?.id}_quantity`)) ?? product?.minOrder ?? 1)});
        }
      })   
    }
}, [cart]);
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
          setCartQuantity(currentCartQuantity);
          setCartMeasurement(currentCartMeasurement);
          setSubtotal(total);
          setCart(data);
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
    localStorage.setItem(`${product.id}_measurement`, mes);
    updateMes(product, mes);
    localStorage.setItem(`${product.id}_quantity`, convertedMeasurement.toString());
    updateQty(product, convertedMeasurement);
  }

  const handleQuantityChange = (product:Product, type: string, val?: string) => {
    if(product){
      let qnt = cartQuantity[id(product)];
      if(type == "plus"){
        setCartQuantity({...cartQuantity, [product.id]: cartQuantity && qnt+1})
        qnt++; 
      }
      else if(type == "minus"){
        setCartQuantity({...cartQuantity, [product.id]: cartQuantity && qnt-1})
        qnt--;
      }
      else{
        setCartQuantity({...cartQuantity, [id(product)]: Number(type)})
        qnt = Number(type);
      }
      localStorage.setItem(`${product.id}_quantity`, qnt.toString());
      updateQty(product, qnt);
    }
  }
  // if(!cartQuantity || !cartMeasurement){
  //   return <div>loading...</div>
  // }
  if(loading) return <p>loading...</p>
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Button variant={'outline'} className={`sm:flex-1 max-w-40 ${props.styles}`} onClick={() => handleAddToCart()}>Add to Cart</Button>
        </SheetTrigger>
        <SheetContent className='w-60 pl-2 flex flex-col h-screen'>
          <SheetHeader className='h-32 mb-3'>
            <SheetTitle>Cart</SheetTitle>
            <div>
              <div className='flex flex-col justify-center items-center'>
                <div className='mb-2 '>
                  <h2 className='text-center text-heading'>Subtotal</h2>
                  <h3 className='text-center font-bold text-md text-orange-700 '>{subtotal} {userCurrency}</h3>
                </div>
                <Button variant={'outline'} className='w-full h-7' onClick={() => navigate('/cart')}>Go to Cart</Button>
              </div>
              
            </div>
          </SheetHeader>
          <ScrollArea className='flex-1 overflow-auto'>
            <div className='flex flex-col gap-10 mr-4'>
              {cart?.map(({products: product}) => (
                <div className='flex hover:bg-background-secondary cursor-pointer items-center h-40 gap-5' onClick={() => navigate(`/product/${product.id}`)}>
                  
                  {/* Product image */}
                  <div className='w-20 h-35 flex flex-col justify-center gap-2 items-center py-4'>
                    <img src={product.thumbnail} alt="" className='object-contain h-full max-w-full' />
                    <span className='text-xs text-muted'>( {newPrice(product, userCurrency, rates, 1, cartMeasurement[id(product)])} {userCurrency} / {cartMeasurement[id(product)]})</span>
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
                            <span className='text-muted font-normal'>Qty: </span> 
                            <div className='flex items-center'>
                                <button className='border-1 p-1 cursor-pointer' onClick={() => handleQuantityChange(product, "minus")}>
                                    <FiMinus size={10}/>  
                                </button> 
                                <input 
                                    type='number' 
                                    value={cartQuantity[id(product)]} 
                                    className='border-1 min-w-10 max-w-5 h-5 text-center' 
                                    // style={{ width: `${Math.max(3, Math.min(8, cartQuantity[id(product)].toString().length + 1))}rem` }}
                                    onChange={(e) => handleQuantityChange(product, "other", e.target.value)}
                                />
                                <button className='border-1 p-1 cursor-pointer bg-primary text-white' onClick={() => handleQuantityChange(product, "plus")}>
                                    <FiPlus size={10}/>  
                                </button>
                            </div>
                          </div>
                        }
                      </div>

                      {/* total */}
                      <p className='font-semibold'><span className='text-muted font-normal'>total: </span> {newPrice(product, userCurrency, rates, cartQuantity[id(product)], cartMeasurement[id(product)])} {userCurrency}</p>
                      
                    </div>
                    {/* Measurement change */}
                    <div>
                      <span className='text-muted font-normal'>mes: </span> 
                        <DropdownMenu>
                            <DropdownMenuTrigger className='m-auto'>
                                <Button variant={'link'} className='h-4 px-0 text-muted text-sm decoration-0 bg-background-secondary rounded-lg border-gray-300 border-1 gap-4'>
                                    {cartMeasurement[id(product)]}
                                    <FaChevronDown size={5} className='text-muted'/>
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
