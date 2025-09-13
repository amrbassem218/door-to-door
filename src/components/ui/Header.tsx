import * as React from 'react';
import { RiMenu2Fill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from './input';
import { IoFilter } from "react-icons/io5";
import { Button } from './button';
import { CiUser } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import TopicBar from './topicBar';
import { useLocation, useNavigate } from 'react-router-dom';
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
// import { Separator } from './separator';r
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
import { getCart, useUser, cleanupDuplicateCarts } from '@/utilities';
import { LuShoppingCart } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosMenu } from "react-icons/io";
import MobileTopicBar from './mobileTopicBar';
import Menu from './menu';
import { FaAngleRight } from 'react-icons/fa';
import LocationDialog from './setLocation';
import { getProfile } from '@/userContext';

interface IHeaderProps {
  showSearch?: boolean;
}

const Header: React.FunctionComponent<IHeaderProps> = ({showSearch}) => {
  const navigate = useNavigate();
  // const countries
  const egypt = {code: "EG", name: "Egypt"};
  const [userCountry, setUserCountry] = useState(egypt);
  const [userLanguage, setUserLanguage] = useState("EN");
  const [userCurrency, setUserCurrency] = useState("USD");
  const [open, setOpen] = React.useState(false)
  const [cartLength, setCartLength] = useState(0);
  const user = useUser();
  const userProfile = getProfile();
  useEffect(() => {
    if(user){
      const handleGetCart = async() => {
        try {
          // First clean up any duplicate carts
          await cleanupDuplicateCarts(user);
          
          // Then get the cart data
          const data = await getCart(user);
          if(data){
            setCartLength(data.length);
          }
        } catch (error) {
          console.error("Error handling cart in Header:", error);
          setCartLength(0);
        }
      }
      handleGetCart();
    } else {
      setCartLength(0);
    }
  }, [user])
  const goBack = () => { 
    navigate(-1);
  }
  const location = useLocation();
  return (
    <div className={`fixed top-0 left-0 w-full bg-primary text-primary-foreground z-50  ${location.pathname == '/' && "sm:absolute"}`}>
      {/* <TopBar/> */}
      <div className=' w-full '>
        <div className='sm:px-20 px-2 mx-auto'>
          <div className='flex items-center justify-between w-full lg:h-20 lg:gap-15 h-12 '>

            {/* Logo & Menu */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center'>
                {
                  window.history.state && window.history.state.idx > 0 &&
                  <IoIosArrowBack size={24} className={` ${location.pathname == '/' && "hidden"}`} onClick={() => goBack()}/>
                }
                <Menu/>
              </div>
              <button className='cursor-pointer  font-semibold lg:text-3xl text-lg' onClick={() => navigate('/')}>EGEEX</button>
            </div>

            <div className='flex-1 hidden sm:inline'>
              {showSearch &&
                <SearchBar styles='w-full'/>
              }
            </div>

            <div className='flex gap-5'>

              {/* Language & currency */}
              <DropdownMenu>
                <DropdownMenuTrigger className='hidden sm:block'>
                  <div className='flex items-center gap-2 cursor-pointer'>
                    {/* flag */}
                    <div>
                      <Flag code={userCountry.code} className='w-7 h-7' />
                    </div>
                    <div className='text-xs'>
                      <p className='text-muted-foreground'>{userLanguage}/</p>
                      <p className=''>{userCurrency}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-70 bg-background px-5 py-3 space-y-3'>
                  {/*  Location */}
                  <div>
                    <h1 className='text-xl font-bold'>Ship to</h1>
                    {/* <LocationDialog userProfile ={userProfile}/> */}
                    
                  </div>
                  
                  {/* Currency */}
                  <div className='space-y-1'>
                    <h1 className='text-xl  font-bold'>Currency</h1>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant={'outline'} role='combobox' aria-expanded={open} className='w-full border-1 flex justify-between items-center p-2'>
                            <div className='flex gap-2 items-center'>
                              <Flag code={userCountry.code} className='w-7 h-7'/>
                              <p>{userCountry.name}</p>
                            </div>
                          {/* <ChevronsUpDown className="opacity-50" /> */}
                          <FaAngleRight className='opacity-50'/>
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
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* <div className='sm:hidden'>
                <IoSearchOutline className='text-primary text-2xl'/>
              </div> */}

              {/* Sign */}
              <div className='flex gap-1 items-center '>
                <Sign/>
              </div>

              {/* Cart */}
              <div className='flex gap-1 items-center cursor-pointer' onClick={() => navigate('/cart')}>
                <LuShoppingCart  className='text-2xl lg:text-3xl'/>
                <div className='flex-col  justify-center items-center hidden md:flex'>
                  <div className='w-10 h-3 bg-secondary flex items-center justify-center p-2 rounded-md'>
                    <p className='text-sm font-bold text-secondary-foreground'>{cartLength}</p>
                  </div>
                  <button className='text-sm font-semibold '>Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Separator className='w-full'/> */}
        <div className={`hidden sm:block ${(location.pathname != '/') && "sm:hidden"}`}>
          <TopicBar/>
        </div>

        {/* Mobile stuff */}
        <div className='sm:hidden '>
          {/* Mobile Search */}
          <div className='mx-10 my-2'>
            {showSearch &&
            <SearchBar styles=''/>
            }
          </div>

          {/* Mobile Tabs */}
          <div className='my-2 hidden'>
            <MobileTopicBar/>
          </div>
        </div>
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
