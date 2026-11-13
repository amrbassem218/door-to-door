"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/utils/getUser";
import { getDisplayName, handleLogout } from "@/utils/user-utils";
import Link from "next/link";
import * as React from "react";
import { FaAngleRight, FaRegHeart } from "react-icons/fa";
import {
  LuLogOut,
  LuPackagePlus,
  LuSettings,
  LuShoppingCart,
} from "react-icons/lu";
import { RiCoupon2Line } from "react-icons/ri";

interface IAccountProps {}

const shortcuts = [
  { icon: FaRegHeart, label: "Favourites", href: "/account" },
  { icon: RiCoupon2Line, label: "Coupons", href: "/account" },
  { icon: LuShoppingCart, label: "Cart", href: "/cart" },
];

const links = [
  { icon: LuSettings, label: "Settings", text: "Profile, currency and shipping", href: "/account/settings" },
  { icon: LuPackagePlus, label: "Add a product", text: "List something to sell", href: "/add_product" },
];

const Account: React.FunctionComponent<IAccountProps> = () => {
  const { user } = useUser();
  const name = user ? getDisplayName(user) : "Sign In / Register";
  const photo = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;
  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w: string) => w.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <div className="bg-background-muted min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-6 md:py-10 space-y-5">
        {/* Account info */}
        <section className="rounded-xl bg-background border p-5 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar className="size-16 md:size-20">
            {photo && <AvatarImage src={photo} alt="" />}
            <AvatarFallback className="text-lg md:text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            {user ? (
              <>
                <h1 className="text-xl md:text-2xl font-semibold truncate">{name}</h1>
                {user.email && (
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                )}
              </>
            ) : (
              <Link href="/login" className="text-xl md:text-2xl font-semibold hover:underline">
                {name}
              </Link>
            )}
          </div>
          {user && (
            <button
              type="button"
              onClick={() => handleLogout()}
              className="inline-flex items-center gap-2 rounded-md border px-4 h-10 text-sm font-medium text-destructive hover:bg-background-muted transition-colors w-fit"
            >
              <LuLogOut /> Log out
            </button>
          )}
        </section>

        {/* Shortcuts */}
        <section className="grid grid-cols-3 gap-3 md:gap-5">
          {shortcuts.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-xl bg-background border p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3 hover:shadow-md hover:border-primary transition-all"
            >
              <Icon className="text-2xl md:text-3xl text-primary" />
              <p className="text-sm md:text-base font-medium">{label}</p>
            </Link>
          ))}
        </section>

        {/* Menu */}
        <section className="rounded-xl bg-background border divide-y overflow-hidden">
          {links.map(({ icon: Icon, label, text, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-4 px-5 md:px-8 py-4 md:py-5 hover:bg-background-muted transition-colors"
            >
              <Icon className="text-xl text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{label}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{text}</p>
              </div>
              <FaAngleRight className="text-muted-foreground" size={12} />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Account;
