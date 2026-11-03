import CartSheet from "@/components/ui/cartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrencyRates } from "@/getRates";
import type { Product } from "@/types/types";
import { measurements, newPrice } from "@/utilities";
import type { Dispatch, SetStateAction } from "react";
import * as React from "react";
import { CiLocationOn } from "react-icons/ci";
import { FaAngleRight, FaChevronDown, FaHeart } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "./button";

import { useUserCurrencyCode } from "@/contexts/currencyContext";
import { useUserLocation } from "@/contexts/locationContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { addProductToCart } from "@/utils/cart-utils";
import { useUser } from "@/utils/getUser";
import NavigationButton from "../navigationButton";
import { toast } from "sonner";
interface IProductSideBarProps {
  product: Product;
  measurement: string;
  setMeasurement: Dispatch<SetStateAction<string>>;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  handleMeasurementChange: (mes: string) => void;
  handleQuantityChange: (type: string) => void;
  headerHeight: number;
}

const ProductSideBar: React.FunctionComponent<IProductSideBarProps> = ({
  product,
  measurement,
  setMeasurement,
  quantity,
  setQuantity,
  handleMeasurementChange,
  handleQuantityChange,
  headerHeight,
}) => {
  const { rates, loading } = useCurrencyRates();
  const userCurrencyCode = useUserCurrencyCode();
  const [userLocation, setUserLocation] = useUserLocation();
  const { user } = useUser();
  const { executeWithAuth } = useRequireAuth();
  const handleBuyNow = executeWithAuth(async () => {
    if (!user) return; // Type guard - user is guaranteed to exist by executeWithAuth

    addProductToCart(user, product, quantity).then((status) => {
      if (status == "success") {
        console.log("product added sucessfully");
      } else {
        console.log("couldn't add product");
      }
    });
  });
  const handleAddToFavorites = executeWithAuth(async (product: Product) => {
    if (!user) return; // Type guard - user is guaranteed to exist by executeWithAuth
    // TODO: Add to favorites logic here
    toast.success("Added to favorites!");
  });
  if (loading) return <p>loading...</p>;
  const inStock = !!product?.stockCount;
  return (
    <aside
      className="w-full border border-border rounded-md p-5 sticky flex flex-col gap-5 overflow-y-auto bg-background"
      style={{
        top: `${headerHeight + 20}px`,
        height: `calc(100vh - ${headerHeight + 40}px)`,
      }}
    >
      {/* Price */}
      <div className="space-y-1">
        <p className="text-3xl font-bold leading-tight">
          {newPrice(product, userCurrencyCode, rates, quantity, measurement)}{" "}
          <span className="text-lg font-semibold">{userCurrencyCode}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {newPrice(product, userCurrencyCode, rates, 1, measurement)}{" "}
          {userCurrencyCode} / {measurement}
        </p>
        <Popover>
          <PopoverTrigger>
            <div className="text-primary text-sm text-left hover:underline decoration-1 cursor-pointer">
              International Returns
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <h1 className="font-medium">Return this item </h1>
            <p className="text-sm">
              International returns are available for the shipping address you
              chose. You can return the item for any reason in new and unused
              condition: return shipping charges may apply.
            </p>
          </PopoverContent>
        </Popover>
      </div>

      {/* Stock */}
      <div
        className={`flex items-center gap-2 text-lg font-semibold ${
          inStock ? "text-green-600" : "text-red-600"
        }`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            inStock ? "bg-green-600" : "bg-red-600"
          }`}
        />
        {inStock ? "In stock" : "Out of stock"}
      </div>

      {/* Delivery & seller */}
      <div className="rounded-md bg-background-secondary divide-y text-sm">
        <div className="flex justify-between gap-6 p-3 cursor-pointer">
          <p className="font-medium shrink-0">Ship to</p>
          <div className="flex items-center min-w-0 gap-1">
            <CiLocationOn className="shrink-0" />
            <p className="truncate hover:underline">{userLocation?.adress}</p>
            <FaAngleRight size={12} className="shrink-0" />
          </div>
        </div>
        <div className="flex justify-between gap-6 p-3 cursor-pointer">
          <p className="font-medium shrink-0">Sold by</p>
          <div className="flex items-center min-w-0 gap-1">
            <p className="truncate hover:underline">{product.seller}</p>
            <FaAngleRight size={12} className="shrink-0" />
          </div>
        </div>
      </div>

      {/* Size & quantity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-sm">Size</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="text-sm bg-background py-1.5 px-3 rounded-md border flex items-center gap-4 hover:bg-gray-100">
                {measurement}
                <FaChevronDown className="text-muted text-xs" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {measurements.map((mes) => (
                <DropdownMenuItem
                  key={mes}
                  className="hover:bg-gray-100"
                  onClick={() => handleMeasurementChange(mes)}
                >
                  {mes}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-sm">Quantity</p>
          <div className="flex items-center">
            <button
              className="border p-1.5 cursor-pointer rounded-l-md hover:bg-gray-100"
              onClick={() => handleQuantityChange("minus")}
            >
              <FiMinus size={16} />
            </button>
            <input
              type="number"
              value={quantity}
              className="border-y px-2 h-[30px] text-center"
              style={{
                width: `${Math.max(
                  3,
                  Math.min(8, quantity.toString().length + 1),
                )}rem`,
              }}
              onChange={(e) => handleQuantityChange(e.target.value)}
            />
            <button
              className="border border-primary p-1.5 cursor-pointer bg-primary text-white rounded-r-md"
              onClick={() => handleQuantityChange("plus")}
            >
              <FiPlus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Actions (pinned to the bottom) */}
      <div className="mt-auto space-y-3">
        <CartSheet product={product} quantity={quantity} />
        <div className="flex gap-2 w-full">
          <NavigationButton
            href={"/cart"}
            shadcn={true}
            className="flex-1"
            onClick={() => handleBuyNow()}
          >
            Buy Now
          </NavigationButton>
          <Button
            variant={"outline"}
            className="text-muted w-10 hover:text-red-500"
            onClick={() => handleAddToFavorites(product)}
          >
            <FaHeart />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default ProductSideBar;
