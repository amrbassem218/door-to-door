"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CartItem, Product } from "@/types/types";
import {
  measurements,
  newPrice,
  unitChange,
  updateMes,
  updateQty,
} from "@/utilities";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

import { useUserCurrencyCode } from "@/contexts/currencyContext";
import { useCurrencyRates } from "@/getRates";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { addProductToCart, getCart } from "@/utils/cart-utils";
import { useUser } from "@/utils/getUser";
import { useRouter } from "next/navigation";
import { FiMinus, FiPlus } from "react-icons/fi";
import NavigationButton from "../navigationButton";

interface ICardSheetProps {
  product: Product;
  quantity: number;
  styles?: string;
}

const CartSheet: React.FunctionComponent<ICardSheetProps> = (props) => {
  const { user } = useUser();
  const { executeWithAuth } = useRequireAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>();
  const [headerOffset, setHeaderOffset] = useState(0);
  const [cartQuantity, setCartQuantity] = useState<Record<number, number>>({});
  const [cartMeasurement, setCartMeasurement] = useState<
    Record<number, string>
  >({});
  const { rates, loading } = useCurrencyRates();
  const userCurrencyCode = useUserCurrencyCode();
  const id = (product: Product) => {
    return Number(product.id);
  };
  useEffect(() => {
    if (cart) {
      cart.forEach(({ products: product }) => {
        const pid = product.id;
        setCartMeasurement({
          ...cartMeasurement,
          [pid]:
            localStorage.getItem(`${product.id}_measurement`) ??
            measurements[0],
        });
        console.log("ma ho by7sl");
        if (localStorage.getItem(`${product?.id}_quantity`)) {
          setCartQuantity({
            ...cartQuantity,
            [pid]:
              Number(localStorage.getItem(`${product?.id}_quantity`)) ??
              product?.minOrder ??
              1,
          });
        }
      });
    }
  }, [cart]);
  const handleAddToCart = executeWithAuth(async () => {
    if (!user) return; // Type guard - user is guaranteed to exist by executeWithAuth

    const status = await addProductToCart(user, props.product, props.quantity);
    const data = await getCart(user);
    if (data) {
      const currentCartQuantity = cartQuantity;
      const currentCartMeasurement = cartMeasurement;
      data.forEach(({ products: product, quantity, measurement }) => {
        currentCartQuantity[id(product)] = quantity;
        currentCartMeasurement[id(product)] = measurement;
      });
      setCartQuantity(currentCartQuantity);
      setCartMeasurement(currentCartMeasurement);
      setCart(data);
    }
  });

  const handleMeasurementChange = (product: Product, mes: string) => {
    const pid = id(product);
    const convertedMeasurement = Number(
      unitChange(cartQuantity[pid], cartMeasurement[pid], mes)
    );
    setCartQuantity({ ...cartQuantity, [pid]: convertedMeasurement });
    setCartMeasurement({ ...cartMeasurement, [pid]: mes });
    localStorage.setItem(`${product.id}_measurement`, mes);
    updateMes(product, mes);
    localStorage.setItem(
      `${product.id}_quantity`,
      convertedMeasurement.toString()
    );
    updateQty(product, convertedMeasurement);
  };

  const handleQuantityChange = (
    product: Product,
    type: string,
    val?: string
  ) => {
    if (product) {
      let qnt = cartQuantity[id(product)];
      if (type == "plus") {
        setCartQuantity({
          ...cartQuantity,
          [product.id]: cartQuantity && qnt + 1,
        });
        qnt++;
      } else if (type == "minus") {
        setCartQuantity({
          ...cartQuantity,
          [product.id]: cartQuantity && qnt - 1,
        });
        qnt--;
      } else {
        setCartQuantity({ ...cartQuantity, [id(product)]: Number(type) });
        qnt = Number(type);
      }
      localStorage.setItem(`${product.id}_quantity`, qnt.toString());
      updateQty(product, qnt);
    }
  };
  const handleOpenChange = (open: boolean) => {
    if (!open) return;
    // Keep the sheet below the sticky site header.
    const header = document.getElementById("site-header");
    setHeaderOffset(header ? Math.max(0, header.getBoundingClientRect().bottom) : 0);
  };
  // if(!cartQuantity || !cartMeasurement){
  //   return <div>loading...</div>
  // }
  if (loading) return <p>loading...</p>;

  const lineTotal = (product: Product) =>
    Number(
      newPrice(
        product,
        userCurrencyCode,
        rates,
        cartQuantity[id(product)],
        cartMeasurement[id(product)]
      )
    ) || 0;
  const subtotal = (cart ?? []).reduce((sum, { products }) => sum + lineTotal(products), 0);

  return (
    <div>
      <Sheet onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            className={`sm:flex-1 max-w-40 ${props.styles}`}
            onClick={() => handleAddToCart()}
          >
            Add to Cart
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-[22rem] max-w-[92vw] gap-0 p-0"
          style={{
            top: headerOffset,
            height: `calc(100vh - ${headerOffset}px)`,
          }}
        >
          {/* Header */}
          <SheetHeader className="border-b px-4 py-3 pr-12">
            <SheetTitle className="text-base">
              Cart{cart?.length ? ` (${cart.length})` : ""}
            </SheetTitle>
          </SheetHeader>

          {/* Items */}
          <ScrollArea className="flex-1 min-h-0">
            <ul className="divide-y">
              {cart?.map(({ products: product }, index) => (
                <li
                  key={product.id || index}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-background-muted cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <img
                    loading="lazy"
                    src={product.thumbnail}
                    alt=""
                    className="size-14 shrink-0 rounded-md object-cover bg-background-muted"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div
                      className="mt-1 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="size-5 rounded border flex items-center justify-center hover:bg-background-muted"
                          onClick={() => handleQuantityChange(product, "minus")}
                        >
                          <FiMinus size={10} />
                        </button>
                        <span className="min-w-6 text-center text-foreground font-medium">
                          {cartQuantity[id(product)] ?? 1}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="size-5 rounded border flex items-center justify-center hover:bg-background-muted"
                          onClick={() => handleQuantityChange(product, "plus")}
                        >
                          <FiPlus size={10} />
                        </button>
                        <span className="ml-1">{cartMeasurement[id(product)]}</span>
                      </div>
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {userCurrencyCode} {lineTotal(product)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              {!cart?.length && (
                <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Your cart is empty
                </li>
              )}
            </ul>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t px-4 py-3 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">
                {userCurrencyCode} {Math.round(subtotal * 100) / 100}
              </span>
            </div>
            <NavigationButton
              href={"/cart"}
              shadcn={true}
              className="w-full h-9"
            >
              Go to Cart
            </NavigationButton>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartSheet;
