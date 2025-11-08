import * as React from "react";
import { Button } from "./button";
import TopicBar from "./topicBar";
import { useLocation, useNavigate } from "react-router-dom";
import Sign from "../sign";
import SearchBar from "./searchBar";
import { Check, ChevronsUpDown } from "lucide-react";
import { countries } from "../countries";
// import { Separator } from './separator';r
import { cn } from "@/lib/utils";
import { getCart, useUser, cleanupDuplicateCarts } from "@/utilities";
import { LuShoppingCart } from "react-icons/lu";
import MobileTopicBar from "./mobileTopicBar";
import Menu from "./menu";
import { getProfile } from "@/userContext";
import GoBackButton from "../header/goBackButton";
import CurrencyDropDown from "../header/currencyDropDown";

interface IHeaderProps {
  showSearch?: boolean;
}

const Header: React.FunctionComponent<IHeaderProps> = ({ showSearch }) => {
  const navigate = useNavigate();
  // const countries
  const egypt = { code: "EG", name: "Egypt" };
  const [userCountry, setUserCountry] = useState(egypt);
  const [userLanguage, setUserLanguage] = useState("EN");
  const [cartLength, setCartLength] = useState(0);
  const user = useUser();
  const rawUserProfile = getProfile();
  const userProfile = rawUserProfile?.userProfile;
  const setUserProfile = rawUserProfile?.setUserProfile;
  useEffect(() => {
    if (user) {
      const handleGetCart = async () => {
        try {
          // First clean up any duplicate carts
          await cleanupDuplicateCarts(user);

          // Then get the cart data
          const data = await getCart(user);
          if (data) {
            setCartLength(data.length);
          }
        } catch (error) {
          console.error("Error handling cart in Header:", error);
          setCartLength(0);
        }
      };
      handleGetCart();
    } else {
      setCartLength(0);
    }
  }, [user]);
  const location = useLocation();
  return (
    <div
      className={`fixed top-0 left-0 w-full bg-primary text-primary-foreground z-50  ${
        location.pathname == "/" && "sm:absolute"
      }`}
    >
      {/* <TopBar/> */}
      <div className=" w-full ">
        <div className="sm:px-20 px-2 mx-auto">
          <div className="flex items-center justify-between w-full lg:h-20 lg:gap-15 h-12 ">
            {/* Logo & Menu */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <GoBackButton />
                <Menu />
              </div>
              <button
                className="cursor-pointer  font-semibold lg:text-3xl text-lg"
                onClick={() => navigate("/")}
              >
                EGEEX
              </button>
            </div>

            <div className="flex-1 hidden sm:inline">
              {showSearch && <SearchBar styles="w-full" />}
            </div>

            <div className="flex gap-5">
              {/* Language & currency */}
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden sm:block">
                  <div className="flex items-center gap-2 cursor-pointer">
                    {/* flag */}
                    <div>
                      <Flag code={userCountry.code} className="w-7 h-7" />
                    </div>
                    <div className="text-xs">
                      <p className="text-muted-foreground">{userLanguage}/</p>
                      <p className="">{userProfile?.currency}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-70 bg-background px-5 py-3 space-y-3">
                  {/*  Location */}
                  <div>
                    <h1 className="text-xl font-bold">Ship to</h1>
                    {/* <LocationDialog userProfile ={userProfile}/> */}
                  </div>

                  {/* Currency */}
                  <CurrencyDropDown />
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Sign */}
              <div className="flex gap-1 items-center ">
                <Sign />
              </div>

              {/* Cart */}
              <div
                className="flex gap-1 items-center cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <LuShoppingCart className="text-2xl lg:text-3xl" />
                <div className="flex-col  justify-center items-center hidden md:flex">
                  <div className="w-10 h-3 bg-secondary flex items-center justify-center p-2 rounded-md">
                    <p className="text-sm font-bold text-secondary-foreground">
                      {cartLength}
                    </p>
                  </div>
                  <button className="text-sm font-semibold ">Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Separator className='w-full'/> */}
        <div
          className={`hidden sm:block ${
            location.pathname != "/" && "sm:hidden"
          }`}
        >
          <TopicBar />
        </div>

        {/* Mobile stuff */}
        <div className="sm:hidden ">
          {/* Mobile Search */}
          <div className="mx-10 my-2">
            {showSearch && <SearchBar styles="" />}
          </div>

          {/* Mobile Tabs */}
          <div className="my-2 hidden">
            <MobileTopicBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
