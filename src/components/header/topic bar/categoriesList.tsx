'use client'
import * as React from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";
interface ICategoriesListTopicBarProps {}

const CategoriesListTopicBar: React.FunctionComponent<
  ICategoriesListTopicBarProps
> = (props) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  return (
    <HoverCard
      openDelay={0}
      closeDelay={0}
      open={categoriesOpen}
      onOpenChange={setCategoriesOpen}
    >
      <HoverCardTrigger className="w-50 h-10  bg-secondary text-secondary-foreground flex justify-between items-center px-2 rounded-sm">
        <div className="flex items-center gap-1">
          <IoIosMenu className="text-lg " />
          <p>All Categories</p>
        </div>
        {categoriesOpen ? <FaAngleUp /> : <FaAngleDown />}
      </HoverCardTrigger>
      <HoverCardContent className="w-full"></HoverCardContent>
    </HoverCard>
  );
};

export default CategoriesListTopicBar;
