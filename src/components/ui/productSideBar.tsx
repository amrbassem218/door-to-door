import CartSheet from "@/components/ui/cartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrencyRates } from "@/getRates";
import type { Product } from "@/types/types";
import { measurements, newPrice } from "@/utilities";
import type { Dispatch, SetStateAction } from "react";
import * as React from "react";
import { Button } from "./button";

import { useUserCurrencyCode } from "@/contexts/currencyContext";
import { useUserLocation } from "@/contexts/locationContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { addProductToCart } from "@/utils/cart-utils";
import { useUser } from "@/utils/getUser";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";
import NavigationButton from "../navigationButton";

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

const ICONS = "/icons/sidebar";
// Scales the whole sidebar up while keeping the Figma proportions.
const SCALE = 1.2;

const Icon = ({
  name,
  size,
  className = "",
}: {
  name: string;
  size: number;
  className?: string;
}) => (
  <img
    src={`${ICONS}/${name}.png`}
    alt=""
    width={size}
    height={size}
    className={`shrink-0 object-contain pointer-events-none ${className}`}
    style={{ width: size, height: size }}
  />
);

const Divider = () => <div className="h-px w-full bg-border" />;

/** Row with a label on the left and a value + chevron on the right. */
const InfoRow = ({
  label,
  value,
  trailingIcon,
}: {
  label: string;
  value?: string;
  trailingIcon?: string;
}) => (
  <div className="flex items-center justify-between gap-3 cursor-pointer">
    <p className="text-xs font-medium text-foreground shrink-0">{label}</p>
    <div className="flex items-center min-w-0">
      <p className="truncate text-xs text-muted-foreground max-w-40 hover:underline">
        {value}
      </p>
      <Icon name={trailingIcon ?? "forward"} size={12} />
    </div>
  </div>
);

/** Row used inside the "EGEEX commitments" block. */
const CommitmentRow = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-2 cursor-pointer">
    <div className="flex items-start gap-1 min-w-0">
      <Icon name={icon} size={16} />
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-xs font-medium text-foreground leading-none">
          {title}
        </p>
        {children}
      </div>
    </div>
    <Icon name="forward" size={12} />
  </div>
);

const ProductSideBar: React.FunctionComponent<IProductSideBarProps> = ({
  product,
  measurement,
  quantity,
  handleMeasurementChange,
  handleQuantityChange,
  headerHeight,
}) => {
  const { rates, loading } = useCurrencyRates();
  const userCurrencyCode = useUserCurrencyCode();
  const [userLocation] = useUserLocation();
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
  const BASE_LIKES = 16;
  const [liked, setLiked] = React.useState(false);
  const [popKey, setPopKey] = React.useState(0);
  React.useEffect(() => {
    try {
      setLiked(localStorage.getItem(`${product.id}_liked`) === "1");
    } catch {}
  }, [product.id]);
  const handleToggleLike = () => {
    const next = !liked;
    setLiked(next);
    setPopKey((k) => k + 1);
    try {
      localStorage.setItem(`${product.id}_liked`, next ? "1" : "0");
    } catch {}
    toast.success(next ? "Added to favorites!" : "Removed from favorites");
  };
  if (loading) return <p>loading...</p>;

  const hasDiscount = product.discount > 0;
  const originalPrice = newPrice(
    { ...product, discount: 0 },
    userCurrencyCode,
    rates,
    quantity,
    measurement,
  );

  return (
    <aside
      className="w-full border border-border rounded-sm p-3 sticky flex flex-col gap-3 self-start bg-background"
      style={{
        zoom: SCALE,
        top: `${headerHeight / SCALE}px`,
      }}
    >
      {/* Price */}
      <div className="flex flex-col gap-1">
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold leading-none text-primary">
            {userCurrencyCode}
            {newPrice(product, userCurrencyCode, rates, quantity, measurement)}
          </p>
          {hasDiscount && (
            <p className="text-xs leading-none line-through text-muted-foreground">
              {userCurrencyCode}
              {originalPrice}
            </p>
          )}
        </div>
        <p className="text-[8px] leading-none text-muted-foreground">
          Tax excluded, add at checkout if applicable
        </p>
      </div>
      <Divider />

      {/* Seller & delivery */}
      <div className="flex flex-col gap-3">
        <InfoRow label="Sold by" value={product.seller} />
        <Divider />
        <InfoRow
          label="Ship to"
          value={userLocation?.adress}
          trailingIcon="location"
        />
        <Divider />
      </div>

      {/* EGEEX commitments */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-secondary text-secondary-foreground font-serif font-bold text-xs leading-none px-1.5 py-0.5">
            Choice
          </span>
          <p className="font-serif font-bold text-xs leading-none text-foreground">
            EGEEX commitments
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <CommitmentRow icon="in-transit" title="Free shipping">
            <p className="text-[8px] leading-none text-muted-foreground">
              Delivery:{" "}
              <span className="font-medium text-foreground">Dec 16-24</span>
            </p>
          </CommitmentRow>
          <CommitmentRow icon="transaction" title="Return & Refund Policy" />
          <CommitmentRow icon="protect" title="Security & Privacy">
            <div className="text-[8px] leading-tight text-muted-foreground">
              <p className="line-clamp-1">
                Safe Payments: We do not share your personal details, or credit
                card information with sellers.
              </p>
              <p className="line-clamp-1">
                Secure personal details: We protect your privacy and keep your
                personal details safe and secure.
              </p>
            </div>
          </CommitmentRow>
        </div>
        <Divider />
      </div>

      {/* Quantity & size */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold leading-none text-foreground">
              Quantity
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="size-[18px] rounded-full bg-background-muted flex items-center justify-center cursor-pointer"
                onClick={() => handleQuantityChange("minus")}
              >
                <Icon name="minus" size={8} />
              </button>
              <input
                type="number"
                value={quantity}
                aria-label="Quantity"
                className="text-xs font-bold text-center text-foreground bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{
                  width: `${Math.max(1, quantity.toString().length)}.5rem`,
                }}
                onChange={(e) => handleQuantityChange(e.target.value)}
              />
              <button
                type="button"
                aria-label="Increase quantity"
                className="size-[18px] rounded-full bg-background-muted flex items-center justify-center cursor-pointer"
                onClick={() => handleQuantityChange("plus")}
              >
                <Icon name="plus" size={8} />
              </button>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-6 min-w-18 px-1 py-1 rounded-xs bg-background-muted flex items-center justify-between gap-1 text-xs cursor-pointer"
              >
                <span>
                  <span className="text-muted-foreground">Size:</span>{" "}
                  <span className="font-bold text-foreground">
                    {measurement}
                  </span>
                </span>
                <Icon name="expand-arrow" size={12} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {measurements.map((mes) => (
                <DropdownMenuItem
                  key={mes}
                  className="hover:bg-background-muted"
                  onClick={() => handleMeasurementChange(mes)}
                >
                  {mes}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!!product.minOrder && (
          <p className="text-[8px] leading-none text-foreground">
            min. Order {product.minOrder} {measurement} / shopper
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <NavigationButton
          href={"/cart"}
          shadcn={true}
          className="w-full h-[34px] rounded-none text-xs font-bold"
          onClick={() => handleBuyNow()}
        >
          Buy Now
        </NavigationButton>
        <CartSheet
          product={product}
          quantity={quantity}
          styles="w-full max-w-none! h-[34px] rounded-none text-xs font-bold border-secondary text-secondary bg-transparent hover:bg-transparent"
        />
        <div className="grid grid-cols-2 gap-2">
          {/* Negotiate: not available yet */}
          <div
            className="group relative cursor-not-allowed"
            title="Coming soon"
          >
            <Button
              variant="ghost"
              disabled
              aria-disabled="true"
              className="h-[34px] w-full rounded-none bg-background-muted text-xs font-bold gap-1 disabled:opacity-100 pointer-events-none"
            >
              <span className="flex items-center gap-1 group-hover:hidden">
                <Icon name="chat" size={16} />
                Negotiate
              </span>
              <span className="hidden group-hover:inline text-muted-foreground">
                Coming soon
              </span>
            </Button>
          </div>

          {/* Love / favorite */}
          <Button
            variant="ghost"
            aria-pressed={liked}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            className={`h-[34px] rounded-none text-xs font-bold gap-1 transition-colors active:scale-95 ${
              liked
                ? "bg-destructive/10 text-destructive hover:bg-destructive/15"
                : "bg-background-muted hover:bg-border"
            }`}
            onClick={handleToggleLike}
          >
            <span key={popKey} className={popKey ? "heart-pop inline-flex" : "inline-flex"}>
              {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
            </span>
            {BASE_LIKES + (liked ? 1 : 0)}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default ProductSideBar;
