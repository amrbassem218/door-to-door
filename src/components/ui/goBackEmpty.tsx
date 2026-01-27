"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "./button";

interface IGoBackProps {}

const GoBackCart: React.FunctionComponent<IGoBackProps> = (props) => {
  const router = useRouter();
  return (
    <Button variant="outline" onClick={() => router.back()}>
      Go Back
    </Button>
  );
};

export default GoBackCart;
