import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    const topics = [
  {
    name: "Vegetables",
    subTopics: [
      { name: "Leafy Greens", image: "https://img.icons8.com/plasticine/100/spinach.png" },
      { name: "Root Vegetables", image: "https://img.icons8.com/plasticine/100/carrot.png" },
      { name: "Cruciferous", image: "https://img.icons8.com/plasticine/100/broccoli.png" },
      { name: "Legumes", image: "https://img.icons8.com/plasticine/100/peas.png" },
      { name: "Leafy Greens", image: "https://img.icons8.com/plasticine/100/spinach.png" },
      { name: "Root Vegetables", image: "https://img.icons8.com/plasticine/100/carrot.png" },
      { name: "Cruciferous", image: "https://img.icons8.com/plasticine/100/broccoli.png" },
      { name: "Legumes", image: "https://img.icons8.com/plasticine/100/peas.png" },
      { name: "Leafy Greens", image: "https://img.icons8.com/plasticine/100/spinach.png" },
      { name: "Root Vegetables", image: "https://img.icons8.com/plasticine/100/carrot.png" },
      { name: "Cruciferous", image: "https://img.icons8.com/plasticine/100/broccoli.png" },
      { name: "Legumes", image: "https://img.icons8.com/plasticine/100/peas.png" },
      { name: "Leafy Greens", image: "https://img.icons8.com/plasticine/100/spinach.png" },
      { name: "Root Vegetables", image: "https://img.icons8.com/plasticine/100/carrot.png" },
      { name: "Cruciferous", image: "https://img.icons8.com/plasticine/100/broccoli.png" },
      { name: "Legumes", image: "https://img.icons8.com/plasticine/100/peas.png" },
      { name: "Leafy Greens", image: "https://img.icons8.com/plasticine/100/spinach.png" },
      { name: "Root Vegetables", image: "https://img.icons8.com/plasticine/100/carrot.png" },
      { name: "Cruciferous", image: "https://img.icons8.com/plasticine/100/broccoli.png" },
      { name: "Legumes", image: "https://img.icons8.com/plasticine/100/peas.png" },
    ],
  },
  {
    name: "Fruits",
    subTopics: [
      { name: "Citrus", image: "https://img.icons8.com/plasticine/100/orange.png" },
      { name: "Berries", image: "https://img.icons8.com/plasticine/100/strawberry.png" },
      { name: "Tropical Fruits", image: "https://img.icons8.com/plasticine/100/pineapple.png" },
      { name: "Stone Fruits", image: "https://img.icons8.com/plasticine/100/peach.png" },
    ],
  },
  {
    name: "Cosmetics",
    subTopics: [
      { name: "Skincare", image: "https://img.icons8.com/plasticine/100/face-mask.png" },
      { name: "Makeup", image: "https://img.icons8.com/plasticine/100/lipstick.png" },
      { name: "Haircare", image: "https://img.icons8.com/plasticine/100/hair-brush.png" },
      { name: "Fragrances", image: "https://img.icons8.com/plasticine/100/perfume.png" },
    ],
  },
  {
    name: "Vegetables2",
    subTopics: [
      { name: "Gourds", image: "https://img.icons8.com/plasticine/100/pumpkin.png" },
      { name: "Alliums", image: "https://img.icons8.com/plasticine/100/garlic.png" },
      { name: "Stems", image: "https://img.icons8.com/plasticine/100/celery.png" },
      { name: "Pods", image: "https://img.icons8.com/plasticine/100/green-beans.png" },
    ],
  },
  {
    name: "Fruits2",
    subTopics: [
      { name: "Pomes", image: "https://img.icons8.com/plasticine/100/apple.png" },
      { name: "Melons", image: "https://img.icons8.com/plasticine/100/watermelon.png" },
      { name: "Drupes", image: "https://img.icons8.com/plasticine/100/cherry.png" },
      { name: "Multiple Fruits", image: "https://img.icons8.com/plasticine/100/fig.png" },
    ],
  },
  {
    name: "Cosmetics2",
    subTopics: [
      { name: "Cleansers", image: "https://img.icons8.com/plasticine/100/soap.png" },
      { name: "Moisturizers", image: "https://img.icons8.com/plasticine/100/cream.png" },
      { name: "Serums", image: "https://img.icons8.com/plasticine/100/test-tube.png" },
      { name: "Lipsticks", image: "https://img.icons8.com/plasticine/100/lipstick.png" },
    ],
  },
];


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
    <div className='w-full '>
        {/* The topic tabs section */}
        <section className='flex flex-col '>
            <Tabs defaultValue={topics[0].name}>
                <div className="flex gap-10">
                    <div className='h-70 pr-5 border-r-1 border-gray-200' >
                        <TabsList className="bg-transparent  shadow-none">
                            <div className='flex flex-col gap-1'>
                                {topics.map((topic) => (
                                    <TabsTrigger
                                    key={topic.name}
                                    value={topic.name}
                                    className="  flex justify-start
                                                data-[state=active]:underline
                                                data-[state=active]:shadow-none
                                                data-[state=active]:text-primary
                                                decoration-1 hover:shadow-none"
                                    >
                                    <p className='text-base'>{topic.name}</p>
                                    </TabsTrigger>
                                ))}
                            </div>
                        </TabsList>
                    </div>
                    <div className=" w-full">
                        {topics.map((topic,i) => (
                            <TabsContent key={topic.name} value={topic.name} className=''>
                                <ScrollArea className='h-70'>
                                    <div className=' w-full grid gap-5 grid-cols-16 '>
                                        {topics[i].subTopics.map((subTopic) => (
                                            <div className='col-span-2  hover:scale-105 transition-all cursor-pointer justify-center items-center'>
                                                    <img 
                                                        src={subTopic.image} alt=""
                                                        className=""
                                                    />
                                                <p className=''>{subTopic.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                {/* {topic.name} */}
                            </TabsContent>
                        ))}
                    </div>
                </div>
            </Tabs>

        </section>
    </div>
    </div>
  );
};

export default Hero;
