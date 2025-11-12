"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "./ui/button";

interface INavigationButtonProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  shadcn?: boolean;
  [key: string]: any;
}

const NavigationButton: React.FunctionComponent<INavigationButtonProps> = ({
  href,
  children,
  onClick,
  shadcn,
  className,
  ...props
}) => {
  const router = useRouter();
  const handleButtonClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
    router.push(`${href}`);
  };
  return (
    <div>
      {shadcn ? (
        <Button
          onClick={() => handleButtonClick()}
          className={className}
          {...props}
        >
          {children}
        </Button>
      ) : (
        <button
          onClick={() => handleButtonClick()}
          className={className}
          {...props}
        >
          {children}
        </button>
      )}
    </div>
  );
};

export default NavigationButton;
