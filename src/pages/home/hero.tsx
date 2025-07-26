import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';

interface IHeroProps {
}

const Hero: React.FunctionComponent<IHeroProps> = (props) => {
  return (
    <div className='space-y-10'>
    {/* Carousel */}
    <section className='pt-5 w-full mx-auto'>
        <Carousel className="relative">
            <CarouselContent className=''>
                {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                    <div className="p-1">
                        <Card className=''>
                            <CardContent className="h-50 flex items-center justify-center p-6">
                                <span className="text-4xl font-semibold">{index + 1}</span>
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className='absolute left-[-1.5rem] w-15 h-15 bg-background-secondary-3 text-primary'/>
            <CarouselNext className='absolute right-[-1.5rem] w-15 h-15 bg-background-secondary-3 text-primary'/>
        </Carousel>
    </section>
    
    </div>
  );
};

export default Hero;
