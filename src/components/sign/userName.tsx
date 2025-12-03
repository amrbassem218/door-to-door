import { DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/utils/getUser";
import { getDisplayName } from "@/utils/user-utils";
import * as React from "react";
import { FaAngleRight } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
interface IUserNameDisplayProps {}

const UserNameDisplay: React.FunctionComponent<IUserNameDisplayProps> = (
  props
) => {
  const { user } = useUser();
  return (
    <div>
      {user ? (
        <p className=" text-sm font-semibold">{getDisplayName(user)}</p>
      ) : (
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
      )}
    </div>
  );
};

export default UserNameDisplay;
