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

interface IHeaderProps {
  
}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const handleFilter = () => {
    console.log("filtered");
  }
  const navigate = useNavigate();
  const search = useSearch();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if(query && search){
      search.searchProducts(query).then(results => {
        setSuggestions(results);
      });
    } else {
      setSuggestions([]);
    }
  }, [query, search])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (suggestionQuery?: string) => {
    navigate(`/search/${suggestionQuery ? suggestionQuery : query}`)
  }
  return (
    <div className='relative'>
      <TopBar/>
      <div className='grid-cols-12 border-border w-full '>
        <div className='max-w-400  px-20  mx-auto'>
          <div className='flex items-center justify-between w-full h-20'>
            <div className='flex items-center gap-2 '>
              <Button className='cursor-pointer bg-background-secondary-3 p-2 rounded-md' variant={'link'}>
                <RiMenu2Fill size={20} className='text-primary'/>
              </Button>
              <button className='cursor-pointer text-primary font-semibold' onClick={() => navigate('/')}>LOGO NAME</button>
            </div>
            <div ref={searchRef} className=' justify-center relative h-10 bg-background-secondary-3 w-120 flex items-center gap-1 rounded-md'>
              <IoSearchOutline className='text-primary absolute left-2' size={18}/>
              <form className='w-full' action="" onSubmit={(e) => {e.preventDefault(); handleSearchSubmit()}}>
                <Input 
                  type="text" 
                  placeholder='Search Essentials, crops and more...' 
                  className='w-full border-0 px-8' 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
              <Button className='cursor-pointer absolute right-0' variant={'link'} onClick={() => handleFilter()}>
                <IoFilter className='text-primary'/>
              </Button>
              {/* Suggestions dropdown */}
              {suggestions.length > 0 && query && (
                <div className='absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto'>
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={suggestion.id || index} 
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0'
                      onClick={() => {
                        // setQuery();
                        handleSearchSubmit(suggestion.title);
                        setSuggestions([]);
                      }}
                    >
                      <div>
                        <div className='font-medium'>{suggestion.title}</div>
                        {suggestion.tags && (
                          <div className='text-sm text-gray-500'>
                            {Array.isArray(suggestion.tags) ? suggestion.tags.join(', ') : suggestion.tags}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='flex gap-3'>
              <div className='flex gap-1 items-center pr-5 border-r-1'>
                <LuUser className='text-primary' size={20}/>
                <button className='font-medium text-text text-sm hover:text-primary hover:underline'>Sign Up/Sign In</button>
              </div>
              <div className='flex gap-1 items-center'>
                <IoCartOutline className='text-primary' size={20}/>
                <button className='text-text font-medium hover:text-primary hover:underline'>Cart</button>
              </div>
            </div>
          </div>
          <div className='absolute left-0 w-screen border-b-1'></div>
          <TopicBar/>
          <div className='absolute left-0 w-screen border-b-1'></div>
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
