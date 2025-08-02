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
    const images = [
        'rec.png',
        'rec2.png'
    ]
  return (
    <div className=''>
    {/* Carousel */}
    <section className='pt-5 w-full mx-auto'>
        <Carousel className="relative">
            <CarouselContent className=''>
                {images.map((img, index) => (
                <CarouselItem key={index}>
                    <div className="">
                        <Card className='p-0 m-0'>
                            <CardContent className="w-full flex items-center justify-center p-0 m-0">
                                <img src={img} alt="" className='w-full'/>
                                {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
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
    
    {/* <section className='w-screen h-70 bg-primary/70'>
        <div>
            <h2>Sale Ends: Aug 31st, 05:59 (GMT+3)</h2>
            <div>

            </div>
        </div>
    </section> */}
    </div>
  );
};

export default Hero;
