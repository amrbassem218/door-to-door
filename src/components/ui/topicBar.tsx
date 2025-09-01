import * as React from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useState } from 'react';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { IoIosMenu } from 'react-icons/io';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Navigate, useNavigate } from 'react-router-dom';
interface ITopicBarProps {
}

const TopicBar: React.FunctionComponent<ITopicBarProps> = (props) => {
    const topics = [
    "Men Clothes",
    "Crops",
    "Carpets",
    "Office Chairs",
    "Pottery bottles",
    "Jewelry & Accessories"
    ];
    const [activeTab, setActiveTab] = useState("");
    const navigate = useNavigate();
    const handleTopicClick = (topic: string) => {
        setActiveTab(topic);
        navigate('/categories');
    }
    const popularCategories = [
    "Men Clothes",
    "Crops",
    "Carpets",
    "Office Chairs",
    "Pottery bottles",
    "Jewelry & Accessories"
    ];
    const [categoriesOpen, setCategoriesOpen] = useState(false);
  return (
    <div className='h-15 flex gap-5 items-center px-20 mb-1'>
        <HoverCard openDelay={0} closeDelay={0} open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <HoverCardTrigger className='w-50 h-10  bg-secondary text-secondary-foreground flex justify-between items-center px-2 rounded-sm'>
                <div className='flex items-center gap-1'>
                    <IoIosMenu className='text-lg '/>
                    <p>All Categories</p>
                </div>
                {
                    categoriesOpen
                    ? <FaAngleUp/>
                    : <FaAngleDown/>
                }
            </HoverCardTrigger>
            <HoverCardContent className='w-full'>
                <div className=''>
                    {topics.map((topic) => (
                        <button className={`h-9 ${topic == activeTab ? "text-primary-foreground bg-primary" : "text-heading bg-background-secondary-3 hover:bg-secondary/10"} cursor-pointer px-4 gap-1 flex items-center justify-center rounded-xl `} onClick={() => handleTopicClick(topic)}>
                            <p className=''>
                                {topic}
                            </p>
                        </button>
                    ))}
                </div>
            </HoverCardContent>
        </HoverCard>
        <div className='flex gap-5 items-center'>
            {popularCategories.map((cat) => (
                <button className=' flex items-center justify-center p-2 rounded-sm'>
                    <p>{cat}</p>
                </button>
            ))}
        </div>
    </div>
  );
};

export default TopicBar;
