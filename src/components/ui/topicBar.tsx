import * as React from 'react';
import { FaAngleDown } from "react-icons/fa";
import { useState } from 'react';
import { Button } from './button';
interface ITopicBarProps {
}

const TopicBar: React.FunctionComponent<ITopicBarProps> = (props) => {
    const topics = ['Groceries', 'Premium Fruits', 'Vegetables', "Essentials", "Cosmetics", 'Vegetables2', "Essentials2", "Cosmetics2"]
    const [activeTab, setActiveTab] = useState("");
    const handleTopicClick = (topic: string) => {
        setActiveTab(topic);
    }
  return (
    <div className='h-15 border-b-1 flex gap-2 items-center px-20'>
        {topics.map((topic) => (
            <button className={`h-9 ${topic == activeTab ? "text-white bg-primary" : "text-heading bg-background-secondary-3"} cursor-pointer px-4 gap-1 flex items-center justify-center rounded-xl`} onClick={() => handleTopicClick(topic)}>
                <p className=''>
                    {topic}
                </p>
                <FaAngleDown size={15} className='mt-1'/>
            </button>
        ))}
    </div>
  );
};

export default TopicBar;
