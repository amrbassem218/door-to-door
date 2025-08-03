import * as React from 'react';
import { RiMenu2Fill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from './input';
import { IoFilter } from "react-icons/io5";
import { Button } from './button';
import { CiUser } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import TopicBar from './topicBar';
import { useNavigate } from 'react-router-dom';
import TopBar from './topbar';
import { useSearch } from '@/searchContext';
import { useState, useEffect, useRef } from 'react';
import { LuUser } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import Sign from '../sign';
import SearchBar from './searchBar';
import Flag from 'react-world-flags'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Check, ChevronDownIcon, ChevronsUpDown } from "lucide-react"
import { ScrollArea } from './scroll-area';
import { countries } from '../countries';
import { Separator } from './separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { CiShoppingCart } from "react-icons/ci";
import { getCart, useUser } from '@/utilities';

interface IHeaderProps {
  
}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const navigate = useNavigate();
  // const countries
  const egypt = {code: "EG", name: "Egypt"};
  const [userCountry, setUserCountry] = useState(egypt);
  const [userLanguage, setUserLanguage] = useState("EN");
  const [userCurrency, setUserCurrency] = useState("USD");
  const [open, setOpen] = React.useState(false)
  const [cartLength, setCartLength] = useState(0);
  const user = useUser();
  useEffect(() => {
    if(user){
      const handleGetCart = async() => {
        const data = await getCart(user);
        if(data){
          setCartLength(data.length);
        }
      }
      handleGetCart();
    }
  }, [user])
  return (
    <div className='relative'>
      <TopBar/>
      <div className='grid-cols-12 border-border w-full '>
        <div className='px-20  mx-auto'>
          <div className='flex items-center justify-between w-full h-20 gap-15'>

            {/* Logo & Menu */}
            <div className='flex items-center gap-2 '>
              <button className='cursor-pointer text-primary font-semibold text-3xl' onClick={() => navigate('/')}>Door2Door</button>
            </div>

            <div className='flex-1 '>
              <SearchBar styles='w-full'/>
            </div>

            <div className='flex gap-5'>
              {/* Language & currency */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className='flex items-center gap-2 cursor-pointer'>
                    {/* flag */}
                    <div>
                      <Flag code={userCountry.code} className='w-7 h-7' />
                    </div>
                    <div className='text-xs text-text'>
                      <p>{userLanguage}/</p>
                      <p className='text-heading'>{userCurrency}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-70 bg-white px-5'>
                      <h1 className='text-xl text-heading font-bold'>Ship to</h1>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button variant={'outline'} role='combobox' aria-expanded={open} className='w-full border-1 flex justify-between items-center p-2'>
                              <div className='flex gap-2 items-center'>
                                <Flag code={userCountry.code} className='w-7 h-7'/>
                                <p>{userCountry.name}</p>
                              </div>
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className=" p-0">
                          <Command>
                            <CommandInput placeholder="Search framework..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {countries.map((country, i) => (
                                  <CommandItem
                                    key={country.name}
                                    value={country.name}
                                    onSelect={(currentValue) => {
                                      setUserCountry(currentValue === userCountry.name ? userCountry : countries[i])
                                      setOpen(false)
                                    }}
                                  >
                                    <div className='flex gap-2 items-center'>
                                      <Flag code={country.code} className='w-5 h-5'/>
                                      <p>{country.name}</p>
                                    </div>
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        userCountry === country ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                  {/* <DropdownMenuItem className='flex flex-col items-start'>
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sign */}
              <div className='flex gap-1 items-center pr-5 border-r-1'>
                <LuUser className='text-primary' size={30}/>
                <Sign/>
              </div>

              {/* Cart */}
              <div className='flex gap-1 items-center cursor-pointer' onClick={() => navigate('/cart')}>
                <CiShoppingCart className='text-primary' size={35}/>
                <div className='flex flex-col  justify-center items-center'>
                  <div className='w-10 h-3 bg-primary text-white flex items-center justify-center p-2 rounded-md'>
                    <p className='text-sm font-bold'>{cartLength}</p>
                  </div>
                  <button className='text-text text-sm font-semibold '>Cart</button>
                </div>
              </div>
            </div>
          </div>

        </div>
        <TopicBar/>
        {/* <div className='flex gap-3 justify-center '>
          <Button className='w-25 cursor-pointer'>
          <CiLogin size={20} className=''/>
          <p>Login</p>
          </Button>
          <Button className='w-25 cursor-pointer hover:bg-gray-200' variant={'secondary'}>
          <CiLogin size={20} className=''/>
          <p>Signup</p>
          </Button>
          </div> */}
      </div>
    </div>
  );
};

export default Header;
