import * as React from "react";
import CategoriesListTopicBar from "./categoriesList";
interface ITopicBarProps {}

const TopicBar: React.FunctionComponent<ITopicBarProps> = (props) => {
  const popularCategories = [
    "Men Clothes",
    "Crops",
    "Carpets",
    "Office Chairs",
    "Pottery bottles",
    "Jewelry & Accessories",
  ];
  return (
    <div className="h-15 flex gap-5 items-center px-20 mb-1">
      <CategoriesListTopicBar/>      
      <div className="flex gap-5 items-center">
        {popularCategories.map((cat) => (
          <button
            key={cat}
            className=" flex items-center justify-center p-2 rounded-sm hover:text-primary-foreground/90"
          >
            <p>{cat}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicBar;
