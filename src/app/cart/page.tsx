"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/supabase/supabaseClient";
import type { CartItem, Product } from "@/types/types";
import { newPrice, price, save, unitChange } from "@/utilities";
import * as React from "react";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

import { useUserCurrencyCode } from "@/contexts/currencyContext";
import { useCurrencyRates } from "@/getRates";
import { cleanupDuplicateCarts, getCart } from "@/utils/cart-utils";
import { useUser } from "@/utils/getUser";
import { useRouter } from "next/navigation";
import { startCheckout } from "@/utils/checkout";
import { toast } from "sonner";
import EmptyCart from "./empty";
interface ICartProps {}

const Cart: React.FunctionComponent<ICartProps> = (props) => {
  const { user, loading } = useUser();
  const [cart, setCart] = useState<Record<number, CartItem[]>>();
  const [cartItems, setCartItems] = useState<CartItem[]>();
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [cartQuantity, setCartQuantity] = useState<Record<number, number>>({});
  const [cartMeasurement, setCartMeasurement] = useState<
    Record<number, string>
  >({});
  const [isEmpty, setIsEmpty] = useState(false);
  const router = useRouter();

  const { rates, loading: ratesLoading } = useCurrencyRates();
  const userCurrencyCode = useUserCurrencyCode();
  const shippingCost =
    rates && userCurrencyCode && rates["usd"]
      ? (10 / rates["usd"]) * rates[userCurrencyCode.toLowerCase()]
      : 0;
  const id = (product: Product) => {
    return Number(product.id);
  };
  const paymentOptions = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT27mNiyLBx_WW5a1PY7y7b6rncoD2Ir4Y5A&s",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-U8tK4EfgFz0FAX0yYoXfE05yWfq2tqNLQw&s",
    "https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg",
  ];

  useEffect(() => {
    if (user && rates && userCurrencyCode) {
      const handleGetCartItems = async () => {
        try {
          // First clean up any duplicate carts
          await cleanupDuplicateCarts(user);

          // Then get cart items
          const data = await getCart(user);
          if (data) {
            let currentTotal = 0;
            let currentSubTotal = 0;
            const currentCartQuantity = { ...cartQuantity };
            const currentCartMeasurement = { ...cartMeasurement };
            const sellerSeperatedCart: Record<number, CartItem[]> = {};
            data.forEach((item) => {
              const { products: product, quantity, measurement } = item;
              currentCartQuantity[id(product)] =
                Number(localStorage.getItem(`${product?.id}_quantity`)) ??
                quantity;
              currentCartMeasurement[id(product)] =
                localStorage.getItem(`${product.id}_measurement`) ??
                measurement;

              currentTotal += price(
                product,
                userCurrencyCode,
                rates,
                currentCartQuantity[id(product)],
                currentCartMeasurement[id(product)],
              );
              currentSubTotal += newPrice(
                product,
                userCurrencyCode,
                rates,
                currentCartQuantity[id(product)],
                currentCartMeasurement[id(product)],
              );

              if (sellerSeperatedCart[Number(product.sellerId)]) {
                sellerSeperatedCart[Number(product.sellerId)].push(item);
              } else sellerSeperatedCart[Number(product.sellerId)] = [item];
            });
            setCartQuantity(currentCartQuantity);
            setCartMeasurement(currentCartMeasurement);
            setTotal(currentTotal);
            setSubtotal(currentSubTotal);
            setCart(sellerSeperatedCart);
            setCartItems(data);
            setIsEmpty(cartItems.length === 0);
          }
        } catch (error) {
          console.error("Error getting cart items:", error);
        }
      };
      handleGetCartItems();
    }
  }, [user, cartQuantity, cartMeasurement, rates, userCurrencyCode]);

  const handleMeasurementChange = (mes: string, product?: Product) => {
    if (product) {
      const pid = id(product);
      const convertedMeasurement = Number(
        unitChange(cartQuantity[pid], cartMeasurement[pid], mes),
      );
      setCartQuantity({ ...cartQuantity, [pid]: convertedMeasurement });
      setCartMeasurement({ ...cartMeasurement, [pid]: mes });
      localStorage.setItem(`${product.id}_measurement`, mes);
      localStorage.setItem(
        `${product.id}_quantity`,
        convertedMeasurement.toString(),
      );
    }
  };
  const handleDeleteItem = async (
    product: Product,
    sellerId: number,
    index: number,
  ) => {
    if (cart) {
      const newSellerList = cart[sellerId];
      newSellerList.splice(index, 1);
      setCart({ ...cart, [sellerId]: newSellerList });

      // Set cart items
      setCartItems((prev) => prev.filter((e) => e.products.id !== product.id));

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("product_id", product.id);
      if (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    if (cartItems) {
      setIsEmpty(cartItems.length === 0);
      console.log("cart Items: ", cartItems);
      console.log("is empty: ", cartItems.length === 0);
    }
  }, [cartItems]);
  const handleCheckout = () => {
    if (!user || !cartItems?.length) return;
    startCheckout(
      cartItems.map(({ products: product, quantity }) => ({
        productId: product.id,
        quantity: cartQuantity[id(product)] || quantity,
        measurement: cartMeasurement[id(product)] || "KG",
      })),
    ).catch((e) => {
      console.error(e);
      toast.error(
        `Couldn't start payment: ${e instanceof Error ? e.message : "unknown error"}`,
      );
    });
  };
  if (ratesLoading) return <p>Loading prices...</p>;
  if (isEmpty) {
    return <EmptyCart />;
  }
  return (
    <div>
      {cart && (
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 pb-12">
          {/* Cart Section */}
          <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start">
            <div className="w-full lg:col-span-8 space-y-3">
              {/* Cart Header */}
              <Card>
                <CardHeader className="">
                  <CardTitle>Cart ({cartItems?.length})</CardTitle>
                </CardHeader>
              </Card>

              {/* Cart */}
              <Card>
                <CardHeader className="">
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col divide-y px-0">
                  {Object.keys(cart).map((sellerId) => (
                    <div key={sellerId} className="flex flex-col divide-y cursor-pointer">
                      {cart[Number(sellerId)].map(
                        (
                          { products: product, quantity, measurement },
                          index,
                        ) => (
                          <div
                            key={index}
                            className="flex gap-4 w-full px-4 sm:px-6 py-4 transition-colors hover:bg-accent/40"
                            onClick={() =>
                              router.push(`/product/${product.id}`)
                            }
                          >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center rounded-md bg-muted/30 overflow-hidden">
                              <img
                                loading="lazy"
                                src={product.thumbnail}
                                alt=""
                                className="object-contain max-w-full max-h-full"
                              />
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex justify-between items-start w-full">
                                <div className="flex-1 min-w-0">
                                  <h1 className="line-clamp-3 text-sm">
                                    {product.name}
                                  </h1>
                                </div>
                                <div
                                  className="flex gap-2 items-center flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MdDeleteOutline
                                    size={18}
                                    className="hover:text-destructive transition-all cursor-pointer"
                                    onClick={() =>
                                      handleDeleteItem(
                                        product,
                                        Number(sellerId),
                                        index,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="mt-1">
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex flex-wrap gap-x-1 items-baseline">
                                    <span className="text-xs text-muted-foreground">
                                      {cartQuantity[id(product)] ?? quantity} x{" "}
                                      {newPrice(
                                        product,
                                        userCurrencyCode,
                                        rates,
                                        1,
                                        cartMeasurement[id(product)],
                                      )}{" "}
                                      {userCurrencyCode}
                                    </span>
                                    <span className="text-sm font-semibold">
                                      ={" "}
                                      {(
                                        (cartQuantity[id(product)] ??
                                          quantity) *
                                        Number(
                                          newPrice(
                                            product,
                                            userCurrencyCode,
                                            rates,
                                            1,
                                            cartMeasurement[id(product)],
                                          ),
                                        )
                                      ).toFixed(2)}{" "}
                                      {userCurrencyCode}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-x-2 items-center">
                                    <p className="text-md font-semibold">
                                      {newPrice(
                                        product,
                                        userCurrencyCode,
                                        rates,
                                        cartQuantity[id(product)],
                                        cartMeasurement[id(product)],
                                      )}{" "}
                                      {userCurrencyCode}
                                    </p>
                                    <p className="line-through text-sm text-muted-foreground">
                                      {price(
                                        product,
                                        userCurrencyCode,
                                        rates,
                                        cartQuantity[id(product)],
                                        cartMeasurement[id(product)],
                                      )}
                                    </p>
                                    <p className="text-xs text-destructive font-medium">
                                      Save{" "}
                                      {save(
                                        product,
                                        userCurrencyCode,
                                        rates,
                                        cartQuantity[id(product)],
                                        cartMeasurement[id(product)],
                                      )}{" "}
                                      {userCurrencyCode}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="w-full lg:col-span-4 space-y-3 lg:sticky lg:top-24">
              <Card>
                <CardHeader className="">
                  <CardTitle>Summary</CardTitle>
                  <ScrollArea className="w-full mt-2 overflow-auto">
                    <div className="flex gap-3">
                      {cartItems &&
                        cartItems.map(({ products: product }, i) => (
                          <div
                            key={`${product.name}-${i}`}
                            className="w-12 h-14 shrink-0 flex items-center justify-center rounded border bg-muted/30"
                          >
                            <img
                              loading="lazy"
                              src={product.thumbnail}
                              alt=""
                              className="object-contain max-w-full h-full"
                            />
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardHeader>
                <CardContent className="space-y-2 ">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <p>Items total:</p>
                    <p className="line-through">
                      {total.toFixed(2)} {userCurrencyCode}
                    </p>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <p>Items discount:</p>
                    <p className="text-destructive">
                      -{(total - subtotal).toFixed(2)} {userCurrencyCode}
                    </p>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <p>Shipping: </p>
                    <p>
                      {shippingCost.toFixed(2)} {userCurrencyCode}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total: </p>
                    <p>
                      {(subtotal + shippingCost).toFixed(2)} {userCurrencyCode}
                    </p>
                  </div>
                  <Button
                    className="w-full text-lg transition-all mt-2"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </CardContent>
              </Card>
              <Card className="gap-1">
                <CardHeader className="">
                  <CardTitle className="">Pay with</CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="flex gap-2">
                    {paymentOptions.map((pay, i) => (
                      <div
                        key={i}
                        className="p-1 w-8 h-8 border rounded flex items-center justify-center"
                      >
                        <img
                          loading="lazy"
                          src={pay}
                          alt=""
                          className="object-contain max-w-full h-full"
                        />
                      </div>
                    ))}
                    <div className="p-1 border rounded flex items-center justify-center">
                      <p className="text-muted-foreground text-xs">more...</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h1 className=" text-heading font-semibold">
                      Free International Returns
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Free International returns are available for the shipping
                      address you chose in case product came in unexpected
                      state.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Cart;
