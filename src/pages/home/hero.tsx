import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { useState,useEffect,useRef } from 'react';
import { Input } from '@/components/ui/input';
import SearchBar from '@/components/ui/searchBar';
import { useNavigate } from 'react-router-dom';
interface IHeroProps {
}

const Hero: React.FunctionComponent<IHeroProps> = (props) => {
    const suggestedKeywords = [
        "tomatoes",
        "olives",
        "medjool dates",
        "onion"
    ]
    const navigate = useNavigate();
  return (
    <div className=''>
    <div className="relative h-150 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/public/door2door_vid.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient overlay - darker at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/0 to-transparent"></div>
      
      <div className="relative z-10 flex items-center justify-center h-150 mx-20">
        <div className='absolute left-0 bottom-35 w-150'>
            <h1 className="text-5xl font-bold mb-4 text-white ">From Egyptian Fields to the World's Markets</h1>
            {/* <Input className='w-full max-w-150 h-10 bg-white'/> */}
            <div className='space-y-3'>
                <SearchBar styles='w-full h-12'/>
                <div className='flex gap-2'>
                    {suggestedKeywords.map((word) => (
                        <div className='p-3 h-5 border-1 border-white flex items-center justify-center rounded-md text-white hover:bg-white hover:text-black cursor-pointer transition-all' onClick={() => navigate(`/search/${word}`)}>
                            <p className=''>{word}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Hero;
