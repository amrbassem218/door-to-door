"use client";
import { useRouter } from "next/router";
import * as React from "react";

import { IoIosArrowBack } from "react-icons/io";
interface IGoBackButtonProps {}

const GoBackButton: React.FunctionComponent<IGoBackButtonProps> = (props) => {
  const router = useRouter();
  return (
    <div>
      {window.history.state && window.history.state.idx > 0 && (
        <IoIosArrowBack
          size={24}
          className={` ${location.pathname == "/" && "hidden"}`}
          onClick={() => router.back()}
        />
      )}
    </div>
  );
};

export default GoBackButton;
