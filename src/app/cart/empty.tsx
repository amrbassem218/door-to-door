import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import GoBackCart from "@/components/ui/goBackEmpty";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { LuShoppingCart } from "react-icons/lu";
interface IEmptyCartProps {}

const EmptyCart: React.FunctionComponent<IEmptyCartProps> = (props) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LuShoppingCart />
        </EmptyMedia>
        <EmptyTitle>Your cart is empty</EmptyTitle>
        <EmptyDescription>
          Shop now and add items in cart for the future
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>
          <Link href={"/"}>Home</Link>
        </Button>
        <GoBackCart />
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowRightIcon />
        </a>
      </Button>
    </Empty>
  );
};

export default EmptyCart;
