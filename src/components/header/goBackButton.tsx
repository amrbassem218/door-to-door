"use client";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
interface IGoBackButtonProps {}

const GoBackButton: React.FunctionComponent<IGoBackButtonProps> = (props) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    setIsMounted(true);
  }, []) 
  if(!isMounted) return null;
  return (
    <div>
      {window.history.state && window.history.state.idx > 0 && (
        <IoIosArrowBack
          size={24}
          className={` ${pathName == "/" && "hidden"}`}
          onClick={() => router.back()}
        />
      )}
    </div>
  );
};

export default GoBackButton;