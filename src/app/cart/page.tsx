import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartItem, Product } from "@/types/types";
import { newPrice, unitChange, price, save } from "@/utilities";
import * as React from "react";
import { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabaseClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import MeasurementChange from "@/components/ui/measurementChange";
import QuantityChange from "@/components/ui/quantityChange";
import { getProfile } from "@/userContext";
import { useCurrencyRates } from "@/getRates";
import { useUser } from "@/utils/getUser";
import { cleanupDuplicateCarts, getCart } from "@/utils/cart-utils";
import Link from "next/link";

interface ICartProps {}

const Cart: React.FunctionComponent<ICartProps> = (props) => {
  const user = useUser();
  const [cart, setCart] = useState<Record<number, CartItem[]>>();
  const [cartItems, setCartItems] = useState<CartItem[]>();
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [cartQuantity, setCartQuantity] = useState<Record<number, number>>({});
  const [cartMeasurement, setCartMeasurement] = useState<
    Record<number, string>
  >({});

  const { rates, loading } = useCurrencyRates();
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState(
    userProfile?.userProfile?.currencies.currencyCode ?? "USD"
  );
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
    if (user) {
      const handleGetCartItems = async () => {
        try {
          // First clean up any duplicate carts
          await cleanupDuplicateCarts(user);

          // Then get cart items
          const data = await getCart(user);
          if (data) {
            let currentTotal = 0;
            let currentSubTotal = 0;
            const currentCartQuantity = cartQuantity;
            const currentCartMeasurement = cartMeasurement;
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
                userCurrency,
                rates,
                currentCartQuantity[id(product)],
                currentCartMeasurement[id(product)]
              );
              currentSubTotal += newPrice(
                product,
                userCurrency,
                rates,
                currentCartQuantity[id(product)],
                currentCartMeasurement[id(product)]
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
          }
        } catch (error) {
          console.error("Error getting cart items:", error);
        }
      };
      handleGetCartItems();
    }
  }, [user, cartQuantity, cartMeasurement]);
  const handleMeasurementChange = (mes: string, product?: Product) => {
    if (product) {
      const pid = id(product);
      const convertedMeasurement = Number(
        unitChange(cartQuantity[pid], cartMeasurement[pid], mes)
      );
      setCartQuantity({ ...cartQuantity, [pid]: convertedMeasurement });
      setCartMeasurement({ ...cartMeasurement, [pid]: mes });
      localStorage.setItem(`${product.id}_measurement`, mes);
      localStorage.setItem(
        `${product.id}_quantity`,
        convertedMeasurement.toString()
      );
    }
  };
  const handleQuantityChange = (type: string, product?: Product) => {
    if (product) {
      const qnt = cartQuantity[id(product)];
      if (type == "plus") {
        setCartQuantity({
          ...cartQuantity,
          [product.id]: cartQuantity && qnt + 1,
        });
        localStorage.setItem(`${product.id}_quantity`, (qnt + 1).toString());
      } else if (type == "minus") {
        setCartQuantity({
          ...cartQuantity,
          [product.id]: cartQuantity && qnt - 1,
        });
        localStorage.setItem(`${product.id}_quantity`, (qnt - 1).toString());
      } else {
        setCartQuantity({ ...cartQuantity, [id(product)]: Number(type) });
        localStorage.setItem(`${product.id}_quantity`, type);
      }
    }
  };
  const handleDeleteItem = async (
    product: Product,
    sellerId: number,
    index: number
  ) => {
    if (cart) {
      const newSellerList = cart[sellerId];
      newSellerList.splice(index, 1);
      setCart({ ...cart, [sellerId]: newSellerList });
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("product_id", product.id);
      if (error) {
        console.log("can't delete product");
        console.error(error);
      }
    }
  };
  if (loading) return <p>Loading prices...</p>;

  return (
    <div>
      {cart && (
        <section className="w-screen absolute left-0 h-screen bg-gray-100 sm:px-40 px-5">
          {/* Cart Section */}
          <div className="w-full mx-auto flex flex-col sm:grid grid-cols-12 gap-5 mt-5">
            <div className="col-span-8 space-y-2">
              {/* Cart Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Cart ({cartItems?.length})</CardTitle>
                </CardHeader>
              </Card>

              {/* Cart */}
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {Object.keys(cart).map((sellerId) => (
                    <div key={sellerId} className="space-y-3 cursor-pointer">
                      {cart[Number(sellerId)].map(
                        (
                          { products: product, quantity, measurement },
                          index
                        ) => (
                          <div
                            key={index}
                            className="flex gap-3 w-full p-3 border border-gray-200 rounded-lg transition-all"
                          >
                            <Link href={`/product/${product.id}`}>
                              <div className="w-15 h-20 flex-shrink-0 flex items-center justify-center">
                                <img
                                  loading="lazy"
                                  src={product.thumbnail}
                                  alt=""
                                  className="object-contain max-w-full h-full"
                                />
                              </div>
                            </Link>

                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex justify-between items-center w-full">
                                <Link href={`/product/${product.id}`}>
                                  <div className="flex-1 min-w-0">
                                    <h1 className="truncate text-sm">
                                      {product.name}
                                    </h1>
                                  </div>
                                </Link>
                                <div className="flex gap-2 items-center flex-shrink-0">
                                  {/* Measurement change */}
                                  <div>
                                    <MeasurementChange
                                      handleMeasurementChange={
                                        handleMeasurementChange
                                      }
                                      product={product}
                                      label={cartMeasurement[id(product)]}
                                    />
                                  </div>
                                  {/* Qty. */}
                                  <div>
                                    <QuantityChange
                                      handleQuantityChange={
                                        handleQuantityChange
                                      }
                                      value={cartQuantity[id(product)]}
                                      product={product}
                                    />
                                  </div>

                                  {/* Delete */}
                                  <MdDeleteOutline
                                    size={18}
                                    className="hover:text-red-500 transition-all cursor-pointer"
                                    onClick={() =>
                                      handleDeleteItem(
                                        product,
                                        Number(sellerId),
                                        index
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <Link href={`/product/${product.id}`}>
                                <div>
                                  {/* Price */}
                                  <div className="flex gap-1 items-center">
                                    <h1 className="text-md font-semibold ">
                                      {newPrice(
                                        product,
                                        userCurrency,
                                        rates,
                                        cartQuantity[id(product)],
                                        cartMeasurement[id(product)]
                                      )}{" "}
                                      {userCurrency}
                                    </h1>
                                    <p className="line-through text-sm text-muted">
                                      {price(
                                        product,
                                        userCurrency,
                                        rates,
                                        cartQuantity[id(product)],
                                        cartMeasurement[id(product)]
                                      )}
                                    </p>
                                  </div>
                                  <p className="text-xs text-red-600 font-medium">
                                    Save{" "}
                                    {save(
                                      product,
                                      userCurrency,
                                      rates,
                                      cartQuantity[id(product)],
                                      cartMeasurement[id(product)]
                                    )}{" "}
                                    {userCurrency}
                                  </p>
                                  <p className="text-muted text-xs">
                                    Shipping: 543 {userCurrency}
                                  </p>
                                </div>
                              </Link>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="col-span-4 space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <ScrollArea className="w-full mt-2 overflow-auto">
                    <div className="flex gap-3 ">
                      {cartItems &&
                        cartItems.map(({ products: product }) => (
                          <div className="w-10 h-15  overflow-auto flex items-center justify-center">
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
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-muted text-sm">
                    <p className="">Items total:</p>
                    <p className="line-through">
                      {" "}
                      {total.toFixed(2)} {userCurrency}
                    </p>
                  </div>
                  <div className="flex justify-between text-muted text-sm">
                    <p>Items discount:</p>
                    <p className="text-red-500">
                      -{(total - subtotal).toFixed(2)} {userCurrency}
                    </p>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <p>Subtotal: </p>
                    <p>
                      {subtotal.toFixed(2)} {userCurrency}
                    </p>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <p>Shipping: </p>
                    <p>1000 {userCurrency}</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total: </p>
                    <p>
                      {(subtotal + 1000).toFixed(2)} {userCurrency}
                    </p>
                  </div>
                  <Button className="w-full text-lg bg-red-500 hover:bg-red-600 transition-all">
                    Checkout
                  </Button>
                </CardContent>
              </Card>
              <Card className="gap-1">
                <CardHeader>
                  <CardTitle className="">Pay with</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {paymentOptions.map((pay) => (
                      <div className="p-1 w-7 h-7 border-1 flex items-center justify-center">
                        <img
                          loading="lazy"
                          src={pay}
                          alt=""
                          className="object-contain max-w-full h-full"
                        />
                      </div>
                    ))}
                    <div className="p-1 border-1 flex items-center justify-center">
                      <p className="text-muted text-xs">more...</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h1 className=" text-heading font-semibold">
                      Free International Returns
                    </h1>
                    <p className="text-muted text-sm">
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
