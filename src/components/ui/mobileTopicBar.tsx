"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavigationButton from "../navigationButton";
interface MobileTopicBarProps {}

const MobileTopicBar: React.FunctionComponent<MobileTopicBarProps> = (
  props
) => {
  const [activeTab, setActiveTab] = useState(5);
  const tabs = ["Crops", "Furniture", "Clothes"];

  const location = useLocation();
  useEffect(() => {
    setActiveTab(5);
    tabs.forEach((tab, i) => {
      if (location.pathname == `/category/${tab.toLowerCase()}`) {
        setActiveTab(i);
      }
    });
  }, [location]);
  return (
    <div className="flex justify-around text-lg ">
      {tabs.map((tab, i) => (
        <NavigationButton
          key={tab}
          href={`/category/${tabs[i].toLowerCase()}`}
          className={`${
            activeTab == i ? "font-bold underline underline-offset-3" : ""
          } text-heading`}
          onClick={() => setActiveTab(i)}
        >
          {tab}
        </NavigationButton>
      ))}
    </div>
  );
};

export default MobileTopicBar;
