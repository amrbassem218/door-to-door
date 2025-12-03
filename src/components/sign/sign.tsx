"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import * as React from "react";
import { FaAngleRight } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import LoginCard from "@/app/login/loginCard";
import { useUser } from "@/utils/getUser";
import { getDisplayName, handleLogout } from "@/utils/user-utils";
import { useRouter } from "next/navigation";

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
              <LuUser className="text-2xl lg:text-3xl" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className=""
                  onClick={() => router.push("/add_product")}
                >
                  Add a product
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button className="text-red-500" onClick={() => handleLogout()}>
                  Log out
                </button>
              </DropdownMenuItem>
              {/* <DropdownMenuGroup>
              </DropdownMenuGroup> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger className="flex items-center gap-1">
            {/* Sign in for pc */}
            <div className="text-left font-medium text-muted text-xs sm:block hidden">
              <p className="text-muted">Hello there</p>
              <p className="text-primary-foreground">Sign in/Register</p>
            </div>

            {/* Sign in for mobile */}
            <div className="sm:hidden flex items-center">
              <p className="">sign in</p>
              <FaAngleRight size={10} className="sm:hidden text-heading" />
            </div>

            <LuUser className="text-primary-foreground text-2xl lg:text-3xl" />
          </DialogTrigger>
          <DialogContent className="p-10 w-120 ">
            <LoginCard />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Sign;
