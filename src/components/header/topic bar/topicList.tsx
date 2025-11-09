import * as React from 'react';
import Link from "next/link";
import { useState } from "react";
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
  return (
          <div className="">
            {topics.map((topic) => (
              <Link href={topic}>
                <button
                  key={topic}
                  className={`h-9 ${
                    topic == activeTab
                      ? "text-primary-foreground bg-primary"
                      : "text-heading bg-background-secondary-3 hover:bg-secondary/10"
                  } cursor-pointer px-4 gap-1 flex items-center justify-center rounded-xl `}
                  onClick={() => setActiveTab(topic)}
                >
                  <p className="">{topic}</p>
                </button>
              </Link>
            ))}
          </div>
  );
};

export default TopicList;
