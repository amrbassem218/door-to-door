import Link from "next/link";
import * as React from "react";
import Menu from "../home/menu";
import Sign from "../sign/sign";
import SearchBar from "../ui/searchBar";
import CartHeader from "./cartHeader";
import ChangeInfo from "./changeInfo";
import GoBackButton from "./goBackButton";

interface IHeaderProps {
  showSearch?: boolean;
}

const Header: React.FunctionComponent<IHeaderProps> = ({ showSearch }) => {
  // const location = useLocation();
  // ${
  //         location.pathname == "/" && "sm:absolute"
  //       }
  return (
    <div className={`top-0 left-0   w-full z-50 `}>
      {/* <TopBar/> */}
      <div className=" w-full bg-transparent text-accent">
        <div className="px-8 max-w-450 mx-auto ">
          <div className="flex items-center justify-between w-full lg:h-20 lg:gap-15 h-12 ">
            {/* Logo & Menu */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <GoBackButton />
                <Menu />
              </div>
              <Link
                className="cursor-pointer font-semibold lg:text-3xl text-lg"
                style={{ fontFamily: '"Playfair Display", serif' }}
                href={"/"}
              >
                EGEEX
              </Link>
            </div>

            <div className="flex-1 hidden sm:inline">
              <SearchBar styles="w-full" />
            </div>

            <div className="flex gap-5">
              {/* Language & currency */}
              <ChangeInfo />
              {/* Sign */}
              <div className="flex gap-1 items-center ">
                <Sign />
              </div>

              {/* Cart */}
              <CartHeader />
            </div>
          </div>
        </div>
        {/* <Separator className='w-full'/> */}
        {/* <div className={`hidden sm:block `}>
          <TopicBar />
        </div> */}

        {/* Mobile stuff */}
        <div className="sm:hidden ">
          {/* Mobile Search */}
          <div className="mx-10 my-2">
            {showSearch && <SearchBar styles="" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
