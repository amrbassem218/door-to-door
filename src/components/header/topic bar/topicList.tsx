'use client'
import * as React from 'react';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
interface ITopicListProps {
}

const TopicList: React.FunctionComponent<ITopicListProps> = (props) => {
  const topics = [
    "Men Clothes",
    "Crops",
    "Carpets",
    "Office Chairs",
    "Pottery bottles",
    "Jewelry & Accessories",
  ];
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const handleTopicClick = (topic: string) => {
    setActiveTab(topic);
    router.push(`/search?query=${topic}`)
  }
  return (
          <div className="">
            {topics.map((topic) => (
                <button
                  key={topic}
                  className={`h-9 ${
                    topic == activeTab
                      ? "text-primary-foreground bg-primary"
                      : "text-heading bg-background-secondary-3 hover:bg-secondary/10"
                  } cursor-pointer px-4 gap-1 flex items-center justify-center rounded-xl `}
                  onClick={() => handleTopicClick(topic)}
                >
                  <p className="">{topic}</p>
                </button>
            ))}
          </div>
  );
};

export default TopicList;
