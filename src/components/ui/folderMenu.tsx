import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IFolderMenuProps {
}

const FolderMenu: React.FunctionComponent<IFolderMenuProps> = (props) => {
    const topics = [
  {
    name: "Crops",
    subTopics: [
      {
        name: "Vegetables",
        products: [
          { name: "Spinach", image: "https://img.icons8.com/plasticine/100/spinach.png" },
          { name: "Carrot", image: "https://img.icons8.com/plasticine/100/carrot.png" },
          { name: "Broccoli", image: "https://img.icons8.com/plasticine/100/broccoli.png" },
          { name: "Peas", image: "https://img.icons8.com/plasticine/100/peas.png" },
        ],
      },
      {
        name: "Fruits",
        products: [
          { name: "Orange", image: "https://img.icons8.com/plasticine/100/orange.png" },
          { name: "Strawberry", image: "https://img.icons8.com/plasticine/100/strawberry.png" },
          { name: "Pineapple", image: "https://img.icons8.com/plasticine/100/pineapple.png" },
          { name: "Peach", image: "https://img.icons8.com/plasticine/100/peach.png" },
        ],
      },
    ],
  },
  {
    name: "Clothes",
    subTopics: [
      {
        name: "Kids",
        products: [
          { name: "T-Shirt", image: "https://img.icons8.com/plasticine/100/t-shirt.png" },
          { name: "Shorts", image: "https://img.icons8.com/plasticine/100/shorts.png" },
        ],
      },
      {
        name: "Adults",
        products: [
          { name: "Jeans", image: "https://img.icons8.com/plasticine/100/jeans.png" },
          { name: "Hoodie", image: "https://img.icons8.com/plasticine/100/hoodie.png" },
        ],
      },
      {
        name: "Women",
        products: [
          { name: "Dress", image: "https://img.icons8.com/plasticine/100/dress.png" },
          { name: "Skirt", image: "https://img.icons8.com/plasticine/100/skirt.png" },
        ],
      },
    ],
  },
  {
    name: "Furniture",
    subTopics: [
      {
        name: "Living Room",
        products: [
          { name: "Sofa", image: "https://img.icons8.com/plasticine/100/sofa.png" },
          { name: "Coffee Table", image: "https://img.icons8.com/plasticine/100/table.png" },
        ],
      },
      {
        name: "Bedroom",
        products: [
          { name: "Bed", image: "https://img.icons8.com/plasticine/100/bed.png" },
          { name: "Wardrobe", image: "https://img.icons8.com/plasticine/100/wardrobe.png" },
        ],
      },
      {
        name: "Office",
        products: [
          { name: "Desk", image: "https://img.icons8.com/plasticine/100/desk.png" },
          { name: "Chair", image: "https://img.icons8.com/plasticine/100/office-chair.png" },
        ],
      },
    ],
  },
];
  return (
    <section className='flex flex-col w-full gap-10'>
        <div>
            <h1 className='font-semibold text-4xl  text-center'>Products</h1>
        </div>
        <Tabs defaultValue={topics[0].subTopics[0].name}>
            <div className="flex gap-10 ">
                {/* Left side Bar Accordion (Tabs)*/}
                <div className='pr-5  border-r-1' >
                    <TabsList className="inline-flex bg-transparent shadow-none w-auto h-auto">
                        <div className='flex flex-col gap-1 '>
                            <Accordion type="single" collapsible defaultValue='0'>
                                {topics.map((topic,i) => (
                                    <AccordionItem value={`${i}`} className='w-30'>
                                        <AccordionTrigger className='font-semibold text-[#222222]'>{topic.name}</AccordionTrigger>
                                        <AccordionContent className='truncate'>
                                            <ul className='text-left '>
                                                {topic.subTopics.map((subTopic) => (
                                                    <li>
                                                        <TabsTrigger
                                                        key={subTopic.name}
                                                        value={subTopic.name}
                                                        className="  flex justify-start text-muted
                                                                    data-[state=active]:underline
                                                                    data-[state=active]:shadow-none
                                                                    data-[state=active]:text-primary
                                                                    decoration-1 hover:shadow-none"
                                                        >
                                                            {subTopic.name}
                                                        </TabsTrigger>
                                                    </li>
                                                ))}
                                            </ul>
                                            </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </TabsList>
                </div>

                {/* Tabs Content */}
                <div className=" w-full ">
                    {topics.map((topic,i) => (
                        <div>
                            {topic.subTopics.map((subTopic) => (
                                <TabsContent key={subTopic.name} value={subTopic.name} className=''>
                                    <ScrollArea className=''>
                                        <div className=' w-full grid gap-5 grid-cols-16 '>
                                            {subTopic.products.map((product) => (
                                                <div className='col-span-2  hover:scale-105 transition-all cursor-pointer justify-center items-center'>
                                                        <img loading="lazy" 
                                                            src={product.image} alt=""
                                                            className=""
                                                        />
                                                    <p className=''>{product.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    {/* {topic.name} */}
                                </TabsContent>

                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Tabs>

    </section>
  );
};

export default FolderMenu;
