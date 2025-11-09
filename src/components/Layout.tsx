// src/components/Layout.tsx
import { Outlet, useLocation, useViewTransitionState } from "react-router-dom";
import Header from "./header/Header";
import BottomBar from "./ui/bottomBar";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function Layout() {
  const location = useLocation();
  const noHeader = ["settings"];
  const noFooter = ["location"];
  const noBottomBar = ["location"];
  const noSearch = ["location"];
  const [showHeader, setShowHeader] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [showTopicBar, setShowTopicBar] = useState(true);
  useEffect(() => {
    if (location) {
      setShowHeader(true);
      setShowBottomBar(true);
      setShowFooter(true);
      setShowSearch(true);
      noHeader.forEach((ban) => {
        if (location.pathname.includes(ban)) {
          setShowHeader(false);
        }
      });
      noFooter.forEach((ban) => {
        if (location.pathname.includes(ban)) {
          setShowFooter(false);
        }
      });
      noBottomBar.forEach((ban) => {
        if (location.pathname.includes(ban)) {
          setShowBottomBar(false);
        }
      });
      noSearch.forEach((ban) => {
        if (location.pathname.includes(ban)) {
          setShowSearch(false);
        }
      });
      if (location.pathname != "/") {
        setShowTopicBar(false);
      }
    }
  }, [location]);

  // Set CSS custom property for header height
  useEffect(() => {
    const setHeaderHeight = () => {
      if (showHeader) {
        const headerHeight = showSearch ? "9.25rem" : "6.75rem"; // 37*0.25rem and 27*0.25rem respectively
        document.documentElement.style.setProperty(
          "--header-height",
          headerHeight
        );
      } else {
        document.documentElement.style.setProperty("--header-height", "0rem");
      }
    };
    setHeaderHeight();
  }, [showHeader, showSearch]);

  // Calculate margin classes based on header, search, and topic bar visibility
  const getMarginClasses = () => {
    if (!showHeader) return "mb-12";

    let baseMargin = showSearch ? "mt-26" : "mt-17";
    let smMargin = showSearch ? "sm:mt-36" : "sm:mt-27";

    // If topic bar is hidden on sm and up, subtract its height (h-15 = 3.75rem = 15*0.25rem)
    if (!showTopicBar) {
      // Convert current sm margins to numbers and subtract 15
      if (showSearch) {
        // sm:mt-36 (36*0.25rem = 9rem) - 15*0.25rem = 21*0.25rem = mt-21
        smMargin = "sm:mt-21";
      } else {
        // sm:mt-27 (27*0.25rem = 6.75rem) - 15*0.25rem = 12*0.25rem = mt-12
        smMargin = "sm:mt-12";
      }
    }

    return `${baseMargin} ${smMargin} mb-12`;
  };

  return (
    <div className="flex">
      {showHeader && <Header showSearch={showSearch} />}
      <main className={`${getMarginClasses()} flex-1`}>
        <Outlet />
      </main>
      {showBottomBar && <BottomBar />}
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
