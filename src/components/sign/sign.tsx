"use client";
import * as React from "react";
import { FaAngleRight } from "react-icons/fa";
import { LuLogOut, LuPackagePlus, LuSettings, LuShoppingCart, LuUser } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useUser } from "@/utils/getUser";
import { getDisplayName, handleLogout } from "@/utils/user-utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ISignProps {}

const Sign: React.FunctionComponent<ISignProps> = (props) => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div>
      {user ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="font-medium text-left flex sm:gap-1 items-center">
              <div className="flex items-center">
                <div>
                  <p className="text-xs sm:block hidden text-muted-foreground">
                    Hello there,
                  </p>
                  <p className=" text-sm font-semibold">
                    {getDisplayName(user)}
                  </p>
                </div>
                <FaAngleRight size={10} className="sm:hidden text-heading" />
              </div>
              <LuUser className="text-xl lg:text-2xl" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-60 p-1.5">
              <DropdownMenuLabel className="px-2 py-2 font-normal">
                <p className="text-sm font-semibold truncate">
                  {getDisplayName(user)}
                </p>
                {user.email && (
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-3 py-2 cursor-pointer"
                onClick={() => router.push("/account")}
              >
                <LuUser /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-3 py-2 cursor-pointer"
                onClick={() => router.push("/account/settings")}
              >
                <LuSettings /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-3 py-2 cursor-pointer"
                onClick={() => router.push("/cart")}
              >
                <LuShoppingCart /> Cart
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-3 py-2 cursor-pointer"
                onClick={() => router.push("/add_product")}
              >
                <LuPackagePlus /> Add a product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="gap-3 py-2 cursor-pointer"
                onClick={() => handleLogout()}
              >
                <LuLogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link href="/login" className="flex items-center gap-1">
          {/* Sign in for pc */}
          <div className="text-left font-medium text-muted text-xs sm:block hidden">
            <p className="text-muted">Hello there</p>
            <p className="text-text">Sign in/Register</p>
          </div>

          {/* Sign in for mobile */}
          <div className="sm:hidden flex items-center">
            <p className="text-xs">sign in</p>
            <FaAngleRight size={8} className="sm:hidden text-heading" />
          </div>

          <LuUser className="text-text text-xl lg:text-2xl" />
        </Link>
      )}
    </div>
  );
};

export default Sign;
