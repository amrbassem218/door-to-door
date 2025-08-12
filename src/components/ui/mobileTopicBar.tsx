import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { crossDependencies } from 'mathjs';
interface MobileTopicBarProps {
}

const MobileTopicBar: React.FunctionComponent<MobileTopicBarProps> = (props) => {
  const [activeTab, setActiveTab] = useState(5);
  const tabs = ["Crops", "Furniture", "Clothes"];
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setActiveTab(5);
    tabs.forEach((tab, i) => {
      if(location.pathname == `/category/${tab.toLowerCase()}`){
        setActiveTab(i);
      }
    })
  }, [location])
  const handleTabClick = (i: number) => { 
    setActiveTab(i);
    navigate(`/category/${tabs[i].toLowerCase()}`)
  }
  return (
    <div className='flex justify-around text-lg '>
      {tabs.map((tab, i) => (
        <button className={`${activeTab == i ? "font-bold underline underline-offset-3" : ""} text-heading`} onClick={() => handleTabClick(i)}>{tab}</button>
      ))}
    </div>
  );
};

export default MobileTopicBar;
